import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import TaskDetailModel from '../components/TaskDetail';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const taskList = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const assignerRef = doc(db, 'users', data.assignedBy);
          const assignerSnap = await getDoc(assignerRef);

          return {
            id: docSnap.id,
            ...data,
            assignedByName: assignerSnap.exists() ? assignerSnap.data().name : 'Unknown',
          };
        })
      );

      setTasks(taskList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleSubmitSuccess = () => {
    fetchTasks(); // Refresh after submission
  };

  return (
    <div>
      <h2>📋 My Tasks</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to you yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                marginBottom: '1rem',
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: task.rejectionMessage ? '#ffe6e6' : '#f9f9f9'
              }}
            >
              <p><strong>Task:</strong> {task.title}</p>
              <p><strong>Assigned By:</strong> {task.assignedByName}</p>

              {task.rejectionMessage && (
                <p style={{ color: 'red' }}>
                  ❌ <strong>Rejected:</strong> {task.rejectionMessage}
                </p>
              )}

              {task.dueDate && (
                <p>
                  <strong>Due Date:</strong>{' '}
                  {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}
                </p>
              )}

              {task.submissionLink ? (
                <p style={{ color: 'green' }}>✅ Submitted</p>
              ) : (
                <button
                  onClick={() => setSelectedTask(task)}
                  style={{
                    padding: '0.4rem 1rem',
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedTask && (
        <TaskDetailModel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
};

export default Tasks;
