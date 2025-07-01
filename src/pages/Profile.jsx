import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getMonthDays = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1);
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
  <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
    <h2>👤 Profile</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {user?.email}</p>
    <button
      onClick={handleLogout}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        background: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>

    <div style={{
      marginTop: '3rem',
      padding: '1rem',
      background: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3>📅 Login Calendar</h3>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <button onClick={prevMonth} style={navBtnStyle}>← Prev</button>
        <h4 style={{ margin: 0 }}>{monthName} {currentYear}</h4>
        <button onClick={nextMonth} style={navBtnStyle}>Next →</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '14px',
            color: '#444'
          }}>{day}</div>
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
                backgroundColor: loggedIn ? '#4caf50' : '#ef5350',
                border: isToday ? '2px solid #000' : '1px solid #ccc',
                color: 'white',
                fontWeight: isToday ? 'bold' : 'normal',
                textAlign: 'center',
                borderRadius: '6px',
                lineHeight: '40px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              {dateObj.getDate()}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: '13px', marginTop: '0.5rem', textAlign: 'center' }}>
        🟩 Logged In &nbsp;|&nbsp; 🟥 Missed &nbsp;|&nbsp; ⬛ Today
      </p>
    </div>
  </div>
);

};

const navBtnStyle = {
  background: '#2196f3',
  color: 'white',
  padding: '0.4rem 0.8rem',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer'
};

export default Profile;
