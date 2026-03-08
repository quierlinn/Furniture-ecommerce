import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  return (
    <div className="cart-item card">
      <div className="cart-item-image">
        <img 
          src={item.product.imageUrl || '/placeholder-image.jpg'} 
          alt={item.product.name} 
        />
      </div>
      
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <p>${item.product.price.toFixed(2)} each</p>
      </div>
      
      <div className="cart-item-quantity">
        <label htmlFor={`quantity-${item.productId}`}>Qty:</label>
        <input
          id={`quantity-${item.productId}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
        />
      </div>
      
      <div className="cart-item-total">
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>
      
      <button 
        onClick={handleRemove} 
        className="remove-item-btn"
        aria-label="Remove item"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
