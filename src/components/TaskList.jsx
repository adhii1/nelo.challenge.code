import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onToggle, onEdit }) {
  if (!tasks.length) return <p style={{ textAlign: "center" }}>No tasks found!</p>;
  return (
    <div>
      {tasks.map(task => <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} onEdit={onEdit} />)}
    </div>
  );
}
