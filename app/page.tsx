'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpeg" alt="KAI Logo" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />
          <span className="navbar-logo">DEPO LOKOMOTIF CIREBON</span>
        </div>
        <Link href="/login" className="btn btn-primary">Log In</Link>
      </nav>

      {/* Hero Section with Image */}
      <section style={{
        position: 'relative',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img
          src="/landing1.jpeg"
          alt="Depo Lokomotif"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5)'
          }}
        />
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white'
        }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Checksheet Fasilitas</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>DEPO LOKOMOTIF CIREBON</h1>
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Masuk</Link>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>Sistem Monitoring dan Perawatan Lokomotif</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Fitur Unggulan</h2>
        <p className="section-subtitle">Kemudahan dalam Pengelolaan Checksheet Fasilitas</p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Digital Checksheet</h3>
            <p>Kelola checksheet pemeriksaan fasilitas dengan mudah dan terorganisir secara digital</p>
          </div>
          <div className="feature-card">
            <h3>Monitoring Real-time</h3>
            <p>Pantau progress pemeriksaan dan perawatan lokomotif secara real-time</p>
          </div>
          <div className="feature-card">
            <h3>Laporan Lengkap</h3>
            <p>Akses laporan dan statistik pemeriksaan dalam satu dashboard terpadu</p>
          </div>
        </div>
      </section>

      {/* Second Image Section */}
      <section style={{
        position: 'relative',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img
          src="/landing2.jpeg"
          alt="Lokomotif"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)'
          }}
        />
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white',
          maxWidth: '600px',
          padding: '0 2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Keandalan & Keamanan</h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.95 }}>
            Menjaga keandalan dan keamanan setiap lokomotif melalui pemeriksaan rutin dan terdokumentasi
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <p className="about-label">Tentang Kami</p>
        <h2 className="about-title">Depo Lokomotif Cirebon</h2>
        <p>
          Depo Lokomotif Cirebon merupakan salah satu fasilitas pemeliharaan dan perawatan lokomotif yang
          beroperasi di bawah PT Kereta Api Indonesia (Persero). Berlokasi strategis di Kota Cirebon, depo ini memiliki
          peran vital dalam menjaga kelancaran operasional kereta api di wilayah Jawa Barat dan sekitarnya.
        </p>
        <p>
          Saat ini, Depo Lokomotif Cirebon mengelola dan merawat berbagai jenis lokomotif yang digunakan untuk
          keperluan operasional kereta api di Indonesia. Setiap lokomotif mendapatkan perawatan berkala dan
          pemeriksaan menyeluruh untuk memastikan keamanan, keandalan, dan kenyamanan dalam setiap
          perjalanan kereta api.
        </p>
      </section>

      {/* CTA Button */}
      <section style={{ padding: '2rem', background: 'white' }}>
        <Link href="/login" className="btn btn-primary btn-full" style={{ maxWidth: '600px', margin: '0 auto', display: 'block', textAlign: 'center' }}>
          Masuk ke Sistem
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpeg" alt="KAI Logo" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }} />
          <p className="footer-text">DEPO LOKOMOTIF CIREBON</p>
        </div>
      </footer>
    </div>
  )
}
