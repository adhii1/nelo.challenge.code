export default function FilterBar({ filter, setFilter }) {
  const filters = ["all", "active", "completed"];
  return (
    <div style={{ marginBottom: "1rem" }}>
      {filters.map(f => (
        <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}
