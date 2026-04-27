import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Flame, Zap, BookOpen, Clock, Target, ChevronRight, TrendingUp, Play, Award } from 'lucide-react';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
  <div style={{
    padding: '24px', borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    flex: 1, minWidth: 160,
    transition: 'all 0.3s ease'
  }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${color}40`;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{
      width: 40, height: 40, borderRadius: 10, marginBottom: 16,
      background: `${color}15`, border: `1px solid ${color}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={20} color={color} />
    </div>
    <div style={{
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
      color: 'var(--text-primary)', marginBottom: 4
    }}>
      {value}
    </div>
    <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
    {subtitle && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/progress/dashboard/stats')
      .then(({ data }) => setStats(data.stats))
      .finally(() => setLoading(false));
  }, []);

  const xpToNext = (user?.level || 1) * 500;
  const xpProgress = ((user?.xp || 0) % xpToNext) / xpToNext * 100;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Welcome */}
        <div style={{
          marginBottom: 36, animation: 'fadeUp 0.4s ease',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-1px', marginBottom: 8
            }}>
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              {user?.streak > 0
                ? `You're on a ${user.streak}-day streak! Keep it up.`
                : "Ready to start learning today?"}
            </p>
          </div>

          {/* Level bar */}
          <div style={{
            padding: '16px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            minWidth: 200
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Level {user?.level || 1}
              </span>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {user?.xp || 0} / {xpToNext} XP
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${xpProgress}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                borderRadius: 3, transition: 'width 1s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ flex: 1, height: 120, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap', animation: 'fadeUp 0.5s ease' }}>
            <StatCard icon={Flame} label="Day Streak" value={`${user?.streak || 0}🔥`} color="#ff6584" />
            <StatCard icon={Zap} label="Total XP" value={user?.xp || 0} color="var(--accent)" />
            <StatCard icon={BookOpen} label="Courses Enrolled" value={stats?.enrolledCourses || 0} color="var(--accent-2)" />
            <StatCard icon={Target} label="Completed" value={stats?.completedCourses || 0} color="var(--accent-green)" />
            <StatCard
              icon={Clock} label="Watch Time"
              value={stats ? formatTime(stats.totalWatchTime) : '0m'}
              color="#ffd93d"
            />
          </div>
        )}

        {/* Continue Learning */}
        {stats?.recentCourses?.length > 0 && (
          <section style={{ marginBottom: 40, animation: 'fadeUp 0.6s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                Continue Learning
              </h2>
              <button onClick={() => navigate('/courses')} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', color: 'var(--accent)',
                fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500
              }}>
                Explore more <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {stats.recentCourses.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/learn/${p.course?._id}`)}
                  style={{
                    padding: '20px', borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    display: 'flex', alignItems: 'center', gap: 16
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {p.course?.thumbnail ? (
                    <img src={p.course.thumbnail} alt={p.course.title}
                      style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 56, height: 56, borderRadius: 10, flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <BookOpen size={24} color="white" />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
                      marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {p.course?.title || 'Course'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 10,
                        background: 'rgba(108,99,255,0.12)', color: 'var(--accent)'
                      }}>
                        {p.course?.category}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', width: `${p.overallProgress || 0}%`,
                        background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                        borderRadius: 2
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {p.overallProgress || 0}% complete
                    </div>
                  </div>

                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 16px var(--accent-glow)'
                  }}>
                    <Play size={14} color="white" style={{ marginLeft: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading && (!stats?.recentCourses || stats.recentCourses.length === 0) && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)', animation: 'fadeUp 0.5s ease'
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px var(--accent-glow)'
            }}>
              <BookOpen size={32} color="white" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 12 }}>
              Start Your Journey
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
              Explore our curated tech courses and begin learning without distractions.
            </p>
            <button onClick={() => navigate('/courses')} style={{
              padding: '14px 32px', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent), #5a52d5)',
              color: 'white', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
              border: 'none', cursor: 'pointer', boxShadow: '0 0 24px var(--accent-glow)'
            }}>
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
