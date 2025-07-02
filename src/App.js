import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Board from './pages/Board';
import Home from './pages/Home';
import Work from './pages/Work';
import { useAuth } from './context/authContext';
import NotFound from './pages/NotFound';

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {
        user && (
          <Route path='/dashboard' element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="board" element={<Board />} />
            <Route path="work" element={<Work />} />
          </Route>
        )
      }
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default App;
