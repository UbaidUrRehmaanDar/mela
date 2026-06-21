import React from 'react';
import Button from './ui/Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div
            style={{
              background: 'var(--white)',
              border: '3px solid #000',
              boxShadow: '8px 8px 0 0 #000',
              padding: '2rem',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Something went wrong
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
            >
              Reload App
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
