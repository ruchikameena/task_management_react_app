import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

const RejectTaskModal = ({ task, onClose, onReject }) => {
  const [message, setMessage] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleReject = async () => {
    if (!message || !newDueDate) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        status: 'not-started',
        submissionLink: '',
        submittedAt: null,
        rejectionMessage: message,
        dueDate: Timestamp.fromDate(new Date(newDueDate))
      });

      onReject(); // Refresh list
      onClose();
    } catch (err) {
      console.error('Error rejecting task:', err);
      alert('Failed to reject.');
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
        <h3>Reject & Reassign</h3>

        <textarea
          placeholder="Enter reason for rejection"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <label>New Due Date:</label>
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleReject}
            style={{ background: '#e53935', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px' }}
          >
            Reject
          </button>
          <button
            onClick={onClose}
            style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectTaskModal;
