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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.customerName || !form.phone || !form.item || !form.dueDate || !form.dueTime) {
      setError("Please complete all required fields.");
      return;
    }

    addOrder(form);
    setForm(initialForm);
    setError("");
  };

  return (
    <Modal isOpen={isCreateOrderOpen} onClose={handleClose} title="Add New Order">
      <form className="space-y-4 p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoFocus
            id="customerName"
            label="Customer name *"
            name="customerName"
            onChange={updateField}
            placeholder="e.g. Sarah Adelaja"
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
          label="Order item *"
          name="item"
          onChange={updateField}
          placeholder="What is being ordered?"
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
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </Select>
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
          <Button size="sm" type="submit">Add Order</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrderModal;
