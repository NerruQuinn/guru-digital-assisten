import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches rendering errors and prevents blank screen.
 * This is the LAST LINE OF DEFENSE against React Error #31 and similar crashes.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleDismiss = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f8fafc',
          padding: '2rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '28px',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '0.75rem',
            }}>
              Terjadi Kesalahan Tampilan
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}>
              Aplikasi mengalami kesalahan saat merender halaman. Data Anda tetap aman. 
              Silakan muat ulang halaman atau kembali ke beranda.
            </p>
            {this.state.error && (
              <details style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                color: '#94a3b8',
                cursor: 'pointer',
              }}>
                <summary style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Detail Error</summary>
                <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error.message}
                </code>
              </details>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                onClick={this.handleDismiss}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Coba Lagi
              </button>
              <button 
                onClick={this.handleReload}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  background: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
