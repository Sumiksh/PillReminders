import React from 'react';

function QuickActionCard({ icon, title, description, onClick }) {
  return (
    <div className="quick-action-card" onClick={onClick}>
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export default QuickActionCard;