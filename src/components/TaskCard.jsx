import React from 'react';
const TaskCard = ({ task, onEdit }) => {
  return (
    <div
      style={{
        background: '#fff',
        margin: '10px 0',
        padding: '0.8rem',
        borderRadius: '5px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        position:'relative',
      }}
    >
      
      {onEdit && (
        <button
          onClick={() => onEdit(task)}
          style={{
            position:'absolute',
            right:'0',
            top:'0',
            padding: '5px 20px',
            fontSize: '0.75rem',
            borderRadius: '3px',
            backgroundColor: 'rgb(0, 0, 0,0.8)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            textAlign:'right'
          }}
        >
          Edit
        </button>
      )}
      <h4 style={{marginTop:'20px'}}>{task.title}</h4>

      {task.dueDate && (
        <p><strong>Due:</strong> {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default TaskCard;
