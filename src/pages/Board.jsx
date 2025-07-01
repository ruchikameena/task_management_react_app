import React, { useState, useEffect } from 'react';
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
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

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

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const newStatus = {
      todo: 'not-started',
      ongoing: 'in-progress',
      completed: 'completed',
      pending: 'pending',
    }[destination.droppableId];

    const taskRef = doc(db, 'tasks', draggableId);
    await updateDoc(taskRef, {
      status: newStatus,
    });
  };

  const columnOrder = ['todo', 'ongoing', 'completed', 'pending'];
  const columnNames = {
    todo: '📝 To Do',
    ongoing: '🔄 Ongoing',
    completed: '✅ Completed',
    pending: '⚠️ Pending',
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button
          onClick={() => setShowPopup(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          ➕ Create Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {columnOrder.map((colKey) => (
            <Droppable droppableId={colKey} key={colKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    background: '#f1f1f1',
                    padding: '1rem',
                    borderRadius: '8px',
                    minHeight: '300px',
                    maxWidth: '23%',
                  }}
                >
                  <h3>{columnNames[colKey]}</h3>
                  {columns[colKey].length === 0 ? (
                    <p>No tasks</p>
                  ) : (
                    columns[colKey].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} onEdit={setEditTask} />

                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

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
