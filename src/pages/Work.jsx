import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import RejectTaskModal from '../components/RejectTask';
import './Work.css';
import Lottie from 'lottie-react';
import NO_TASK from '../assets/no_task.json';
const Work = () => {
  const { user } = useAuth();
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectTask, setSelectedRejectTask] = useState(null);

  // New states for filter and sort
  const [filterDate, setFilterDate] = useState('');
  const [sortOption, setSortOption] = useState('fastest');

  const fetchSubmittedTasks = async () => {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('assignedBy', '==', user.uid),
        where('status', '==', 'completed')
      );

      const querySnapshot = await getDocs(q);

      const tasksWithUserNames = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const taskData = { id: docSnap.id, ...docSnap.data() };

          let assignedToName = 'Unknown';
          if (taskData.assignedTo) {
            const assignedToRef = doc(db, 'users', taskData.assignedTo);
            const assignedToSnap = await getDoc(assignedToRef);
            if (assignedToSnap.exists()) {
              assignedToName = assignedToSnap.data().name;
            }
          }

          return {
            ...taskData,
            assignedToName,
          };
        })
      );

      setSubmittedTasks(tasksWithUserNames);
    } catch (err) {
      console.error('Error fetching submitted tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSubmittedTasks();
  }, [user]);

  // FILTERING by submission date
  const filteredTasks = filterDate
    ? submittedTasks.filter(task => {
        const subDate = new Date(task.submittedAt?.seconds * 1000);
        const selected = new Date(filterDate);
        return (
          subDate.getFullYear() === selected.getFullYear() &&
          subDate.getMonth() === selected.getMonth() &&
          subDate.getDate() === selected.getDate()
        );
      })
    : submittedTasks;

  // SORTING by submission speed
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aSubmitted = a.submittedAt?.seconds ?? 0;
    const bSubmitted = b.submittedAt?.seconds ?? 0;
    const aDue = a.dueDate?.seconds ?? 0;
    const bDue = b.dueDate?.seconds ?? 0;

    const aDuration = aSubmitted - aDue;
    const bDuration = bSubmitted - bDue;

    return sortOption === 'fastest' ? aDuration - bDuration : bDuration - aDuration;
  });

  return (
    <div className='work_main'>
      <h2 style={{marginBottom:'10px'}}>📄 Work Submitted To Me</h2>

      {/* 🔍 Filter and Sort Controls */}
      <div style={{ marginBottom: '20px' }}>
        <label><strong>Filter by Date:</strong>{' '}</label>
        <input
          type="date"
          className='work_filter'
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <br className='line_breaker'/>
        <label><strong>Sort by:</strong>{' '}</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className='work_sort'>
          <option className='work_sort_option' value="fastest">Early submissions</option >
          <option className='work_sort_option' value="slowest">Late submissions</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sortedTasks.length === 0 ? (
        <div className="task_animation">
          <Lottie animationData={NO_TASK} loop={true} className='No_tasks' />
          <h2>No Submissions yet....!</h2>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sortedTasks.map((task) => (
            <li
              key={task.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <p style={{marginBottom:'10px'}}><strong>Task:</strong> {task.title}</p>
              <p><strong>Submitted By:</strong> {task.assignedToName}</p>
              <p>
                <strong>Submission Link:</strong>{' '}
                <a href={task.submissionLink} target="_blank" rel="noreferrer">
                  View submission🔗</a>
              </p>
              {task.submittedAt && (
                <p>
                  <strong>Submitted At:</strong>{' '}
                  {new Date(task.submittedAt.seconds * 1000).toLocaleString()}
                </p>
              )}
              <button
                style={{
                  marginTop: '10px',
                  background: 'rgb(0, 0, 0,0.8)',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedRejectTask(task)}
              >
                Reject & Reassign
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedRejectTask && (
        <RejectTaskModal
          task={selectedRejectTask}
          onClose={() => setSelectedRejectTask(null)}
          onReject={fetchSubmittedTasks}
        />
      )}
    </div>
  );
};

export default Work;
