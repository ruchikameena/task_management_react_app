import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Lottie from 'lottie-react';
import TaskDetailModel from '../components/TaskDetail';
import './Tasks.css';
import NO_TASK from '../assets/no_task.json';
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleSubmitSuccess = () => {
    fetchTasks(); // Refresh after submission
  };

  return (
    <div className='tasks_main'>
      <h2 style={{marginBottom:'10px'}}>📋 My Tasks</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="task_animation">
          <Lottie animationData={NO_TASK} loop={true} className='No_tasks' />
          <h2>No Task Assigned To You....!</h2>
        </div>
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
              <p style={{marginBottom:'10px'}}><strong>Task:</strong> {task.title}</p>
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
                    marginTop:'10px',
                    padding: '5px 20px',
                    background: 'rgb(0, 0, 0,0.8)',
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
