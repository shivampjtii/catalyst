import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import {
  Link, Search, CheckCircle, AlertCircle, Loader,
  ChevronRight, BookOpen, Clock, Play, Globe, Brain,
  Code2, Database, Cpu, Layers, X
} from 'lucide-react';

const CATEGORIES = ['Web Development', 'DSA', 'AI/ML', 'Python', 'JavaScript', 'System Design', 'DevOps', 'Database', 'Mobile Dev', 'Other'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const formatDuration = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function AddCoursePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: URL input, 2: preview, 3: details, 4: done
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Intermediate',
    instructor: '',
    tags: ''
  });

  const extractPlaylistId = (url) => {
    const patterns = [
      /[?&]list=([^&]+)/,
      /playlist\?list=([^&]+)/,
    ];
    for (const p of patterns) {
      const match = url.match(p);
      if (match) return match[1];
    }
    // Maybe it's just the ID itself
    if (/^PL[a-zA-Z0-9_-]+$/.test(url.trim())) return url.trim();
    return null;
  };

  const fetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      toast.error('Invalid YouTube playlist URL or ID');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/youtube/playlist/${playlistId}`);
      setPlaylistData(data);
      setForm(prev => ({
        ...prev,
        title: data.playlist.title,
        description: data.playlist.description,
        instructor: data.playlist.channelTitle
      }));
      setStep(2);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to fetch playlist. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.difficulty || !form.instructor) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const courseData = {
        title: form.title,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        instructor: form.instructor,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        youtubePlaylistId: playlistData.playlist.id,
        thumbnail: playlistData.playlist.thumbnail,
        videos: playlistData.videos,
        totalDuration: playlistData.videos.reduce((a, v) => a + v.duration, 0),
      };
      await axios.post('/api/courses', courseData);
      toast.success('Course added successfully!');
      setStep(4);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s ease', outline: 'none'
  };
  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
    marginBottom: 8, display: 'block', fontFamily: 'var(--font-display)'
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40, animation: 'fadeUp 0.4s ease' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            letterSpacing: '-1px', marginBottom: 8
          }}>
            Add a Course
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Import any YouTube playlist and turn it into a structured learning course.
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
          {['Paste URL', 'Preview', 'Details', 'Done'].map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: done ? 'var(--accent-green)' : active ? 'var(--accent)' : 'var(--bg-card)',
                    border: `2px solid ${done ? 'var(--accent-green)' : active ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                    color: done || active ? 'white' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    boxShadow: active ? '0 0 20px var(--accent-glow)' : 'none'
                  }}>
                    {done ? <CheckCircle size={16} /> : num}
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600,
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}>{label}</span>
                </div>
                {i < 3 && (
                  <div style={{
                    flex: 1, height: 2, marginBottom: 18,
                    background: step > num ? 'var(--accent-green)' : 'var(--border)',
                    transition: 'background 0.3s ease'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1: URL Input */}
        {step === 1 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '40px',
            animation: 'fadeUp 0.4s ease'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, marginBottom: 24,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px var(--accent-glow)'
            }}>
              <Link size={26} color="white" />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
              Paste YouTube Playlist URL
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Paste a YouTube playlist URL or playlist ID below. We'll automatically import all videos,
              titles, thumbnails and durations.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/playlist?list=PLxxxxxx"
                  value={playlistUrl}
                  onChange={e => setPlaylistUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchPlaylist()}
                  style={{ ...inputStyle, paddingLeft: 44 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <Globe size={15} color="var(--text-muted)" style={{
                  position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)'
                }} />
                {playlistUrl && (
                  <button onClick={() => setPlaylistUrl('')} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                  }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={fetchPlaylist}
                disabled={!playlistUrl.trim() || loading}
                style={{
                  padding: '13px 24px', borderRadius: 'var(--radius-md)',
                  background: loading || !playlistUrl.trim()
                    ? 'var(--bg-secondary)'
                    : 'linear-gradient(135deg, var(--accent), #5a52d5)',
                  color: loading || !playlistUrl.trim() ? 'var(--text-muted)' : 'white',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: loading || !playlistUrl.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                  boxShadow: loading || !playlistUrl.trim() ? 'none' : '0 0 20px var(--accent-glow)',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? (
                  <><div style={{
                    width: 16, height: 16, border: '2px solid var(--text-muted)',
                    borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                  }} /> Fetching...</>
                ) : (
                  <><Search size={15} /> Import Playlist</>
                )}
              </button>
            </div>

            <div style={{
              marginTop: 24, padding: '14px 18px', borderRadius: 'var(--radius-md)',
              background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.1)',
              display: 'flex', gap: 10
            }}>
              <AlertCircle size={15} color="var(--accent-2)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Make sure your YouTube Data API key is configured in the backend <code style={{
                  background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 4,
                  fontSize: 12, color: 'var(--accent-2)'
                }}>.env</code> file.
                Only public playlists are supported.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Preview */}
        {step === 2 && playlistData && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 20
            }}>
              {/* Playlist info */}
              <div style={{
                display: 'flex', gap: 20, padding: '24px',
                borderBottom: '1px solid var(--border)'
              }}>
                {playlistData.playlist.thumbnail && (
                  <img src={playlistData.playlist.thumbnail} alt="Playlist"
                    style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                )}
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                    marginBottom: 6, lineHeight: 1.3
                  }}>
                    {playlistData.playlist.title}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                    by {playlistData.playlist.channelTitle}
                  </p>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Play size={12} color="var(--accent)" /> {playlistData.playlist.totalVideos} videos
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Clock size={12} color="var(--accent-2)" /> {formatDuration(playlistData.playlist.totalDuration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video list preview */}
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {playlistData.videos.map((v, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 20px',
                    borderBottom: i < playlistData.videos.length - 1 ? '1px solid var(--border)' : 'none'
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-muted)'
                    }}>{i + 1}</span>
                    {v.thumbnail && (
                      <img src={v.thumbnail} alt="" style={{
                        width: 52, height: 30, objectFit: 'cover', borderRadius: 4, flexShrink: 0
                      }} />
                    )}
                    <span style={{
                      flex: 1, fontSize: 13, color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>{v.title}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {Math.floor(v.duration / 60)}m
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => { setStep(1); setPlaylistData(null); }} style={{
                padding: '12px 22px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)'
              }}>
                Go Back
              </button>
              <button onClick={() => setStep(3)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent), #5a52d5)',
                color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer', boxShadow: '0 0 20px var(--accent-glow)'
              }}>
                Looks good! <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Course Details Form */}
        {step === 3 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '36px',
            animation: 'fadeUp 0.4s ease'
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 6 }}>
              Course Details
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
              Fill in the details to make this course discoverable.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelStyle}>Course Title *</label>
                <input
                  type="text" value={form.title} maxLength={100}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Complete React Developer Course"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea
                  value={form.description} maxLength={1000}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What will students learn from this course?"
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Difficulty *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {DIFFICULTIES.map(d => {
                      const colors = { Beginner: 'var(--accent-green)', Intermediate: '#ffd93d', Advanced: 'var(--accent-3)' };
                      const active = form.difficulty === d;
                      return (
                        <button key={d} onClick={() => setForm(p => ({ ...p, difficulty: d }))} style={{
                          flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)',
                          background: active ? `${colors[d]}15` : 'var(--bg-secondary)',
                          border: `1px solid ${active ? colors[d] : 'var(--border)'}`,
                          color: active ? colors[d] : 'var(--text-muted)',
                          fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700,
                          transition: 'all 0.2s ease'
                        }}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Instructor / Channel *</label>
                <input
                  type="text" value={form.instructor}
                  onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))}
                  placeholder="e.g. Traversy Media"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={labelStyle}>Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma separated)</span></label>
                <input
                  type="text" value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                  placeholder="react, hooks, frontend, javascript"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28 }}>
              <button onClick={() => setStep(2)} style={{
                padding: '12px 22px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)'
              }}>
                Back
              </button>
              <button onClick={handleSubmit} disabled={submitting} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 32px',
                borderRadius: 'var(--radius-md)',
                background: submitting ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent), #5a52d5)',
                color: submitting ? 'var(--text-muted)' : 'white',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 0 20px var(--accent-glow)',
                transition: 'all 0.2s ease'
              }}>
                {submitting ? (
                  <><div style={{
                    width: 16, height: 16, border: '2px solid var(--text-muted)',
                    borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                  }} /> Publishing...</>
                ) : (
                  <>Publish Course <ChevronRight size={15} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div style={{
            textAlign: 'center', padding: '60px 40px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', animation: 'fadeUp 0.4s ease'
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
              background: 'linear-gradient(135deg, var(--accent-green), #00b377)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(0,214,143,0.3)'
            }}>
              <CheckCircle size={36} color="white" />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
              marginBottom: 12, letterSpacing: '-0.5px'
            }}>
              Course Published!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{form.title}</strong> is now
              live and available to all learners on FocusLearn.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/courses')} style={{
                padding: '13px 28px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)'
              }}>
                Browse Courses
              </button>
              <button onClick={() => {
                setStep(1); setPlaylistUrl(''); setPlaylistData(null);
                setForm({ title: '', description: '', category: '', difficulty: 'Intermediate', instructor: '', tags: '' });
              }} style={{
                padding: '13px 28px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent), #5a52d5)',
                color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer', boxShadow: '0 0 20px var(--accent-glow)'
              }}>
                Add Another Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
