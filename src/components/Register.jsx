import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Authentication from '../assets/Authentication.json';
import './authentication.css';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const checkUsernameOrEmailExists = async (name, email) => {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const emailQ = query(collection(db, 'users'), where('email', '==', email));

    const [nameSnap, emailSnap] = await Promise.all([
      getDocs(q),
      getDocs(emailQ),
    ]);

    return {
      nameExists: !nameSnap.empty,
      emailExists: !emailSnap.empty,
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const { nameExists, emailExists } = await checkUsernameOrEmailExists(name, email);

    if (nameExists && emailExists) {
      alert('Both username and email already exist. Please choose different ones.');
      return;
    } else if (nameExists) {
      alert('Username already exists. Please choose another name.');
      return;
    } else if (emailExists) {
      alert('Email already in use. Please use another email.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
      });

      await sendEmailVerification(user);
      alert('Verification email sent! Please verify before logging in.');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='auth_main'>
      
      <div className='auth_main_left'>
        <div className="auth_content">
          <h1>Welcome to Kanban</h1>
          <p style={{wordSpacing:'5px',fontSize:'12px',letterSpacing:'3px'}}>An Task Management Application</p>
        <p style={{marginBottom:'5px',color:'#1976d2'}}>Visualize . Assign . Accomplish</p>
        <h4 style={{marginBottom:'20px'}}>A Smarter Way to Manage Your Workflow</h4>
        </div>
        <Lottie animationData={Authentication} loop={true} className='animation_auth' />
      </div>
      <div className='auth_main_right' >
        <div className="auth_right_content">
          <h2 style={{marginBottom:'10px'}}>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className='auth_main_input'
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className='auth_main_input'
          />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className='auth_main_input'
          />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className='auth_main_input'
          />
          <label style={{cursor:'pointer'}}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)} style={{marginBottom:'10px'}}
            /> Show Password
          </label>
          <button type="submit" className='auth_main_btn'>
            Register
          </button>
        </form>

        <p >
          Already registered?{' '}
          <span
            onClick={() => navigate('/login')}
            className='auth_main_navigate'
          >
            Login here
          </span>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
