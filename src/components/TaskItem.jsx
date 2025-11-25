import { useEffect, useState } from "react";

export default function TaskItem({ task, onDelete, onToggle, onEdit }) {
  const [removing, setRemoving] = useState(false);
  const [added, setAdded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAdded(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""} ${added ? "added" : ""} ${removing ? "removed" : ""}`}>
      <span onClick={() => onToggle(task.id)}>
        {task.title} {task.priority && `[${task.priority}]`} {task.dueDate && `(Due: ${task.dueDate})`}
      </span>
      <div>
        <button className="edit-btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
