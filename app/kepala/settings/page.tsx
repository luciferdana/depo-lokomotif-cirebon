'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'

export default function KepalaSettingsPage() {
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
                        <h1>Settings</h1>
                        <p>Kelola pengaturan akun Anda</p>
                    </div>
                </header>

                <div className="content-body">
                    <div className="section-card">
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 40, height: 40 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <div className="profile-info">
                                <h3>{user.name}</h3>
                                <p>{user.role}</p>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3 className="settings-section-title">Informasi Profil</h3>
                            <div className="settings-row">
                                <div className="settings-row-left">
                                    <h4>Email</h4>
                                    <p>{user.username}@depolokomotif.co.id</p>
                                </div>
                            </div>
                            <div className="settings-row">
                                <div className="settings-row-left">
                                    <h4>Departemen</h4>
                                    <p>Divisi Manajemen</p>
                                </div>
                            </div>
                            <div className="settings-row">
                                <div className="settings-row-left">
                                    <h4>Lokasi</h4>
                                    <p>Depo Lokomotif Cirebon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
