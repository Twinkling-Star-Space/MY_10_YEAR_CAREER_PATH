import React, { useState } from 'react';

const TaskForm = ({ onSubmit, onCancel, placeholderTitle, showDescription = true }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim()
    });
    
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholderTitle || "Enter title"}
          className="form-input"
          autoFocus
        />
      </div>
      
      {showDescription && (
        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
            className="form-textarea"
            rows="3"
          />
        </div>
      )}
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Save
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;