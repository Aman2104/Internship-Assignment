import React, { useState, useEffect } from "react";
import ManufacturerMessageForm from "./ManufacturerMessageForm";
import "../styles/LandingPage.css";
function ManufacturerLandingPage({ userType, token }) {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTo, setSearchTo] = useState("");
    const [searchFrom, setSearchFrom] = useState("");
    const [orderId, setOrderId] = useState("");
    const handleSearch = async () => {
        const query = {};
        if (orderId) {
            query.orderId = orderId;
        }

        if (searchTo) {
            query.to = searchTo;
        }

        if (searchFrom) {
            query.from = searchFrom;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/order/search/messages?${new URLSearchParams(
                    query
                )}`
            );

            const data = await response.json();

            if (response.ok) {
                // console.log(data);
                setMessages(data);
            } else {
                console.log("error");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showMessageData = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/messages/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setSelectedMessage(data.message);
                // console.log(data.message._id)
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getMessages = async () => {
        try {
            var response = await fetch("http://localhost:5000/api/order/messages", {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });
            var data = await response.json();
            // console.log(data);
            if (response.ok) {
                setMessages(data.messages);
            } else {
                console.log("error");
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getMessages();
    }, []);
    return (
        <div className="landing-page">
            <h2>Welcome, Manufacturer</h2>
            <div className="messages-container">
                <h3>Messages Received</h3>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search To"
                        value={searchTo}
                        onChange={(e) => setSearchTo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search From"
                        value={searchFrom}
                        onChange={(e) => setSearchFrom(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="main-box" >
                    <div className="form">
                        <ManufacturerMessageForm token={token} />
                    </div>
                    <ul className="message-list" style={{ marginTop: '20px' }}>
                        {selectedMessage ? (
                            <div>
                                <h2>Selected Message:</h2>
                                <p>ID: {selectedMessage._id}</p>
                                <p>Manufacturer: {selectedMessage.Manufacturerusername}</p>
                                <p>To: {selectedMessage.to}</p>
                                <p>From: {selectedMessage.from}</p>
                                <p>Address: {selectedMessage.address}</p>
                                <p>Quantity: {selectedMessage.quantity} tons</p>
                                <p>Transporter: {selectedMessage.Transporterusername}</p>
                                {selectedMessage.price ? (<p>Price: {selectedMessage.price}</p>) :
                                    (<p>Price: Not Replied</p>)}
                            </div>
                        ) : (
                            messages.map((message) => (
                                <li className="order" key={message._id} >
                                    <div onClick={() => showMessageData(message._id)}>
                                        <strong>Order ID:</strong> {message._id}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ManufacturerLandingPage;
