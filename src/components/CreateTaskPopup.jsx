import { useState, useEffect } from 'react';
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
      const data = await getDocs(collection(db, 'users'));
      //fetching users except the current loggedin user
      const userData = data.docs
        .filter((doc) => doc.id !== user.uid)
        .map((doc) => ({ uid: doc.id, name: doc.data().name }));
      setUsers(userData);
    };
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //prevent user to create task is anyone of the title and description is missing
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required.');
      return;
    }

    try {
      //tasks modal for database
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
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',alignItems: 'center', justifyContent: 'center'}}>

      <form onSubmit={handleSubmit}
        style={{background: '#fff', padding: '20px', borderRadius: '10px',width: '400px', maxWidth: '90%'}}>

        <h3>Create Task</h3>

        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} 
        style={{ width: '100%', margin: '5px 0', padding: '10px' }}/>

        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4"
          style={{ width: '100%', margin: '5px 0', padding: '10px' }}/>

        <label>Assign To:</label>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
          style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
        >
          <option value="">-- Not Assigned --</option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.name}
            </option>
          ))}
        </select>

        <label>Due Date:</label>
        <input type="date"  value={dueDate}  onChange={(e) => setDueDate(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <button type="submit"
            style={{padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px'}}>Create</button>

          <button type="button" onClick={onClose}
            style={{padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '5px'}}>Cancel</button>

        </div>
      </form>
    </div>
  );
};

export default CreateTaskPopup;
