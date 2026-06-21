import React, { useState } from 'react';

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`tabs ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`tab ${activeTab === tab.value ? 'tab-active' : ''}`}
          style={{
            padding: '0.8rem 1.5rem', fontFamily: 'inherit', fontWeight: 900,
            textTransform: 'uppercase', border: '3px solid black', borderBottom: 'none',
            borderRadius: 0, background: activeTab === tab.value ? tab.color || 'var(--yellow)' : 'white',
            cursor: 'pointer', boxShadow: activeTab === tab.value ? '0px 0px 0 black' : '2px -2px 0 black',
            transform: activeTab === tab.value ? 'translateY(4px)' : 'none',
            fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
            color: activeTab === tab.value && tab.invert ? 'white' : 'black',
          }}
        >
          {tab.icon && <tab.icon size={16} />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ value, activeTab, children }) {
  if (value !== activeTab) return null;
  return <div className="tab-panel">{children}</div>;
}

export default Tabs;
