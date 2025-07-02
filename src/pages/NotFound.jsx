import React from 'react';
import Lottie from 'lottie-react';
import Error_404 from'../assets/Error_404.json';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      
      {/* Animation */}
      <div style={{ maxWidth: '400px', width: '100%', marginBottom: '2rem' }}>
        <Lottie animationData={Error_404} loop={true} />
      </div>

      {/* Message */}
      <h1 style={{ fontSize: '3rem', color: 'blue' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        Sorry! The page you are looking for doesn’t exist or has been moved.
      </p>
      <p style={{ fontSize: '1rem', color: '#888' }}>
        Please check the URL or go back to the previous page.
      </p>
    </div>
  );
};

export default NotFound;
