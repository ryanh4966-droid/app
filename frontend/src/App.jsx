import { useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  const API = "http://localhost:3000";

  async function buyPro() {
    const res = await fetch(`${API}/create-checkout`, {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  async function getPremium() {
    const res = await fetch(`${API}/premium-data`, {
      headers: {
        "x-user-plan": "pro",
      },
    });

    const data = await res.json();
    setData(data);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🚀 SaaS Dashboard</h1>

      <button onClick={buyPro}>
        Upgrade to Pro 💳
      </button>

      <button onClick={getPremium} style={{ marginLeft: 10 }}>
        Load Premium Data
      </button>

      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
