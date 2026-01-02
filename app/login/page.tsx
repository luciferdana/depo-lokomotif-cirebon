'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()

    const roles = [
        { id: 'kepala', name: 'Kepala Lokomotif', subtitle: 'KAI Cirebon' },
        { id: 'supervisor', name: 'Supervisor', subtitle: 'Pengawas Fasilitas' },
        { id: 'mekanik', name: 'Mekanik', subtitle: 'Teknisi Lapangan' },
    ]

    return (
        <div className="login-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">DEPO LOKOMOTIF CIREBON</div>
                <span className="btn btn-primary">Log In</span>
            </nav>

            {/* Role Selection */}
            <div className="login-content">
                <h1 className="login-title">Pilih Role Anda</h1>
                <p className="login-subtitle">Silakan pilih role untuk melanjutkan</p>

                <div className="role-cards">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="role-card"
                            onClick={() => router.push(`/login/${role.id}`)}
                        >
                            <h3>{role.name}</h3>
                            <p>{role.subtitle}</p>
                        </div>
                    ))}
                </div>

                <Link href="/" className="back-link">Kembali</Link>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p className="footer-text">DEPO LOKOMOTIF CIREBON</p>
            </footer>
        </div>
    )
}
