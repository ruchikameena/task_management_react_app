import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{
      width: '200px',
      background: '#eee',
      height: '100vh',
      padding: '1rem',
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
        <li><NavLink to="/dashboard/tasks">Tasks</NavLink></li>
        <li><NavLink to="/dashboard/board">Board</NavLink></li>
        <li><NavLink to="/dashboard/work">Work</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
