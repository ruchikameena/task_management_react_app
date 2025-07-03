import React, { useState, useEffect } from 'react';
import './Board.css';
import EditTaskModal from '../components/EditTask';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '../context/authContext';
import CreateTaskPopup from '../components/CreateTaskPopup';
import TaskCard from '../components/TaskCard';

const Board = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'tasks'),
      where('assignedBy', '==', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsub();
  }, [user]);

  const now = new Date();

  const getColumnTasks = () => {
    return {
      todo: tasks.filter(
        (task) =>
          (!task.assignedTo || !task.dueDate) && !task.submissionLink
      ),
      ongoing: tasks.filter(
        (task) =>
          task.assignedTo &&
          task.dueDate &&
          !task.submissionLink &&
          new Date(task.dueDate.seconds * 1000) > now
      ),
      completed: tasks.filter(
        (task) => !!task.submissionLink
      ),
      pending: tasks.filter(
        (task) =>
          task.assignedTo &&
          task.dueDate &&
          !task.submissionLink &&
          new Date(task.dueDate.seconds * 1000) < now
      ),
    };
  };

  const columns = getColumnTasks();

  const columnOrder = ['todo', 'ongoing', 'completed', 'pending'];
  const columnNames = {
    todo: '📝 To Do',
    ongoing: '🔄 Ongoing',
    completed: '✅ Completed',
    pending: '⚠️ Pending',
  };

  return (
    <div className='board_main'>
      <div className='board_main_task'>
        <button
          onClick={() => setShowPopup(true)}
          className='board_main_task_btn'
        >
          ➕ Create Task
        </button>
      </div>

      <div className='boarder_main_holder'>
        {columnOrder.map((colKey) => (
          <div
            key={colKey}
            className='board_main_clm'
          >
            <h3 style={{marginBottom:'2px'}}>{columnNames[colKey]}</h3>
            {columns[colKey].length === 0 ? (
              <p>No tasks</p>
            ) : (
              columns[colKey].map((task) => (
                <TaskCard key={task.id} task={task} onEdit={setEditTask} />
              ))
            )}
          </div>
        ))}
      </div>

      {showPopup && (
        <CreateTaskPopup
          onClose={() => setShowPopup(false)}
          onTaskCreated={() => {}}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
};

export default Board;
