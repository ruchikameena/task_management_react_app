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
        position: 'relative',
      }}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      {task.dueDate && (
        <p><strong>Due:</strong> {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}</p>
      )}
      {task.assignedTo && (
        <p><strong>Assigned To:</strong> {task.assignedTo}</p>
      )}
      {task.submissionLink && (
        <p><strong>Submitted:</strong> <a href={task.submissionLink} target="_blank" rel="noreferrer">View</a></p>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit(task)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '0.3rem 0.6rem',
            fontSize: '0.75rem',
            borderRadius: '3px',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default TaskCard;
