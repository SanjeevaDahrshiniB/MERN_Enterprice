import React, { useState } from 'react';
import { authService } from '../services/auth.service';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';

interface LoginPageProps {
  onLoginSuccess: (user: unknown) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@triunedemo.com');
  const [password, setPassword] = useState('Admin@123');
  const [tenantSlug, setTenantSlug] = useState('triune-demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login({
        email,
        password,
        tenantSlug: tenantSlug.trim() || undefined
      });

      onLoginSuccess(data.user);
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'var(--bg-page)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg-surface)',
          padding: '36px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Triune Enterprise
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Multi-tenant SaaS Architecture
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              background: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Tenant Slug"
            type="text"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            placeholder="e.g. triune-demo"
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@triunedemo.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            background: 'var(--table-header-bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>Demo Seed Account:</strong>
          <br />
          Email: <code>admin@triunedemo.com</code>
          <br />
          Password: <code>Admin@123</code>
          <br />
          Tenant: <code>triune-demo</code>
        </div>
      </div>
    </div>
  );
};
