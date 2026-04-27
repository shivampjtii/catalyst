import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BookOpen, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') || 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        if (!form.name.trim()) return toast.error('Name is required');
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome to FocusLearn!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 15, fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s ease', outline: 'none'
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
    marginBottom: 7, display: 'block', fontFamily: 'var(--font-display)'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108,99,255,0.1) 0%, transparent 70%)'
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        animation: 'fadeUp 0.4s ease'
      }}>
        {/* Back button */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32,
          background: 'none', color: 'var(--text-muted)', fontSize: 14,
          fontFamily: 'var(--font-body)', cursor: 'pointer', border: 'none',
          transition: 'color 0.2s ease'
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={15} /> Back to home
        </button>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '40px 36px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-glow)'
            }}>
              <BookOpen size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>
              FocusLearn
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
            marginBottom: 8, letterSpacing: '-0.5px'
          }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
            {mode === 'login'
              ? 'Continue your learning journey'
              : 'Start your distraction-free learning journey'
            }
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle} required
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={inputStyle} required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ ...inputStyle, paddingRight: 46 }} required minLength={6}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', color: 'var(--text-muted)', cursor: 'pointer', border: 'none',
                  display: 'flex', alignItems: 'center'
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              padding: '15px', borderRadius: 'var(--radius-md)', marginTop: 6,
              background: loading ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent), #5a52d5)',
              color: loading ? 'var(--text-muted)' : 'white',
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 24px var(--accent-glow)',
              transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, border: '2px solid var(--text-muted)',
                    borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                  }} />
                  Processing...
                </>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: 24, paddingTop: 24,
            borderTop: '1px solid var(--border)'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)'
            }}>
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
