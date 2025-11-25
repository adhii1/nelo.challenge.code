export default function Filter({ filter, setFilter }) {
  return (
    <div className="flex gap-2 mb-4 justify-center">
      <button
        onClick={() => setFilter("all")}
        className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        All
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        Completed
      </button>
      <button
        onClick={() => setFilter("pending")}
        className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        Pending
      </button>
    </div>
  );
}
