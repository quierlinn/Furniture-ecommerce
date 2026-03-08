import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Products</h3>
            <p>Manage your product catalog</p>
            <Link to="/admin/products" className="btn btn-primary">Manage Products</Link>
          </div>
          
          <div className="dashboard-card">
            <h3>Orders</h3>
            <p>View and manage customer orders</p>
            <Link to="/admin/orders" className="btn btn-primary">Manage Orders</Link>
          </div>
          
          <div className="dashboard-card">
            <h3>Customers</h3>
            <p>View customer information</p>
            <button className="btn btn-primary" disabled>Coming Soon</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View sales and performance metrics</p>
            <button className="btn btn-primary" disabled>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
