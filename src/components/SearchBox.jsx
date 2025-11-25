export default function SearchBox({ search, setSearch }) {
  return (
    <input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search tasks..."
      style={{ marginBottom: "1rem", width: "100%" }}
    />
  );
}
