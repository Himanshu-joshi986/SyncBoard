import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch events from backend
  useEffect(() => {
    fetch("http://localhost:5000/calendar/events")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch("http://localhost:5000/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, summary })
    });
    setDate("");
    setSummary("");
    // Refresh events
    fetch("http://localhost:5000/calendar/events")
      .then((res) => res.json())
      .then(setEvents);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Assign Task to Calendar</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="text" value={summary} onChange={e => setSummary(e.target.value)} placeholder="Task summary" required />
        <button type="submit" disabled={loading}>Assign</button>
      </form>
      <h3>Tasks/Events</h3>
      <ul>
        {events.map(ev => (
          <li key={ev.id}>{ev.start?.date || ev.start?.dateTime}: {ev.summary}</li>
        ))}
      </ul>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
