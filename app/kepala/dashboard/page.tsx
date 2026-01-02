'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, ResponsiveContainer, Tooltip, Legend
} from 'recharts'

// Icons
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

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
)

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
)

const pieData = [
    { name: 'Selesai', value: 68, color: '#3b82f6' },
    { name: 'Progress', value: 18, color: '#f59e0b' },
    { name: 'Pending', value: 10, color: '#fb923c' },
    { name: 'Bermasalah', value: 4, color: '#ef4444' },
]

const performanceData = [
    { month: 'Jan', value: 4200 },
    { month: 'Feb', value: 3800 },
    { month: 'Mar', value: 5200 },
    { month: 'Apr', value: 4800 },
    { month: 'Mei', value: 6200 },
    { month: 'Jun', value: 7500 },
    { month: 'Jul', value: 8000 },
]

const revenueData = [
    { month: 'Jan', value: 3200 },
    { month: 'Feb', value: 2800 },
    { month: 'Mar', value: 3500 },
    { month: 'Apr', value: 3200 },
    { month: 'Mei', value: 4000 },
    { month: 'Jun', value: 3800 },
    { month: 'Jul', value: 4200 },
]

const monthlyData = [
    { month: 'Jan', value: 6000 },
    { month: 'Feb', value: 4500 },
    { month: 'Mar', value: 5000 },
    { month: 'Apr', value: 5500 },
    { month: 'Mei', value: 6000 },
    { month: 'Jun', value: 7000 },
    { month: 'Jul', value: 7500 },
]

const activityData = [
    { initials: 'AF', name: 'Ahmad Fauzi', checksheet: 'CC201-145', status: 'selesai', time: '2 jam lalu' },
    { initials: 'BS', name: 'Budi Santoso', checksheet: 'CC203-078', status: 'progress', time: '3 jam lalu' },
]

export default function KepalaDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const session = getSession()
        if (!session || session.roleType !== 'kepala') {
            router.push('/login/kepala')
            return
        }
        setUser(session)
    }, [router])

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Kepala Dashboard" />

            <main className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <h1>Selamat Datang, Kepala Lokomotif</h1>
                        <p>Ringkasan keseluruhan checksheet fasilitas dan performa tim</p>
                    </div>
                    <div className="content-header-right">
                        <span className="breadcrumb">Dashboard</span>
                    </div>
                </header>

                <div className="content-body">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Total Selesai</p>
                                <p className="stat-card-value">145</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="stat-card-indicator">+8.2%</p>
                                <div className="stat-card-icon green" style={{ marginTop: '0.5rem' }}>
                                    <CheckIcon />
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Dalam Progress</p>
                                <p className="stat-card-value">38</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="badge badge-green">Aktif</span>
                                <div className="stat-card-icon blue" style={{ marginTop: '0.5rem' }}>
                                    <ClockIcon />
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Total Mekanik</p>
                                <p className="stat-card-value">18</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>15 Aktif</span>
                                <div className="stat-card-icon green" style={{ marginTop: '0.5rem' }}>
                                    <UsersIcon />
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Tingkat Efisiensi</p>
                                <p className="stat-card-value">95.2%</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="stat-card-indicator">+5.1%</p>
                                <div className="stat-card-icon purple" style={{ marginTop: '0.5rem' }}>
                                    <ChartIcon />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid-2">
                        <div className="section-card">
                            <h3 className="section-card-title">Distribusi Status Checksheet</h3>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            dataKey="value"
                                            label={({ name, value }) => `${name} ${value}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                                    Selesai: 145
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                                    Progress: 38
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                                    Pending: 22
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                                    Bermasalah: 8
                                </span>
                            </div>
                        </div>

                        <div className="section-card">
                            <h3 className="section-card-title">Performance Trend</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid-2">
                        <div className="section-card">
                            <h3 className="section-card-title">Revenue Growth</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#ede9fe" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="section-card">
                            <h3 className="section-card-title">Monthly Comparison</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="section-card">
                        <h3 className="section-card-title">Aktivitas Terbaru</h3>
                        <div className="activity-list">
                            {activityData.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-avatar">{activity.initials}</div>
                                    <div className="activity-info">
                                        <p className="activity-name">{activity.name}</p>
                                        <p className="activity-desc">Checksheet {activity.checksheet}</p>
                                    </div>
                                    <div className="activity-meta">
                                        <span className={`badge ${activity.status === 'selesai' ? 'badge-green' : 'badge-blue'}`}>
                                            {activity.status === 'selesai' ? 'Selesai' : 'Progress'}
                                        </span>
                                        <p className="activity-time">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
