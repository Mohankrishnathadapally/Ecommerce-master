// components/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get("http://localhost:8080/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  if (orders.length === 0) {
    return <h4 className="text-center mt-5">No Orders Placed Yet.</h4>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Your Orders</h3>
      <ul className="list-group">
        {orders.map((order, index) => (
          <li key={index} className="list-group-item">
            <strong>Items:</strong> {order.items.length} |{" "}
            <strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
