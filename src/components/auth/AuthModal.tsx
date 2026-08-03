'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const setUser   = useStore(s => s.setUser);
  const goAccount = useStore(s => s.goAccount);

  const [tab, setTab]           = useState<'signin' | 'signup'>('signin');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const inputSty: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(10,10,10,0.18)', borderRadius: 0,
    padding: '12px 14px', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', background: '#fff', color: '#0a0a0a',
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    const u = data.user;
    const displayName = (u.user_metadata?.name as string) || u.email?.split('@')[0] || 'User';
    setUser({ id: u.id, email: u.email!, name: displayName });
    onClose();
    goAccount();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data.user && !data.session) {
      // Email confirmation required
      setDone(true);
    } else if (data.user) {
      setUser({ id: data.user.id, email: data.user.email!, name });
      onClose();
      goAccount();
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(10,10,10,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'viewFadeIn 0.2s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 420, background: '#fdfdfc',
          padding: '48px 40px', position: 'relative',
          boxShadow: '0 24px 80px rgba(10,10,10,0.18)',
          animation: 'viewFadeIn 0.25s ease both',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b6b6b', lineHeight: 1 }}
        >×</button>

        {/* Logo */}
        <div style={{ font: "800 18px/1 'Archivo',sans-serif", letterSpacing: '0.06em', marginBottom: 32 }}>TIVORA</div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Check your email</div>
            <div style={{ fontSize: 14, color: '#6b6b6b', lineHeight: 1.6 }}>
              We sent a confirmation link to <strong>{email}</strong>.<br />
              Click it to activate your account, then sign in.
            </div>
            <button
              onClick={() => { setDone(false); setTab('signin'); }}
              style={{ marginTop: 28, background: '#0a0a0a', color: '#fff', border: 'none', padding: '14px 32px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', cursor: 'pointer' }}
            >BACK TO SIGN IN</button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(10,10,10,0.12)', marginBottom: 32 }}>
              {(['signin', 'signup'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); }}
                  style={{
                    flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0 0 14px',
                    font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em',
                    color: tab === t ? '#0a0a0a' : '#9a9a96',
                    borderBottom: tab === t ? '2px solid #0a0a0a' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >{t === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}</button>
              ))}
            </div>

            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>EMAIL</div>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required autoComplete="email" style={inputSty} />
                </div>
                <div>
                  <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>PASSWORD</div>
                  <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required autoComplete="current-password" style={inputSty} />
                </div>
                {error && <div style={{ font: "500 13px 'Inter',sans-serif", color: '#b02a2a', background: '#fdf0f0', padding: '10px 14px' }}>{error}</div>}
                <button
                  type="submit" disabled={loading}
                  style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '16px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer', marginTop: 8, opacity: loading ? 0.6 : 1 }}
                >{loading ? 'SIGNING IN…' : 'SIGN IN'}</button>
                <div style={{ textAlign: 'center', font: "400 13px 'Inter',sans-serif", color: '#6b6b6b' }}>
                  No account?{' '}
                  <button type="button" onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Create one</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>FULL NAME</div>
                  <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }} required autoComplete="name" style={inputSty} />
                </div>
                <div>
                  <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>EMAIL</div>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required autoComplete="email" style={inputSty} />
                </div>
                <div>
                  <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>PASSWORD</div>
                  <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required autoComplete="new-password" style={inputSty} />
                </div>
                <div>
                  <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>CONFIRM PASSWORD</div>
                  <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(''); }} required autoComplete="new-password" style={inputSty} />
                </div>
                {error && <div style={{ font: "500 13px 'Inter',sans-serif", color: '#b02a2a', background: '#fdf0f0', padding: '10px 14px' }}>{error}</div>}
                <button
                  type="submit" disabled={loading}
                  style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '16px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer', marginTop: 8, opacity: loading ? 0.6 : 1 }}
                >{loading ? 'CREATING…' : 'CREATE ACCOUNT'}</button>
                <div style={{ textAlign: 'center', font: "400 13px 'Inter',sans-serif", color: '#6b6b6b' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('signin')} style={{ background: 'none', border: 'none', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign in</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
