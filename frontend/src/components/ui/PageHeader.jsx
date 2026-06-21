import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ title, subtitle, breadcrumb, actions }) {
  return (
    <header className="page-header animate-fade-in">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="page-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
              {item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </header>
  );
}
