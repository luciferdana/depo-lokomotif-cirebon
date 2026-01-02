'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { authenticateUser, saveSession, DEMO_USERS, UserRole } from '@/lib/auth'

const roleNames: Record<string, string> = {
    kepala: 'Kepala Lokomotif',
    supervisor: 'Supervisor',
    mekanik: 'Mekanik'
}

const roleDashboards: Record<string, string> = {
    kepala: '/kepala/dashboard',
    supervisor: '/supervisor/dashboard',
    mekanik: '/mekanik/dashboard'
}

export default function LoginFormPage() {
    const router = useRouter()
    const params = useParams()
    const role = params.role as UserRole

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const roleName = roleNames[role] || 'User'
    const demoUsers = DEMO_USERS[role] || []

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const user = authenticateUser(role, username, password)

        if (user) {
            saveSession(user)
            router.push(roleDashboards[role])
        } else {
            setError('Username atau password salah')
        }
    }

    return (
        <div className="login-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">DEPO LOKOMOTIF CIREBON</div>
                <span className="btn btn-primary">Log In</span>
            </nav>

            {/* Login Form */}
            <div className="login-content">
                <h1 className="login-title">Login {roleName}</h1>
                <p className="login-subtitle">Masukkan username dan password Anda</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-alert">{error}</div>}

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                        Masuk
                    </button>
                </form>

                <Link href="/login" className="back-link">Kembali</Link>

                {/* Demo Account Box */}
                <div className="demo-box">
                    <h4>Akun demo untuk testing:</h4>
                    <ul>
                        {demoUsers.map((user: any, index: number) => (
                            <li key={index}>• {user.username} / {user.password}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p className="footer-text">DEPO LOKOMOTIF CIREBON</p>
            </footer>
        </div>
    )
}
