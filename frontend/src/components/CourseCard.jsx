import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, ChevronRight, Code, Brain, Database, Globe, Cpu, Layers } from 'lucide-react';

const categoryIcons = {
  'Web Development': Globe,
  'DSA': Layers,
  'AI/ML': Brain,
  'Python': Code,
  'JavaScript': Code,
  'System Design': Database,
  'DevOps': Cpu,
  'Database': Database,
  'Mobile Dev': Globe,
  'Other': Code
};

const categoryColors = {
  'Web Development': '#6c63ff',
  'DSA': '#00e5ff',
  'AI/ML': '#ff6584',
  'Python': '#ffd93d',
  'JavaScript': '#f7df1e',
  'System Design': '#00d68f',
  'DevOps': '#ff9a3c',
  'Database': '#c084fc',
  'Mobile Dev': '#60efff',
  'Other': '#8888a8'
};

const difficultyColors = {
  Beginner: 'var(--accent-green)',
  Intermediate: '#ffd93d',
  Advanced: 'var(--accent-3)'
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function CourseCard({ course, progress }) {
  const navigate = useNavigate();
  const Icon = categoryIcons[course.category] || Code;
  const color = categoryColors[course.category] || '#6c63ff';
  const progressVal = progress?.overallProgress || 0;

  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 160, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${color}20, ${color}05)`
      }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
        ) : (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${color}15, transparent)`
          }}>
            <Icon size={48} color={color} style={{ opacity: 0.5 }} />
          </div>
        )}
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 20,
          background: 'rgba(7,7,13,0.85)', backdropFilter: 'blur(10px)',
          border: `1px solid ${color}30`
        }}>
          <Icon size={11} color={color} />
          <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            {course.category}
          </span>
        </div>
        {/* Difficulty */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 20,
          background: 'rgba(7,7,13,0.85)', backdropFilter: 'blur(10px)',
          fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-display)',
          color: difficultyColors[course.difficulty] || '#fff',
          border: `1px solid ${difficultyColors[course.difficulty] || '#fff'}30`
        }}>
          {course.difficulty}
        </div>
      </div>

      {/* Progress bar */}
      {progressVal > 0 && (
        <div style={{ height: 3, background: 'var(--bg-secondary)' }}>
          <div style={{
            height: '100%', width: `${progressVal}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            transition: 'width 1s ease'
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {course.title}
        </h3>

        <p style={{
          fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5
        }}>
          {course.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <Clock size={11} /> {formatDuration(course.totalDuration || 0)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <Users size={11} /> {course.enrolledCount || 0}
            </span>
          </div>
          {progressVal > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
              {progressVal}%
            </span>
          )}
        </div>

        {/* Instructor */}
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            by <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{course.instructor}</span>
          </span>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );
}
