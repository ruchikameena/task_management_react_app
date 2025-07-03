import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './Profile.css';
const getTodayDate = () => new Date().toISOString().split('T')[0];

const getMonthDays = (year, month) => {
  const days = [];
  const date = new Date(year, month,1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loginHistory, setLoginHistory] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const todayDateString = getTodayDate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || '');
          const history = data.loginHistory || [];

          // Update today's login if not already present
          if (!history.includes(todayDateString)) {
            const updatedHistory = [...history, todayDateString];
            await updateDoc(userRef, { loginHistory: updatedHistory });
            setLoginHistory(updatedHistory);
          } else {
            setLoginHistory(history);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      alert('Logout failed: ' + err.message);
    }
  };

  const monthDays = getMonthDays(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun, 6=Sat

  const prevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setViewDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setViewDate(newDate);
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  return (
  <div className='profile_main'>
    <button
      onClick={handleLogout}
      className='profile_main_btn'
    >
      Logout
    </button>
    <h2 style={{margin:'10px 0'}}>👤 Profile</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {user?.email}</p>

    <div className='login_traker_main'>
      <h3 style={{marginBottom:'20px'}}>📅 Login Calendar</h3>
      <div className='login_calendar'>
        <button onClick={prevMonth} className='month_navigator'>← Prev</button>
        <h4 style={{ margin: 0 }}>{monthName} {currentYear}</h4>
        <button onClick={nextMonth} className='month_navigator'>Next →</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px', marginBottom:'10px'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className='month_week_day'>{day}</div>
        ))}

        {/* Offset empty boxes */}
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={'empty' + idx}></div>
        ))}

        {monthDays.map((dateObj) => {
          const dateStr = dateObj.toISOString().split('T')[0];
          const loggedIn = loginHistory.includes(dateStr);
          const isToday = dateStr === todayDateString;

          return (
            <div
              key={dateStr}
              title={dateStr}
              style={{
                height: '40px',
                width: '100%',
                backgroundColor: loggedIn ? '#4caf50' : '#d1d0d0',
                border: isToday ? '3px double #000' : '1px solid #ccc',
                color: 'white',
                fontWeight: isToday ? 'bold' : 'normal',
                textAlign: 'center',
                borderRadius: '6px',
                padding: '10px', 
                fontSize: '14px',
              }}
            >
              {dateObj.getDate()}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: '13px', marginTop: '0.5rem', textAlign: 'center' }}>
        🟩 Logged In &nbsp;|&nbsp; ⬜️ Missed &nbsp;|&nbsp; 🔲 Today
      </p>
    </div>
  </div>
);

};

export default Profile;
