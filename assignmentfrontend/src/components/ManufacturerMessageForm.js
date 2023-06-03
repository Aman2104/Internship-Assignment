import React, { useState, useEffect } from "react";

const ManufacturerMessageForm = ({ token }) => {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transporter, setTransporter] = useState("");
  const [transporters, setTransporters] = useState([]);

  useEffect(() => {
    fetchTransporters();
  }, []);

  const fetchTransporters = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/order/transporter"
      );
      const data = await response.json();
    //   console.log(data);
      setTransporters(data.transporter);
    } catch (error) {
      console.error("Failed to fetch transporters:", error);
    }
  };
  const handleSendMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/order/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ to, from, quantity, transporter }),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log(data.message);
        alert("Message Sent Successfully");
      } else {
        console.log("Failed to Send message");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h2>Message Form</h2>
      <label htmlFor="to">To:</label>
      <input
        type="text"
        id="to"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <label htmlFor="from">From:</label>
      <input
        type="text"
        id="from"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <label htmlFor="quantity">Quantity:</label>
      <select
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      >
        <option value="">Select quantity</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <option key={value} value={value}>
            {value} ton
          </option>
        ))}
      </select>

      <label htmlFor="transporter">Transporter:</label>
      <select
        id="transporter"
        value={transporter}
        onChange={(e) => setTransporter(e.target.value)}
      >
        <option value="">Select transporter</option>
        {transporters &&
          transporters.map((t) => (
            <option key={t._id} value={t.username}>
              {t.username}
            </option>
          ))}
      </select>

      <button type="submit">Send</button>
    </form>
  );
};

export default ManufacturerMessageForm;
