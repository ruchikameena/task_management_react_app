import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const EditTaskModal = ({ task, onClose }) => {
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate.seconds * 1000).toISOString().slice(0, 10) : ''
  );
  const [users, setUsers] = useState([]);
  //fetching all the users with id and their names
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getDocs(collection(db, 'users'));
      const userList = data.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);
  //to change the assigned person and due date
  const handleUpdate = async () => {
    try {
      const curr_task = doc(db, 'tasks', task.id);
      await updateDoc(curr_task, {
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Update failed.");
    }
  };
  //to delete the current task
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      const curr_task = doc(db, 'tasks', task.id);
      await deleteDoc(curr_task);
      onClose();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete the task.");
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

      <div style={{background: '#fff', padding: '20px', borderRadius: '10px', width: '400px', maxWidth: '90%'}}>

        <h3 style={{marginBottom:'10px'}}>Edit Task</h3>

        <label>Assign To:</label>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}>
          <option value="">-- Not Assigned --</option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.name}
            </option>
          ))}
        </select>

        <label>Due Date:</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>

          <div>
            <button onClick={handleUpdate}
              style={{padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', marginRight: '5px'}}>Save</button>

            <button onClick={onClose}
              style={{padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '5px' }}>Cancel</button>
          </div>

          <button onClick={handleDelete}
            style={{padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px'}}>Delete</button>
            
        </div>
      </div>

    </div>
  );
};

export default EditTaskModal;
