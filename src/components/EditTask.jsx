import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const EditTaskModal = ({ task, onClose }) => {
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate.seconds * 1000).toISOString().substr(0, 10) : ''
  );
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);
  const handleUpdate = async () => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Update failed.");
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await deleteDoc(taskRef);
      onClose();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete the task.");
    }
  };
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: '2rem', borderRadius: '10px',
        width: '400px', maxWidth: '90%'
      }}>
        <h3>Edit Task</h3>
        <label>Assign To:</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div>
            <button
              onClick={handleUpdate}
              style={{
                padding: '0.5rem 1rem',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginRight: '0.5rem'
              }}
            >
              Save
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                background: '#888',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              Cancel
            </button>
          </div>
          <button
            onClick={handleDelete}
            style={{
              padding: '0.5rem 1rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
