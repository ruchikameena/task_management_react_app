import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Authentication from '../assets/Authentication.json'; 
import './authentication.css'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      if (!user.emailVerified) {
        alert('Your email is not verified, Please verify and try again later.');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      console.log(err.message);
      alert('Something went wrong. Please try again later.')
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Enter your email in given field to reset password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Email sent! Please reset the password to access your account.');
    } catch (err) {
      console.log(err.message);
      alert('Something went wrong. Please try again later.')
    }
  };

  return (
    <div className="auth_main">
      <div className='auth_main_left'>
        <div className="auth_content">
          <h1>Welcome to Kanban</h1>
          <p style={{wordSpacing:'5px',fontSize:'12px',letterSpacing:'3px'}}>An Task Management Application</p>
        <p style={{marginBottom:'5px',color:'#02c37e'}}>Visualize . Assign . Accomplish</p>
        <h4 style={{marginBottom:'20px'}}>A Smarter Way to Manage Your Workflow</h4>
        </div>
        <Lottie animationData={Authentication} loop={true} className='animation_auth' />
      </div>
      <div className='auth_main_right'>
        <div className="auth_right_content">
          <h2 style={{marginTop:'40px',marginBottom:'10px'}}>Login</h2>
        <form onSubmit={handleLogin} >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className='auth_main_input'
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className='auth_main_input'
          />
          <button
            type="submit"
            className='auth_main_btn'
          >
            Login
          </button>
        </form>
        <button
          onClick={handleForgotPassword}
          className='auth_main_btn2'
        >
          Forgot Password?
        </button>
        <p>
          Not registered?{' '}
          <span
            onClick={() => navigate('/register')}
            className='auth_main_navigate'
          >
            Register here
          </span>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
