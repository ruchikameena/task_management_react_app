import React from 'react';
const TaskCard = ({ task, onEdit }) => {
  return (
    <div
      style={{
        background: '#fff',
        marginBottom: '1rem',
        padding: '0.8rem',
        borderRadius: '5px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        
      }}
    >
      
      {onEdit && (
        <button
          onClick={() => onEdit(task)}
          style={{
            padding: '0.3rem 0.6rem',
            fontSize: '0.75rem',
            borderRadius: '3px',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            textAlign:'right'
          }}
        >
          Edit
        </button>
      )}
      <h4>{task.title}</h4>

      {task.dueDate && (
        <p><strong>Due:</strong> {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default TaskCard;
