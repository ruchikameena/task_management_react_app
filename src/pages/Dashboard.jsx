import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
     <div className='dashboard_main'>
      <Sidebar />
      <div style={{ flex: 1}} className='dashboard_main_content'>
        <Outlet />
      </div>
    </div>
  )
};

export default Dashboard;
