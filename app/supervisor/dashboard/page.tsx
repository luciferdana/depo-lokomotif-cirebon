'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// Icons
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
)

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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

const performanceData = [
    { name: 'Ahmad F.', value: 11 },
    { name: 'Budi S.', value: 10 },
    { name: 'Candra W.', value: 8 },
    { name: 'Dedi K.', value: 9 },
    { name: 'Eko P.', value: 7 },
]

const checksheetData = [
    { id: 'CHK-001', lokomotif: 'CC201-145', mekanik: 'Ahmad Fauzi', status: 'selesai', progress: 100, prioritas: 'Normal' },
    { id: 'CHK-002', lokomotif: 'CC203-078', mekanik: 'Budi Santoso', status: 'progress', progress: 65, prioritas: 'Tinggi' },
    { id: 'CHK-003', lokomotif: 'CC204-023', mekanik: 'Candra Wijaya', status: 'selesai', progress: 100, prioritas: 'Normal' },
    { id: 'CHK-004', lokomotif: 'CC201-156', mekanik: 'Dedi Kurniawan', status: 'pending', progress: 30, prioritas: 'Rendah' },
    { id: 'CHK-005', lokomotif: 'CC203-092', mekanik: 'Eko Prasetyo', status: 'bermasalah', progress: 45, prioritas: 'Urgent' },
    { id: 'CHK-006', lokomotif: 'CC204-067', mekanik: 'Fajar Hidayat', status: 'progress', progress: 80, prioritas: 'Tinggi' },
]

export default function SupervisorDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const session = getSession()
        if (!session || session.roleType !== 'supervisor') {
            router.push('/login/supervisor')
            return
        }
        setUser(session)
    }, [router])

    if (!user) {
        return <div>Loading...</div>
    }

    const statusColors: Record<string, string> = {
        selesai: 'badge-green',
        progress: 'badge-blue',
        pending: 'badge-orange',
        bermasalah: 'badge-red'
    }

    const statusLabels: Record<string, string> = {
        selesai: 'Selesai',
        progress: 'Progress',
        pending: 'Pending',
        bermasalah: 'Bermasalah'
    }

    const prioritasColors: Record<string, string> = {
        Normal: '#64748b',
        Tinggi: '#f59e0b',
        Rendah: '#22c55e',
        Urgent: '#ef4444'
    }

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Supervisor Dashboard" />

            <main className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <h1>Dashboard Supervisor</h1>
                        <p>Monitor dan kelola checksheet fasilitas yang sedang berjalan</p>
                    </div>
                    <div className="content-header-right">
                        <span className="breadcrumb">Dashboard</span>
                        <button className="btn btn-primary">Tambah Checksheet</button>
                    </div>
                </header>

                <div className="content-body">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Checksheet Aktif</p>
                                <p className="stat-card-value">38</p>
                            </div>
                            <div className="stat-card-icon blue">
                                <DocumentIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Perlu Perhatian</p>
                                <p className="stat-card-value">8</p>
                            </div>
                            <div className="stat-card-icon red">
                                <WarningIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Mekanik Aktif</p>
                                <p className="stat-card-value">15</p>
                            </div>
                            <div className="stat-card-icon green">
                                <UsersIcon />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p className="stat-card-label">Rata-rata Progress</p>
                                <p className="stat-card-value">68.5%</p>
                            </div>
                            <div className="stat-card-icon purple">
                                <ChartIcon />
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="section-card">
                        <h3 className="section-card-title">Performa Mekanik (Bulan Ini)</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Checksheet Table */}
                    <div className="section-card">
                        <h3 className="section-card-title">Daftar Checksheet</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Lokomotif</th>
                                        <th>Mekanik</th>
                                        <th>Status</th>
                                        <th>Progress</th>
                                        <th>Prioritas</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checksheetData.map((cs) => (
                                        <tr key={cs.id}>
                                            <td>{cs.id}</td>
                                            <td>{cs.lokomotif}</td>
                                            <td>{cs.mekanik}</td>
                                            <td>
                                                <span className={`badge ${statusColors[cs.status]}`}>
                                                    {statusLabels[cs.status]}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div className="progress-bar" style={{ width: '80px', marginBottom: 0 }}>
                                                        <div className="progress-bar-fill blue" style={{ width: `${cs.progress}%` }}></div>
                                                    </div>
                                                    <span>{cs.progress}%</span>
                                                </div>
                                            </td>
                                            <td style={{ color: prioritasColors[cs.prioritas] }}>{cs.prioritas}</td>
                                            <td>
                                                <a href="#" className="link">Lihat Detail</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
