import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleLinkClick = () => {
    setShowMenu(false);
  };

  return (
    <div className='sidebar_main'>
      <h1 style={{ textAlign: 'center', color: 'black',padding:'15px'}}>Kanban</h1>
      <div className="sidebar_ul">
        <ul className='sidebar_main_ul'>
          <li className='sidebar_main_li'><NavLink className='sidebar_main_navlink' to="/dashboard/profile">Profile</NavLink></li>
          <li className='sidebar_main_li'><NavLink className='sidebar_main_navlink' to="/dashboard/tasks">Tasks</NavLink></li>
          <li className='sidebar_main_li'><NavLink className='sidebar_main_navlink' to="/dashboard/board">Board</NavLink></li>
          <li className='sidebar_main_li'><NavLink className='sidebar_main_navlink' to="/dashboard/work">Work</NavLink></li>
        </ul>
      </div>
      
      <div className='menu_toggle_button' onClick={()=>setShowMenu(!showMenu)}>☰</div>
      {showMenu && (
        <ul className="menu_dropdown">
          <li><NavLink to='/dashboard/profile' onClick={handleLinkClick}>Profile</NavLink> </li>
          <li><NavLink to='/dashboard/tasks' onClick={handleLinkClick}>Tasks</NavLink> </li>
          <li><NavLink to='/dashboard/board' onClick={handleLinkClick}>Board</NavLink> </li>
          <li><NavLink to='/dashboard/work' onClick={handleLinkClick}>Work</NavLink> </li>
        </ul>
      )}
    </div>

  );
};

export default Sidebar;
