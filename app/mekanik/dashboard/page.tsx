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

interface Checksheet {
    id: string
    equipmentId: string
    equipmentName: string
    template: string
    date: string
    status: 'progress' | 'selesai' | 'pending'
    progress: number
    description: string
    items?: any[]
}

export default function MekanikDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [checksheets, setChecksheets] = useState<Checksheet[]>([])
    const [stats, setStats] = useState({
        total: 0,
        selesai: 0,
        progress: 0,
        perhatian: 0,
        avgProgress: 0
    })

    useEffect(() => {
        const session = getSession()
        if (!session || session.roleType !== 'mekanik') {
            router.push('/login/mekanik')
            return
        }
        setUser(session)

        // Load checksheets from localStorage
        const savedChecksheets = localStorage.getItem('depo_checksheets')
        if (savedChecksheets) {
            const data: Checksheet[] = JSON.parse(savedChecksheets)
            setChecksheets(data)

            // Calculate stats
            const total = data.length
            const selesai = data.filter(cs => cs.status === 'selesai' || cs.progress === 100).length
            const inProgress = data.filter(cs => cs.status === 'progress' && cs.progress < 100 && cs.progress > 0).length
            const perhatian = data.filter(cs => {
                // Check if any items have N.OK status
                if (cs.items) {
                    return cs.items.some((item: any) => item.status === 'nok')
                }
                return false
            }).length

            const avgProgress = total > 0
                ? Math.round(data.reduce((sum, cs) => sum + cs.progress, 0) / total)
                : 0

            setStats({ total, selesai, progress: inProgress, perhatian, avgProgress })
        }
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
                                <p className="stat-card-value">{stats.total}</p>
                            </div>
                            <div className="stat-card-icon blue">
                                <DocumentIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Selesai</p>
                                <p className="stat-card-value">{stats.selesai}</p>
                            </div>
                            <div className="stat-card-icon green">
                                <CheckIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Dalam Proses</p>
                                <p className="stat-card-value">{stats.progress}</p>
                            </div>
                            <div className="stat-card-icon blue">
                                <ClockIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Dalam Perhatian</p>
                                <p className="stat-card-value">{stats.perhatian}</p>
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
                            <span className="section-card-value">{stats.avgProgress}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className={`progress-bar-fill ${stats.avgProgress === 100 ? 'green' : 'orange'}`}
                                style={{ width: `${stats.avgProgress}%` }}
                            ></div>
                        </div>
                        <p className="progress-text">{stats.selesai} dari {stats.total} checksheet selesai</p>

                        <div className="mini-stats">
                            <div className="mini-stat">
                                <p className="mini-stat-value">{stats.selesai}</p>
                                <p className="mini-stat-label">Selesai</p>
                            </div>
                            <div className="mini-stat">
                                <p className="mini-stat-value">{stats.progress}</p>
                                <p className="mini-stat-label">Progress</p>
                            </div>
                            <div className="mini-stat">
                                <p className="mini-stat-value">{stats.perhatian}</p>
                                <p className="mini-stat-label">Dalam Perhatian</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Checksheets */}
                    <div className="section-card">
                        <div className="section-card-header">
                            <h3 className="section-card-title">Checksheet Terbaru</h3>
                            <a
                                href="/mekanik/checksheet"
                                className="link"
                                style={{ fontSize: '0.875rem' }}
                            >
                                Lihat Semua
                            </a>
                        </div>

                        {checksheets.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                                Belum ada checksheet. Klik "Buat Checksheet" untuk memulai.
                            </p>
                        ) : (
                            <div className="activity-list">
                                {checksheets.slice(0, 5).map((cs) => (
                                    <div
                                        key={cs.id}
                                        className="activity-item"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => router.push(`/mekanik/checksheet/${cs.id}`)}
                                    >
                                        <div className="activity-avatar">
                                            {cs.equipmentName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="activity-info">
                                            <p className="activity-name">{cs.equipmentName}</p>
                                            <p className="activity-desc">{cs.template} • {cs.date}</p>
                                        </div>
                                        <div className="activity-meta">
                                            <span className={`badge ${cs.progress === 100 ? 'badge-green' : 'badge-orange'}`}>
                                                {cs.progress}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
