import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [donations, setDonations] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const loadDonations = async () => {
    try {
      const res = await fetch(`${API_URL}/donations`);
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      setMessage("Could not load donations. Is the backend running on port 8000?");
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        quantity: Number(quantity),
        location,
      }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setQuantity("");
      setLocation("");
      setMessage("Donation posted!");
      loadDonations();
    } else {
      setMessage("Failed to post. Check title, quantity, and location.");
    }
  };

  const handleClaim = async (id) => {
    const res = await fetch(`${API_URL}/donations/${id}/claim`, {
      method: "POST",
    });
    if (res.ok) {
      setMessage("Donation claimed!");
      loadDonations();
    } else {
      setMessage("Could not claim. It may already be claimed.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Food Rescue Platform</h1>
      <p>Donors post surplus food. Nonprofits claim it.</p>
      {message && <p>{message}</p>}

      <form onSubmit={handleCreate} style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2>Post a donation</h2>
        <input placeholder="Title, e.g. Fresh sandwiches" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
        <input placeholder="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
        <input placeholder="Location, e.g. Wichita, KS" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
        <button type="submit">Post Donation</button>
      </form>

      <h2>Donations</h2>
      {donations.length === 0 && <p>No donations yet.</p>}
      {donations.map((d) => (
        <div key={d.id} style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px", marginBottom: "12px" }}>
          <h3>{d.title}</h3>
          <p>{d.description}</p>
          <p>Quantity: {d.quantity} | Location: {d.location}</p>
          <p>Status: <strong>{d.status}</strong></p>
          {d.status === "available" ? (
            <button onClick={() => handleClaim(d.id)}>Claim this donation</button>
          ) : (
            <span>Claimed</span>
          )}
        </div>
      ))}
    </div>
  );
}
