import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/authContext';

const CreateTaskPopup = ({ onClose, onTaskCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userList = snapshot.docs
        .filter((doc) => doc.id !== user.uid) // Exclude current user
        .map((doc) => ({ uid: doc.id, name: doc.data().name }));
      setUsers(userList);
    };
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required.');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        title: title.trim(),
        description: description.trim(),
        assignedBy: user.uid,
        assignedTo: assignedTo || null,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
        createdAt: Timestamp.now(),
        status: 'not-started',
        submissionLink: '',
        submittedAt: null,
      });
      onTaskCreated();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff', padding: '2rem', borderRadius: '10px',
          width: '400px', maxWidth: '90%'
        }}
      >
        <h3>Create Task</h3>

        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          required
        />

        <textarea
          placeholder="Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          required
        />

        <label>Assign To:</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        >
          <option value="">-- Not Assigned --</option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.name}
            </option>
          ))}
        </select>

        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem', background: '#4caf50',
              color: 'white', border: 'none', borderRadius: '5px'
            }}
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem', background: '#888',
              color: 'white', border: 'none', borderRadius: '5px'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskPopup;
