import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { items } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Furniture Store</h1>
          </Link>
          
          <nav className="nav">
            <ul className="nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalog">Catalog</Link></li>
              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <li><Link to="/admin">Admin</Link></li>
                  <li><Link to="/admin/products">Products</Link></li>
                  <li><Link to="/admin/orders">Orders</Link></li>
                </>
              )}
            </ul>
          </nav>
          
          <div className="header-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            ) : (
              <div className="user-menu">
                <span>Hello, {user?.email || 'User'}!</span>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </div>
            )}
            
            <Link to="/cart" className="cart-icon">
              <span>🛒</span>
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
