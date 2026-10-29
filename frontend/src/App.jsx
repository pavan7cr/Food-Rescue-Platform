import { useState, useEffect } from "react";

const API_URL = "https://food-rescue-platform-backend.onrender.com";

export default function App() {
  const [donations, setDonations] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  async function loadDonations() {
    const res = await fetch(`${API_URL}/donations`);
    const data = await res.json();
    setDonations(data);
  }

  useEffect(() => {
    loadDonations();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");
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
      setMessage("Donation posted.");
      loadDonations();
    } else {
      setMessage("Could not post donation. Please try again.");
    }
  }

  async function handleClaim(id) {
    const res = await fetch(`${API_URL}/donations/${id}/claim`, {
      method: "POST",
    });
    if (res.ok) {
      setMessage("Donation claimed.");
      loadDonations();
    } else {
      setMessage("This donation was already claimed.");
      loadDonations();
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Food Rescue Platform</h1>
      <p>Surplus food from donors, claimed by nonprofits.</p>

      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, for example Fresh sandwiches" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" type="number" required />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location, for example Wichita, KS" required />
        <button type="submit">Post Donation</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Available Donations</h2>
      {donations.length === 0 && <p>No donations yet. Post the first one above.</p>}
      {donations.map((d) => (
        <div key={d.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
          <h3>{d.title}</h3>
          <p>{d.description}</p>
          <p>Quantity: {d.quantity} | Location: {d.location} | Status: {d.status}</p>
          {d.status === "available" ? (
            <button onClick={() => handleClaim(d.id)}>Claim</button>
          ) : (
            <span>Claimed</span>
          )}
        </div>
      ))}
    </div>
  );
}
