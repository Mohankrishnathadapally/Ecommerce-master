import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const confirmPurchase = () => {
    toast.success("Order placed successfully!");
    handleCheckout(); // call parent checkout logic (like clearing cart)
    handleClose();    // close the modal
  };

  return (
    <div className="checkoutPopup">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item" style={{ display: 'flex', marginBottom: '10px' }}>
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" style={{ width: '150px', marginRight: '10px' }} />
                <div>
                  <b><p>{item.name}</p></b>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <div>
              <h5 style={{ color: 'black', display: 'flex', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold' }}>
                Total: ${totalPrice}
              </h5>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmPurchase}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
