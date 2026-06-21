import React, { createContext, useCallback, useContext, useState, useId } from 'react';
import Button from './Button';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const baseId = useId();

  const confirm = useCallback(({ title, message, confirmLabel = 'Confirm', variant = 'danger' }) => {
    return new Promise((resolve) => {
      setState({ title, message, confirmLabel, variant, resolve });
    });
  }, []);

  const handleClose = (result) => {
    if (state) {
      state.resolve(result);
      setState(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <>
          <div className="modal-overlay" onClick={() => handleClose(false)} aria-hidden="true" />
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby={`${baseId}-title`}>
            <h2 className="modal-title" id={`${baseId}-title`}>{state.title}</h2>
            <p className="modal-message">{state.message}</p>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button variant={state.variant} onClick={() => handleClose(true)}>{state.confirmLabel}</Button>
            </div>
          </div>
        </>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
