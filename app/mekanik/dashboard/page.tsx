'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'

// Icons
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
)

export default function MekanikDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const session = getSession()
        if (!session || session.roleType !== 'mekanik') {
            router.push('/login/mekanik')
            return
        }
        setUser(session)
    }, [router])

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Mechanic Dashboard" />

            <main className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <h1>Selamat Bekerja!</h1>
                        <p>Pantau progress checksheet dan pekerjaan Anda</p>
                    </div>
                    <div className="content-header-right">
                        <span className="breadcrumb">Dashboard</span>
                        <button className="btn btn-primary" onClick={() => router.push('/mekanik/checksheet')}>Buat Checksheet</button>
                    </div>
                </header>

                <div className="content-body">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Total Checksheet</p>
                                <p className="stat-card-value">0</p>
                            </div>
                            <div className="stat-card-icon blue">
                                <DocumentIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Selesai</p>
                                <p className="stat-card-value">0</p>
                            </div>
                            <div className="stat-card-icon green">
                                <CheckIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Dalam Proses</p>
                                <p className="stat-card-value">0</p>
                            </div>
                            <div className="stat-card-icon blue">
                                <ClockIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Dalam Perhatian</p>
                                <p className="stat-card-value">0</p>
                            </div>
                            <div className="stat-card-icon red">
                                <WarningIcon />
                            </div>
                        </div>
                    </div>

                    {/* Progress Checksheet */}
                    <div className="section-card">
                        <div className="section-card-header">
                            <h3 className="section-card-title">Progress Checksheet</h3>
                            <span className="section-card-value">0%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill orange" style={{ width: '0%' }}></div>
                        </div>
                        <p className="progress-text">0 dari 0</p>

                        <div className="mini-stats">
                            <div className="mini-stat">
                                <p className="mini-stat-value">0</p>
                                <p className="mini-stat-label">Selesai</p>
                            </div>
                            <div className="mini-stat">
                                <p className="mini-stat-value">0</p>
                                <p className="mini-stat-label">Progress</p>
                            </div>
                            <div className="mini-stat">
                                <p className="mini-stat-value">0</p>
                                <p className="mini-stat-label">Dalam Perhatian</p>
                            </div>
                        </div>
                    </div>

                    {/* Dalam Perbaikan */}
                    <div className="section-card">
                        <div className="section-card-header">
                            <h3 className="section-card-title">Dalam Perbaikan</h3>
                            <span className="section-card-value">0%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill orange" style={{ width: '0%' }}></div>
                        </div>
                        <p className="progress-text">0 dari 0</p>

                        <div className="mini-stats">
                            <div className="mini-stat">
                                <p className="mini-stat-value">0</p>
                                <p className="mini-stat-label">Selesai</p>
                            </div>
                            <div className="mini-stat">
                                <p className="mini-stat-value">0</p>
                                <p className="mini-stat-label">Progress</p>
                            </div>
                            <div className="mini-stat">
                                <p className="mini-stat-value">0</p>
                                <p className="mini-stat-label">Dalam Perhatian</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
