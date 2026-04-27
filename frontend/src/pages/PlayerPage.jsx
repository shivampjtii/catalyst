import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube';
import toast from 'react-hot-toast';
import QuizModal from '../components/QuizModal';
import { CheckCircle, ChevronLeft, ChevronRight, List, X, Play, BookOpen, Clock, Zap, Brain, Maximize, Minimize } from 'lucide-react';

const formatSeconds = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export default function PlayerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [focusMode, setFocusMode] = useState(false);

  const playerRef = useRef(null);
  const watchTimerRef = useRef(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: cd }, { data: pd }] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          axios.get(`/api/progress/${courseId}`)
        ]);
        setCourse(cd.course);
        setProgress(pd.progress);

        // Resume from last position
        const currentVid = pd.progress?.currentVideo;
        if (currentVid?.videoId) {
          const idx = cd.course.videos.findIndex(v => v._id === currentVid.videoId);
          if (idx >= 0) setCurrentIndex(idx);
        }
      } catch {
        toast.error('Course not found or not enrolled');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      clearInterval(watchTimerRef.current);
      clearTimeout(saveTimerRef.current);
    };
  }, [courseId]);

  const currentVideo = course?.videos?.[currentIndex];
  const isCompleted = progress?.completedVideos?.some(v => v.youtubeId === currentVideo?.youtubeId);

  // Save position periodically
  const savePosition = useCallback(async () => {
    if (!currentVideo || !playerRef.current) return;
    try {
      const time = playerRef.current.getCurrentTime();
      await axios.post('/api/progress/update-position', {
        courseId, videoId: currentVideo._id, timestamp: time
      });
    } catch {}
  }, [courseId, currentVideo]);

  useEffect(() => {
    saveTimerRef.current = setInterval(savePosition, 30000);
    return () => clearInterval(saveTimerRef.current);
  }, [savePosition]);

  const handleProgress = ({ playedSeconds }) => {
    setWatchTime(playedSeconds);
  };

  const handleVideoEnd = async () => {
    if (!currentVideo || isCompleted) {
      setShowQuiz(true);
      return;
    }
    // Mark video as complete
    try {
      await axios.post('/api/progress/complete-video', {
        courseId,
        videoId: currentVideo._id,
        youtubeId: currentVideo.youtubeId,
        watchTime: Math.round(watchTime)
      });
      setVideoCompleted(true);
      setProgress(prev => ({
        ...prev,
        completedVideos: [...(prev?.completedVideos || []), { youtubeId: currentVideo.youtubeId }]
      }));
      toast.success('+50 XP earned! 🎉', { icon: '⚡' });
    } catch {}
    // Show quiz
    setShowQuiz(true);
  };

  const goToVideo = (index) => {
    if (index < 0 || index >= (course?.videos?.length || 0)) return;
    setCurrentIndex(index);
    setVideoCompleted(false);
    setShowQuiz(false);
    setPlaying(true);
    setWatchTime(0);
  };

  if (loading) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        width: 48, height: 48, border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>Loading your lesson...</p>
    </div>
  );

  if (!course || !currentVideo) return null;

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', overflow: 'hidden'
    }}>
      {/* Top bar */}
      {!focusMode && (
        <div style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', borderBottom: '1px solid var(--border)',
          background: 'rgba(14,14,26,0.95)', backdropFilter: 'blur(20px)',
          flexShrink: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate(`/courses/${courseId}`)} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13
            }}>
              <ChevronLeft size={14} /> Back
            </button>
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={14} color="var(--accent)" />
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
                maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {course.title}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Progress indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {progress?.completedVideos?.length || 0}/{course.videos.length}
              </span>
              <div style={{ width: 80, height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${((progress?.completedVideos?.length || 0) / course.videos.length) * 100}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-2))'
                }} />
              </div>
            </div>

            <button onClick={() => setFocusMode(true)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
              borderRadius: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
              color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600
            }}>
              <Maximize size={12} /> Focus Mode
            </button>

            <button onClick={() => setShowPlaylist(p => !p)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
              borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)'
            }}>
              <List size={14} /> Playlist
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Video area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Player */}
          <div style={{
            flex: 1, background: '#000', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
              playing={playing}
              controls={true}
              width="100%"
              height="100%"
              onEnded={handleVideoEnd}
              onProgress={handleProgress}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    disablekb: 0,
                    fs: 1
                  }
                }
              }}
            />
            {focusMode && (
              <button onClick={() => setFocusMode(false)} style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                padding: '8px 14px', borderRadius: 8,
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font-display)', fontWeight: 600
              }}>
                <Minimize size={12} /> Exit Focus
              </button>
            )}
          </div>

          {/* Video info bar */}
          {!focusMode && (
            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border)',
              background: 'var(--bg-secondary)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {isCompleted && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                      borderRadius: 10, background: 'rgba(0,214,143,0.12)',
                      color: 'var(--accent-green)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-display)'
                    }}>
                      <CheckCircle size={10} /> Completed
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {currentIndex + 1} / {course.videos.length}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {currentVideo.title}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <button onClick={() => goToVideo(currentIndex - 1)} disabled={currentIndex === 0} style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px',
                  borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'var(--font-body)'
                }}>
                  <ChevronLeft size={14} /> Prev
                </button>

                <button onClick={() => goToVideo(currentIndex + 1)}
                  disabled={currentIndex === course.videos.length - 1} style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px',
                    borderRadius: 8, background: 'var(--accent)', border: 'none',
                    color: 'white', cursor: currentIndex === course.videos.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === course.videos.length - 1 ? 0.5 : 1,
                    fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600
                  }}>
                  Next <ChevronRight size={14} />
                </button>

                <button onClick={() => setShowQuiz(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,229,255,0.1))',
                  border: '1px solid rgba(108,99,255,0.3)',
                  color: 'var(--accent)', cursor: 'pointer', fontSize: 13,
                  fontFamily: 'var(--font-display)', fontWeight: 600
                }}>
                  <Brain size={14} /> Take Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Playlist sidebar */}
        {showPlaylist && !focusMode && (
          <div style={{
            width: 320, borderLeft: '1px solid var(--border)',
            background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', flexShrink: 0
          }}>
            <div style={{
              padding: '16px 18px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                Playlist
              </span>
              <button onClick={() => setShowPlaylist(false)} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {course.videos.map((video, idx) => {
                const done = progress?.completedVideos?.some(v => v.youtubeId === video.youtubeId);
                const active = idx === currentIndex;
                return (
                  <div
                    key={video._id || idx}
                    onClick={() => goToVideo(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      cursor: 'pointer', transition: 'background 0.2s ease',
                      background: active ? 'rgba(108,99,255,0.12)' : 'transparent',
                      borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                      background: done ? 'rgba(0,214,143,0.12)' : active ? 'var(--accent)' : 'var(--bg-card)',
                      border: `1px solid ${done ? 'rgba(0,214,143,0.3)' : active ? 'var(--accent)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                      color: done ? 'var(--accent-green)' : active ? 'white' : 'var(--text-muted)'
                    }}>
                      {done ? <CheckCircle size={12} /> : active ? <Play size={10} style={{ marginLeft: 1 }} /> : idx + 1}
                    </div>

                    {video.thumbnail && (
                      <img src={video.thumbnail} alt="" style={{
                        width: 52, height: 30, objectFit: 'cover', borderRadius: 4, flexShrink: 0
                      }} />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12, fontWeight: active ? 600 : 400,
                        color: active ? 'var(--text-primary)' : done ? 'var(--text-muted)' : 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        lineHeight: 1.4, marginBottom: 2
                      }}>
                        {video.title}
                      </p>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {formatSeconds(video.duration || 0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          video={currentVideo}
          courseId={courseId}
          courseCategory={course.category}
          difficulty={course.difficulty}
          onClose={() => {
            setShowQuiz(false);
            if (currentIndex < course.videos.length - 1) {
              goToVideo(currentIndex + 1);
            }
          }}
          onComplete={(result) => {
            toast.success(`Quiz done! +${result.xpGained} XP`, { icon: '🧠' });
          }}
        />
      )}
    </div>
  );
}
