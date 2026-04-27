import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'DSA', 'AI/ML', 'Python', 'JavaScript', 'System Design', 'DevOps', 'Database', 'Mobile Dev'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchCourses();
  }, [debouncedSearch, category, difficulty]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (debouncedSearch) params.search = debouncedSearch;
      const { data } = await axios.get('https://catalyst-sqb7.onrender.com/api/courses', { params });
      setCourses(data.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chipStyle = (active) => ({
    padding: '7px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 600, border: 'none',
    background: active ? 'var(--accent)' : 'var(--bg-card)',
    color: active ? 'white' : 'var(--text-secondary)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    transition: 'all 0.2s ease',
    boxShadow: active ? '0 0 16px var(--accent-glow)' : 'none'
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 36, animation: 'fadeUp 0.4s ease' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            letterSpacing: '-1px', marginBottom: 8
          }}>
            Explore Courses
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Curated tech playlists to master your skills
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24, animation: 'fadeUp 0.5s ease' }}>
          <Search size={16} color="var(--text-muted)" style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)'
          }} />
          <input
            type="text" placeholder="Search courses, topics, instructors..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px 14px 44px',
              borderRadius: 'var(--radius-md)', background: 'var(--bg-card)',
              border: '1px solid var(--border)', color: 'var(--text-primary)',
              fontSize: 15, fontFamily: 'var(--font-body)', outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
            }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.55s ease' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={chipStyle(category === c)}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{
                ...chipStyle(difficulty === d),
                background: difficulty === d
                  ? d === 'Beginner' ? 'var(--accent-green)'
                    : d === 'Intermediate' ? '#ffd93d'
                      : d === 'Advanced' ? 'var(--accent-3)' : 'var(--accent)'
                  : 'var(--bg-card)',
                borderColor: difficulty === d
                  ? d === 'Beginner' ? 'var(--accent-green)'
                    : d === 'Intermediate' ? '#ffd93d'
                      : d === 'Advanced' ? 'var(--accent-3)' : 'var(--accent)'
                  : 'var(--border)',
                boxShadow: 'none'
              }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--text-secondary)' }}>
              No courses found
            </h3>
            <p style={{ fontSize: 14 }}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
              {courses.length} course{courses.length !== 1 ? 's' : ''} found
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20, animation: 'fadeUp 0.6s ease'
            }}>
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
