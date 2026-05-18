import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="admin-empty">
    {Icon && <Icon className="admin-empty-icon" />}
    <p className="admin-empty-title">{title}</p>
    <p className="admin-empty-description">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
