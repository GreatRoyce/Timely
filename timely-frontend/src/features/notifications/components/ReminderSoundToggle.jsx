import { useId, useState } from "react";
import { useNotifications } from "../../../hooks/useNotifications";

const ReminderSoundToggle = () => {
  const id = useId();
  const { soundEnabled, soundError, enableSound, muteSound } = useNotifications();
  const [isEnabling, setIsEnabling] = useState(false);

  const handleChange = async (event) => {
    if (!event.target.checked) {
      muteSound();
      return;
    }

    setIsEnabling(true);
    try {
      await enableSound();
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <div className="mt-3 text-sm">
      <label className="flex cursor-pointer items-center gap-2 font-semibold text-foreground" htmlFor={id}>
        <input
          aria-describedby={`${id}-hint${soundError ? ` ${id}-error` : ""}`}
          checked={soundEnabled}
          className="h-4 w-4 shrink-0 accent-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait"
          disabled={isEnabling}
          id={id}
          onChange={handleChange}
          type="checkbox"
        />
        {isEnabling ? "Enabling reminder sound..." : "Enable notification sound"}
      </label>
      <p className="mt-1 text-muted-foreground" id={`${id}-hint`}>
        Plays a preview chime when enabled. Applies to all task reminders while Timely is open in this session.
      </p>
      {soundError && <p className="mt-2 text-danger" id={`${id}-error`} role="status">{soundError}</p>}
    </div>
  );
};

export default ReminderSoundToggle;
