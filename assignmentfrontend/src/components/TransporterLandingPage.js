import React, { useState, useEffect } from 'react'
import '../styles/LandingPage.css'
function TransporterLandingPage({ userType, token }) {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTo, setSearchTo] = useState('');
    const [searchFrom, setSearchFrom] = useState('');
    const [orderId, setOrderId] = useState('');
    const [price, setPrice] = useState('');



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
            const response = await fetch(`http://localhost:5000/api/order/search/messages?${new URLSearchParams(query)}`)

            const data = await response.json();

            if (response.ok) {
                // console.log(data)
                setMessages(data);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleReplyMessage = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/messages/reply/${selectedMessage._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ price }),
            });

            const responseData = await response.json();
            console.log(responseData)
            if (response.ok) {
                alert("Reply Successfully");
            } else {
                alert('Error while Adding price');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleReplyMessage();
    };


    const getMessages = async () => {
        try {
            var response = await fetch('http://localhost:5000/api/order/messages', {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })
            var data = await response.json()
            console.log(data)
            if (response.ok) {
                setMessages(data.messages);
            }
            else {
                console.log("error")
            }

        } catch (error) {
            console.log(error)
        }
    }

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
    useEffect(() => {
        getMessages();
    }, []);



    return (<div className="landing-page">
        <h2>Welcome, Transporter</h2>
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
            <div className="main-box" style={{ marginTop: '20px' }}>
                <ul className="message-list">
                    {messages && messages.map((message) => (
                        <li className='order' key={message._id}>
                            <div onClick={() => showMessageData(message._id)}>
                                <strong>Order ID:</strong> {message._id}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="form">
                    {selectedMessage && (
                        <div>
                            <form onSubmit={handleSubmit}>
                                <h2>Selected Message:</h2>
                                <p>ID: {selectedMessage._id}</p>
                                <p>User1: {selectedMessage.Manufacturerusername}</p>
                                <p>To: {selectedMessage.to}</p>
                                <p>From: {selectedMessage.from}</p>
                                <p>Address: {selectedMessage.address}</p>
                                <p>Quantity: {selectedMessage.quantity} tons</p>
                                <p>Transporter: {selectedMessage.Transporterusername}</p>
                                {selectedMessage.price &&
                                <p>Price: {selectedMessage.price}</p>}

                                <label htmlFor="price">Price:</label>
                                <input
                                    type="text"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />

                                <button type="submit">Reply</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    )
}

export default TransporterLandingPage
