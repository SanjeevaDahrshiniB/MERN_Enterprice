import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onReturn?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturn }) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '80vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--bg-page)'
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '40px 32px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--table-row-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--primary)'
          }}
        >
          <FileQuestion size={32} />
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '16px',
            backgroundColor: 'var(--table-row-hover)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '12px'
          }}
        >
          404 ERROR
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
          The page or resource you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
        {onReturn && (
          <button
            onClick={onReturn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};
