import { useState } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

const TaskDetailModal = ({ task, onClose, onSubmitSuccess }) => {
  const [submissionLink, setSubmissionLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  //To handle the submission of tasks
  const handleSubmit = async () => {
    if (!submissionLink) return alert("Please enter a submission link.");
    setSubmitting(true);
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        submissionLink,
        submittedAt: Timestamp.now(),
        status: 'completed',
        rejectionMessage: '',
      });
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting task:", err);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#fff', padding: '20px', borderRadius: '10px',width: '400px', maxWidth: '90%'}}>
        <h3>{task.title}</h3>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate.seconds * 1000).toLocaleString()}</p>

        {task.submissionLink ? (
          <p style={{ color: 'green' }}>✅ Submitted</p>
        ) : (
          <>
            <input type="text" placeholder="Enter submission link" value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} style={{ width: '100%', padding: '5px', marginTop: '10px' }}/>
            <button onClick={handleSubmit} disabled={submitting}
              style={{marginTop: '10px',padding: '10px 20px',background: '#4caf50',color: 'white',border: 'none',borderRadius: '5px',cursor: 'pointer'}}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </>
        )}

        <button onClick={onClose}
          style={{marginTop: '10px',marginLeft: '10px',padding: '10px 20px',background: '#888',color: 'white',border: 'none', borderRadius: '5px',cursor: 'pointer'}}>Close
        </button>

      </div>
      
    </div>
  );
};

export default TaskDetailModal;
