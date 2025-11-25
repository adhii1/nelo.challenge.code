import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email & password");
    
    // Save to sessionStorage
    sessionStorage.setItem("user", JSON.stringify({ email }));
    onLogin({ email });
  };

  return (
    <div className="container" style={{ maxWidth: "400px" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="add-btn" type="submit">Login</button>
      </form>
    </div>
  );
}
