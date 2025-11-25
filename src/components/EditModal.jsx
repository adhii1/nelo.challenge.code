import { useState } from "react";

export default function EditModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task.title);
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ ...task, title: text.trim(), priority, dueDate: dueDate || null });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <input value={text} onChange={e => setText(e.target.value)} />
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button className="filter-btn" onClick={onClose}>Cancel</button>
          <button className="add-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
