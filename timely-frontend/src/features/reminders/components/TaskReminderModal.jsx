import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Modal from "../../../shared/components/ui/Modal";
import { useOrders } from "../../../hooks/useOrders";

const toLocalInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const TaskReminderModal = ({ task, reminder, onClose }) => {
  const {
    reminderActionId,
    scheduleTaskReminder,
    rescheduleTaskReminder,
    cancelTaskReminder,
    removeTaskReminder,
  } = useOrders();
  const [remindAt, setRemindAt] = useState(() =>
    toLocalInputValue(reminder?.remindAt),
  );
  const [minimumReminderTime] = useState(() =>
    toLocalInputValue(new Date(Date.now() + 60000)),
  );
  const [error, setError] = useState("");
  const isWorking = reminderActionId === (reminder?.id || task.id);

  const validateReminderTime = () => {
    const selectedTime = new Date(remindAt);
    const deadline = new Date(`${task.dueDate}T${task.dueTime}`);

    if (!remindAt || selectedTime.getTime() <= Date.now()) {
      return "Choose a future reminder time.";
    }

    if (selectedTime > deadline) {
      return "Reminder time cannot be after the task deadline.";
    }

    return "";
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const validationError = validateReminderTime();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      if (reminder) {
        await rescheduleTaskReminder(reminder.id, remindAt);
      } else {
        await scheduleTaskReminder(task.id, remindAt);
      }
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelTaskReminder(reminder.id);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this reminder permanently?")) return;

    try {
      await removeTaskReminder(reminder.id);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Reminder for ${task.item}`}>
      <form className="space-y-4 p-5" onSubmit={handleSave}>
        <div className="rounded-sm bg-primary/5 p-3 text-sm">
          <p className="font-semibold">Task #{task.displayId}</p>
          <p className="mt-1 text-muted-foreground">
            Due {task.dueDate} at {task.dueTime}
          </p>
        </div>

        <Input
          autoFocus
          id="task-reminder-time"
          label={reminder ? "Reschedule reminder" : "Reminder time"}
          min={minimumReminderTime}
          onChange={(event) => {
            setRemindAt(event.target.value);
            setError("");
          }}
          required
          type="datetime-local"
          value={remindAt}
        />

        {error && <p className="text-sm text-danger" role="alert">{error}</p>}

        <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-4">
          <div className="flex gap-2">
            {reminder && (
              <>
                <Button
                  disabled={isWorking}
                  onClick={handleCancel}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Cancel Reminder
                </Button>
                <Button
                  disabled={isWorking}
                  onClick={handleDelete}
                  size="sm"
                  type="button"
                  variant="danger"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} size="sm" type="button" variant="ghost">
              Close
            </Button>
            <Button disabled={isWorking} size="sm" type="submit">
              {reminder ? "Save Time" : "Set Reminder"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

TaskReminderModal.propTypes = {
  task: PropTypes.object.isRequired,
  reminder: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default TaskReminderModal;
