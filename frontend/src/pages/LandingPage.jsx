import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Shield, Brain, ChevronRight, Code2, Terminal, Cpu } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Zero Distractions', desc: 'Pure focus mode. No ads, no notifications, no social feeds. Just you and the content.', color: '#6c63ff' },
  { icon: Brain, title: 'AI-Powered Quizzes', desc: 'After each video, Claude AI generates personalized MCQ tests to cement your understanding.', color: '#00e5ff' },
  { icon: Zap, title: 'Track Your Growth', desc: 'XP, streaks, levels, and real-time progress tracking to keep you motivated.', color: '#00d68f' },
  { icon: Code2, title: 'Tech-Focused Only', desc: 'Curated for coders. Web dev, DSA, AI/ML, DevOps — only what matters.', color: '#ff6584' },
];

const floatingTech = ['React', 'Python', 'DSA', 'ML', 'Git', 'SQL', 'Node', 'TypeScript'];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(108,99,255,0.15) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, right: 0, width: 600, height: 600, zIndex: -1,
        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
      }} />

      {/* Grid lines */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 60px', position: 'relative', zIndex: 10
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px var(--accent-glow)'
          }}>
            <BookOpen size={18} color="white" />
          </div>
          FocusLearn
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/auth?mode=login')} style={{
            padding: '10px 22px', borderRadius: 'var(--radius-md)',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 14,
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
          >
            Sign In
          </button>
          <button onClick={() => navigate('/auth?mode=register')} style={{
            padding: '10px 22px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent), #5a52d5)',
            color: 'white', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            border: 'none', cursor: 'pointer', boxShadow: '0 0 20px var(--accent-glow)'
          }}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '100px 24px 80px', position: 'relative'
      }}>
        {/* Floating tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', borderRadius: 100,
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)',
          marginBottom: 36, animation: 'fadeUp 0.6s ease'
        }}>
          <Zap size={13} color="var(--accent)" />
          <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            AI-powered tech learning
          </span>
        </div>

        {/* Headline */}
        <div ref={heroRef} style={{ transition: 'transform 0.1s ease' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(48px, 8vw, 88px)', lineHeight: 1.05,
            letterSpacing: '-3px', marginBottom: 24, animation: 'fadeUp 0.7s ease'
          }}>
            Learn Tech Without<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Distractions
            </span>
          </h1>
        </div>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
          maxWidth: 560, lineHeight: 1.7, marginBottom: 44,
          animation: 'fadeUp 0.8s ease'
        }}>
          A focused learning platform for developers. Watch curated YouTube playlists,
          take AI-generated quizzes, and track your mastery — all without distractions.
        </p>

        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeUp 0.9s ease'
        }}>
          <button onClick={() => navigate('/auth?mode=register')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '16px 32px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent), #5a52d5)',
            color: 'white', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 0 40px var(--accent-glow), 0 8px 32px rgba(108,99,255,0.3)',
            transition: 'all 0.3s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Learning Free <ChevronRight size={18} />
          </button>
          <button onClick={() => navigate('/auth?mode=login')} style={{
            padding: '16px 28px', borderRadius: 'var(--radius-md)',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 15,
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}>
            I have an account
          </button>
        </div>

        {/* Floating tech chips */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
          maxWidth: 500, marginTop: 56, animation: 'fadeUp 1s ease'
        }}>
          {floatingTech.map((tech, i) => (
            <div key={tech} style={{
              padding: '6px 14px', borderRadius: 20,
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-display)',
              fontWeight: 500
            }}>
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 56, letterSpacing: '-1px'
        }}>
          Built for Deep Focus
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20
        }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={title} style={{
              padding: '28px 26px', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              animation: `fadeUp ${0.3 + i * 0.1}s ease`,
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${color}40`;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 18,
                background: `${color}15`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                marginBottom: 10, color: 'var(--text-primary)'
              }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: 'center', padding: '80px 24px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(108,99,255,0.08) 0%, transparent 70%)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40,
          marginBottom: 16, letterSpacing: '-1px'
        }}>
          Ready to focus?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 17 }}>
          Join developers who learn smarter, not harder.
        </p>
        <button onClick={() => navigate('/auth?mode=register')} style={{
          padding: '16px 40px', borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          color: 'white', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 0 40px var(--accent-glow)'
        }}>
          Get Started — It's Free
        </button>
      </div>
    </div>
  );
}
