import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import SearchBox from "./components/SearchBox";
import EditModal from "./components/EditModal";
import Login from "./components/Login";
import useDebounce from "./components/useDebounce";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(searchText, 300);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pendingTasks = tasks.filter(t => !t.completed);
      if (pendingTasks.length) {
        console.log("📧 Mock Email Notification: Pending tasks:", pendingTasks.map(t => t.title));
      }
    }, 20 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  if (!user) return <Login onLogin={setUser} />;

  const addTask = (title, priority, dueDate) => {
    const newTask = { id: Date.now(), title, completed: false, priority, dueDate };
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const toggleComplete = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const updateTask = (updated) => { setTasks(tasks.map(t => t.id === updated.id ? updated : t)); setEditingTask(null); };
  const handleLogout = () => { sessionStorage.removeItem("user"); setUser(null); };

  // Filter + Debounced Search + Sorting
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  let filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    if (filter === "active") return !task.completed && matchesSearch;
    if (filter === "completed") return task.completed && matchesSearch;
    return matchesSearch;
  }).sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1>Task Manager</h1>
        <button className="delete-btn" onClick={handleLogout}>Logout</button>
      </div>

      <TaskForm onAdd={addTask} />
      <SearchBox search={searchText} setSearch={setSearchText} />
      <FilterBar filter={filter} setFilter={setFilter} />
      <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleComplete} onEdit={setEditingTask} />
      {editingTask && <EditModal task={editingTask} onSave={updateTask} onClose={() => setEditingTask(null)} />}
    </div>
  );
}
