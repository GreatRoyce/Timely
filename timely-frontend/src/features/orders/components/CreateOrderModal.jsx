import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Modal from "../../../shared/components/ui/Modal";
import Select from "../../../shared/components/ui/Select";
import Textarea from "../../../shared/components/ui/Textarea";
import { useOrders } from "../../../hooks/useOrders";

const initialForm = {
  customerName: "",
  phone: "",
  item: "",
  dueDate: "",
  dueTime: "",
  priority: "Normal",
  notes: "",
};

const CreateOrderModal = () => {
  const { isCreateOrderOpen, closeCreateOrder, addOrder } = useOrders();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleClose = () => {
    setForm(initialForm);
    setError("");
    closeCreateOrder();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.customerName ||
      !form.phone ||
      !form.item ||
      !form.dueDate ||
      !form.dueTime
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const taskDeadline = new Date(`${form.dueDate}T${form.dueTime}`);

    if (taskDeadline.getTime() <= Date.now()) {
      setError("Task deadline must be in the future.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addOrder(form);
      setForm(initialForm);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isCreateOrderOpen} onClose={handleClose} title="Add New Task">
      <form className="space-y-4 p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoFocus
            id="customerName"
            label="Customer name *"
            name="customerName"
            onChange={updateField}
            placeholder="Enter customer name"
            value={form.customerName}
          />
          <Input
            id="phone"
            label="Phone number *"
            name="phone"
            onChange={updateField}
            placeholder="0800 000 0000"
            type="tel"
            value={form.phone}
          />
        </div>

        <Input
          id="item"
          label="Task title *"
          name="item"
          onChange={updateField}
          placeholder="What needs to be done?"
          value={form.item}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="dueDate"
            label="Due date *"
            min={new Date().toISOString().split("T")[0]}
            name="dueDate"
            onChange={updateField}
            type="date"
            value={form.dueDate}
          />
          <Input
            id="dueTime"
            label="Due time *"
            name="dueTime"
            onChange={updateField}
            type="time"
            value={form.dueTime}
          />
          <Select
            id="priority"
            label="Priority"
            name="priority"
            onChange={updateField}
            value={form.priority}
          >
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </Select>
        </div>

        <div className="rounded-sm border border-primary/20 bg-primary/5 p-3 text-sm">
          <p className="font-semibold text-foreground">Automatic reminder included</p>
          <p className="mt-1 text-muted-foreground">
            Timely will remind you at the task deadline. You can change or cancel it later from the Tasks page.
          </p>
        </div>

        <Textarea
          id="notes"
          label="Notes"
          name="notes"
          onChange={updateField}
          placeholder="Measurements, preferences, or special instructions"
          value={form.notes}
        />

        {error && <p className="text-sm text-danger" role="alert">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button onClick={handleClose} size="sm" type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled={isSubmitting} size="sm" type="submit">
            {isSubmitting ? "Adding..." : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrderModal;
