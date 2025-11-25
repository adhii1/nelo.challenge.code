import React, { useState, useEffect, useRef } from "react";

// Default export React component (single-file example)
// This file demonstrates a small Task Manager app using React hooks and Tailwind CSS.
// For the assessment: split into multiple files if you like (components/*), but
// this single-file version keeps everything together so beginners can follow easily.

export default function App() {
  // TASK STATE: array of task objects
  const [tasks, setTasks] = useState(() => {
    // read from localStorage (persist across refreshes). If none, return empty array.
    try {
      const raw = localStorage.getItem("nelo_tasks_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // UI state: filter, search, currently editing task
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null); // task object or null

  // save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("nelo_tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  // Helper: create a new task object
  const createTaskObject = ({ title, description }) => ({
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  });

  // Add a new task
  const addTask = (taskData) => {
    if (!taskData.title || !taskData.title.trim()) return false;
    const newTask = createTaskObject(taskData);
    setTasks((prev) => [newTask, ...prev]);
    return true;
  };

  // Update a task (for edits or toggling completed)
  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Derived list: apply filter + search
  const filteredTasks = tasks.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Header />

        <div className="mt-6 grid gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-2">Add a Task</h2>
            <TaskForm onAdd={(data) => addTask(data)} />
          </Card>

          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <FilterBar value={filter} onChange={(v) => setFilter(v)} />
                <button
                  className="text-sm px-3 py-1 border rounded-md hover:bg-slate-100"
                  onClick={() => {
                    // quick clear completed
                    const confirmed = confirm("Delete all completed tasks?");
                    if (confirmed) setTasks((prev) => prev.filter((t) => !t.completed));
                  }}
                >
                  Clear Completed
                </button>
              </div>

              <div className="flex items-center gap-2">
                <SearchBox value={search} onChange={setSearch} />
              </div>
            </div>

            <div className="mt-4">
              <TaskList
                tasks={filteredTasks}
                onToggle={(task) => updateTask(task.id, { completed: !task.completed })}
                onDelete={(task) => deleteTask(task.id)}
                onEdit={(task) => setEditingTask(task)}
              />

              {filteredTasks.length === 0 && (
                <p className="text-sm text-slate-500 mt-4">No tasks found for the selected filter / search.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Edit Modal */}
        {editingTask && (
          <EditModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={(updates) => {
              updateTask(editingTask.id, updates);
              setEditingTask(null);
            }}
          />
        )}

        <footer className="mt-8 text-center text-sm text-slate-500">Nelo - Task Manager (Demo)</footer>
      </div>
    </div>
  );
}

// ---------------------- Reusable UI components ----------------------

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <p className="text-sm text-slate-500">Add, edit, filter and remove tasks — built with React + Tailwind</p>
      </div>
    </header>
  );
}

function Card({ children }) {
  return <div className="bg-white p-4 rounded-2xl shadow-sm">{children}</div>;
}

// ---------------------- Task Form (Add) ----------------------
function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    // autofocus title for user friendliness
    titleRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const ok = onAdd({ title, description });
    if (ok) {
      setTitle("");
      setDescription("");
      titleRef.current?.focus();
    } else {
      alert("Please enter a title for the task.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="e.g. Build Nelo demo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Task</button>
      </div>
    </form>
  );
}

// ---------------------- Task List & Item ----------------------
function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={() => onToggle(task)} onDelete={() => onDelete(task)} onEdit={() => onEdit(task)} />
      ))}
    </ul>
  );
}

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <li className="flex items-start gap-3 p-3 border rounded-md">
      <input type="checkbox" checked={task.completed} onChange={onToggle} className="mt-1" />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium ${task.completed ? "line-through text-slate-400" : ""}`}>{task.title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="text-xs px-2 py-1 border rounded hover:bg-slate-100">Edit</button>
            <button onClick={onDelete} className="text-xs px-2 py-1 border rounded hover:bg-slate-100">Delete</button>
          </div>
        </div>
        {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
        <div className="text-xs text-slate-400 mt-1">Created: {new Date(task.createdAt).toLocaleString()}</div>
      </div>
    </li>
  );
}

// ---------------------- Filter & Search ----------------------
function FilterBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button className={`px-3 py-1 rounded-md ${value === "all" ? "bg-indigo-600 text-white" : "border"}`} onClick={() => onChange("all")}>
        All
      </button>
      <button className={`px-3 py-1 rounded-md ${value === "active" ? "bg-indigo-600 text-white" : "border"}`} onClick={() => onChange("active")}>
        Active
      </button>
      <button className={`px-3 py-1 rounded-md ${value === "completed" ? "bg-indigo-600 text-white" : "border"}`} onClick={() => onChange("completed")}>
        Completed
      </button>
    </div>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search tasks..."
      className="border rounded-md px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
  );
}

// ---------------------- Edit Modal ----------------------
function EditModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const save = () => {
    if (!title.trim()) return alert("Title cannot be empty.");
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-2xl w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">Edit Task</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2 h-28 resize-none" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 border rounded-md">Cancel</button>
            <button onClick={save} className="px-3 py-1 bg-indigo-600 text-white rounded-md">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
