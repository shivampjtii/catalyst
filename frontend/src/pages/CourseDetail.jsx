import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Clock, Users, BookOpen, Play, CheckCircle, Lock, ChevronRight, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatDuration = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatSeconds = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const isEnrolled = user?.enrolledCourses?.some(c => c._id === id || c === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/courses/${id}`);
        setCourse(data.course);
        if (isEnrolled) {
          try {
            const { data: pd } = await axios.get(`/api/progress/${id}`);
            setProgress(pd.progress);
          } catch {}
        }
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEnrolled]);

  const enroll = async () => {
    setEnrolling(true);
    try {
      await axios.post(`/api/courses/enroll/${id}`);
      toast.success('Enrolled successfully!');
      navigate(`/learn/${id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 24px' }}>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-xl)', marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 40, width: '60%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 8 }} />
      </div>
    </div>
  );

  if (!course) return null;

  const completedCount = progress?.completedVideos?.length || 0;
  const totalCount = course.videos?.length || 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div style={{
          borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 32,
          border: '1px solid var(--border)', position: 'relative',
          animation: 'fadeUp 0.4s ease', background: 'var(--bg-card)'
        }}>
          {course.thumbnail && (
            <div style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
              <img src={course.thumbnail} alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 30%, var(--bg-card) 100%)'
              }} />
            </div>
          )}

          <div style={{ padding: '28px 32px 32px' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: 'rgba(108,99,255,0.12)', color: 'var(--accent)',
                fontFamily: 'var(--font-display)'
              }}>{course.category}</span>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: 'rgba(0,229,255,0.1)', color: 'var(--accent-2)',
                fontFamily: 'var(--font-display)'
              }}>{course.difficulty}</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
              letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.2
            }}>
              {course.title}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24, maxWidth: 700 }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
              {[
                { icon: BookOpen, val: `${totalCount} videos`, color: 'var(--accent)' },
                { icon: Clock, val: formatDuration(course.totalDuration || 0), color: 'var(--accent-2)' },
                { icon: Users, val: `${course.enrolledCount || 0} learners`, color: 'var(--accent-green)' },
              ].map(({ icon: Icon, val, color }) => (
                <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
                  <Icon size={14} color={color} /> {val}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Instructor: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{course.instructor}</span>
              </p>

              {isEnrolled ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {progressPct > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100, height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}>
                        <div style={{
                          height: '100%', width: `${progressPct}%`,
                          background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', borderRadius: 3
                        }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>{progressPct}%</span>
                    </div>
                  )}
                  <button onClick={() => navigate(`/learn/${id}`)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--accent), #5a52d5)',
                    color: 'white', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                    border: 'none', cursor: 'pointer', boxShadow: '0 0 24px var(--accent-glow)'
                  }}>
                    <Play size={16} /> {completedCount > 0 ? 'Continue' : 'Start Learning'}
                  </button>
                </div>
              ) : (
                <button onClick={enroll} disabled={enrolling} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px',
                  borderRadius: 'var(--radius-md)',
                  background: enrolling ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent), #5a52d5)',
                  color: enrolling ? 'var(--text-muted)' : 'white',
                  fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: enrolling ? 'not-allowed' : 'pointer',
                  boxShadow: enrolling ? 'none' : '0 0 24px var(--accent-glow)'
                }}>
                  {enrolling ? 'Enrolling...' : 'Enroll Free'} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div style={{ animation: 'fadeUp 0.5s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 20 }}>
            Curriculum <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 400 }}>
              ({totalCount} videos)
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {course.videos?.map((video, index) => {
              const isCompleted = progress?.completedVideos?.some(v => v.youtubeId === video.youtubeId);
              const isCurrent = progress?.currentVideo?.videoId === video._id;

              return (
                <div key={video._id || index} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  borderRadius: 'var(--radius-md)', background: 'var(--bg-card)',
                  border: `1px solid ${isCurrent ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`,
                  background: isCurrent ? 'rgba(108,99,255,0.06)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: isCompleted ? 'rgba(0,214,143,0.12)' : 'var(--bg-secondary)',
                    border: `1px solid ${isCompleted ? 'rgba(0,214,143,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                    color: isCompleted ? 'var(--accent-green)' : 'var(--text-muted)'
                  }}>
                    {isCompleted ? <CheckCircle size={14} /> : index + 1}
                  </div>

                  {video.thumbnail && (
                    <img src={video.thumbnail} alt={video.title}
                      style={{ width: 60, height: 36, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 500, color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {video.title}
                    </p>
                  </div>

                  <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                    {formatSeconds(video.duration || 0)}
                  </span>

                  {isCurrent && (
                    <span style={{
                      padding: '2px 8px', borderRadius: 10, fontSize: 10,
                      background: 'var(--accent)', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700
                    }}>
                      CURRENT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
