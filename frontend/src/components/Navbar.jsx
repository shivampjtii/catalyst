import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Home, Search, Plus, LogOut, Zap, Menu, X } from 'lucide-react';

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: 64,
    borderBottom: '1px solid var(--border)',
    transition: 'all 0.3s ease'
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
    color: 'var(--text-primary)', letterSpacing: '-0.5px'
  },
  logoIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 16px var(--accent-glow)'
  },
  navLinks: {
    display: 'flex', alignItems: 'center', gap: 4
  },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
    transition: 'all 0.2s ease', textDecoration: 'none'
  },
  navLinkActive: {
    color: 'var(--text-primary)', background: 'rgba(108, 99, 255, 0.12)'
  },
  xpBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 20,
    background: 'rgba(108, 99, 255, 0.12)',
    border: '1px solid rgba(108, 99, 255, 0.2)',
    color: 'var(--accent)', fontSize: 13, fontWeight: 600,
    fontFamily: 'var(--font-display)'
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
    color: 'white', border: '2px solid var(--border)', cursor: 'pointer'
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 'var(--radius-sm)',
    background: 'transparent', color: 'var(--text-muted)',
    fontSize: 14, fontWeight: 500, transition: 'all 0.2s ease',
    fontFamily: 'var(--font-body)'
  }
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const links = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/courses', icon: Search, label: 'Explore' },
    { to: '/add-course', icon: Plus, label: 'Add Course' },
  ];

  return (
    <nav style={{
      ...styles.nav,
      background: scrolled ? 'rgba(7, 7, 13, 0.95)' : 'rgba(7, 7, 13, 0.8)',
      backdropFilter: 'blur(20px)'
    }}>
      <Link to="/dashboard" style={styles.logo}>
        <div style={styles.logoIcon}>
          <BookOpen size={16} color="white" />
        </div>
        Catalyst
      </Link>

      <div style={styles.navLinks}>
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} style={{
            ...styles.navLink,
            ...(isActive(to) ? styles.navLinkActive : {})
          }}>
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user && (
          <div style={styles.xpBadge}>
            <Zap size={13} />
            {user.xp || 0} XP
          </div>
        )}
        {user && (
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <button
          style={styles.logoutBtn}
          onClick={() => { logout(); navigate('/'); }}
          onMouseEnter={e => e.target.style.color = 'var(--accent-3)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          <LogOut size={15} />
        </button>
      </div>
    </nav>
  );
}
