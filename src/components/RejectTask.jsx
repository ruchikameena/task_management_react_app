import { useState } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

const RejectTaskModal = ({ task, onClose, onReject }) => {
  const [message, setMessage] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  //Taking all the required data for rejection
  const handleReject = async () => {
    if (!message || !newDueDate) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const curr_task = doc(db, 'tasks', task.id);
      await updateDoc(curr_task, {
        status: 'not-started',
        submissionLink: '',
        submittedAt: null,
        rejectionMessage: message,
        dueDate: Timestamp.fromDate(new Date(newDueDate))
      });
      //update the task list
      onReject();
      onClose();
    } catch (err) {
      console.error('Error rejecting task:', err);
      alert('Failed to reject.');
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#fff', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '90%'}}>

        <h3>Reject & Reassign</h3>
        <textarea placeholder="Enter reason for rejection" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px' }}/>

        <label>New Due Date:</label>
        <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '5px' }}/>

        <div style={{ textAlign: 'right' }}>
          <button onClick={handleReject}
            style={{ background: '#e53935', color: 'white', padding: '10px 20px',  borderRadius: '5px', border: 'none' }}>Reject</button>
          <button onClick={onClose}
            style={{ marginLeft: '10px', padding: '10px 20px', border: 'none',backgroundColor:'#888',borderRadius: '5px', color: 'white' }}>Cancel
          </button>
        </div>

      </div>
      
    </div>
  );
};

export default RejectTaskModal;
