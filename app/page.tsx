'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">DEPO LOKOMOTIF CIREBON</div>
        <Link href="/login" className="btn btn-primary">Log In</Link>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <p className="hero-subtitle">Checksheet Fasilitas</p>
        <h1 className="hero-title">DEPO LOKOMOTIF CIREBON</h1>
        <Link href="/login" className="btn btn-primary">Masuk</Link>
        <p className="hero-description">Sistem Monitoring dan Perawatan Lokomotif</p>
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
        <p className="footer-text">DEPO LOKOMOTIF CIREBON</p>
      </footer>
    </div>
  )
}
