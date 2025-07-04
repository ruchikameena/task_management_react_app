import Lottie from 'lottie-react';
import Error_404 from'../assets/Error_404.json';

const NotFound = () => {
  return (
    <div style={{textAlign: 'center',padding: '20px',display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center',backgroundColor: '#f9f9f9'}}>

      <div style={{ maxWidth: '400px', width: '100%', marginBottom: '10px' }}>
        <Lottie animationData={Error_404} loop={true} />
      </div>

      <h1 style={{color: '#02c37e',marginBottom:'10px'}}>404 - Page Not Found</h1>
      <p style={{ color: '#555' }}>Sorry! The page you are looking for doesn't exist or has been moved.</p>
      <p style={{ color: '#888' }}>Please check the URL or go back to the previous page.</p>
      
    </div>
  );
};

export default NotFound;
