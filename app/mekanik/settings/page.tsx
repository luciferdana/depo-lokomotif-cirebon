'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'

// Icons
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
)

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20, color: '#64748b' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
)

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20, color: '#64748b' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
)

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20, color: '#64748b' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
)

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20, color: '#64748b' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
)

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
)

const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
)

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
)

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
)

export default function SettingsPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState('profil')
    const [notifPush, setNotifPush] = useState(true)
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

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
                        <h1>Settings</h1>
                        <p>Kelola pengaturan akun dan preferensi dashboard Anda</p>
                    </div>
                </header>

                <div className="content-body">
                    <div className="section-card">
                        {/* Tabs */}
                        <div className="settings-tabs">
                            <div
                                className={`settings-tab ${activeTab === 'profil' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profil')}
                            >
                                Profil Saya
                            </div>
                            <div
                                className={`settings-tab ${activeTab === 'preferensi' ? 'active' : ''}`}
                                onClick={() => setActiveTab('preferensi')}
                            >
                                Preferensi
                            </div>
                            <div
                                className={`settings-tab ${activeTab === 'keamanan' ? 'active' : ''}`}
                                onClick={() => setActiveTab('keamanan')}
                            >
                                Keamanan
                            </div>
                        </div>

                        {/* Profil Tab */}
                        {activeTab === 'profil' && (
                            <>
                                <div className="profile-card">
                                    <div className="profile-avatar">
                                        <UserIcon />
                                    </div>
                                    <div className="profile-info">
                                        <h3>{user.name}</h3>
                                        <p>{user.role}</p>
                                        <p>ID Karyawan: {user.id || 'MKN-001'}</p>
                                    </div>
                                    <button className="btn btn-primary" style={{ marginLeft: 'auto' }}>Edit Profil</button>
                                </div>

                                <div className="profile-grid">
                                    <div className="profile-item">
                                        <MailIcon />
                                        <div>
                                            <p className="profile-item-label">Email</p>
                                            <p className="profile-item-value">{user.username}@depolokomotif.co.id</p>
                                        </div>
                                    </div>
                                    <div className="profile-item">
                                        <PhoneIcon />
                                        <div>
                                            <p className="profile-item-label">Telepon</p>
                                            <p className="profile-item-value">+62 812-3456-7890</p>
                                        </div>
                                    </div>
                                    <div className="profile-item">
                                        <LocationIcon />
                                        <div>
                                            <p className="profile-item-label">Lokasi</p>
                                            <p className="profile-item-value">Depo Lokomotif Cirebon</p>
                                        </div>
                                    </div>
                                    <div className="profile-item">
                                        <BuildingIcon />
                                        <div>
                                            <p className="profile-item-label">Departemen</p>
                                            <p className="profile-item-value">Divisi Perawatan</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-section">
                                    <h3 className="settings-section-title">Informasi Tambahan</h3>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Tanggal Bergabung</h4>
                                            <p>15 Januari 2020</p>
                                        </div>
                                    </div>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Status Akun</h4>
                                            <p>Aktif</p>
                                        </div>
                                        <span className="badge badge-green">Verified</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Preferensi Tab */}
                        {activeTab === 'preferensi' && (
                            <>
                                <div className="settings-section">
                                    <h3 className="settings-section-title">
                                        <BellIcon /> Notifikasi
                                    </h3>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Notifikasi Push</h4>
                                            <p>Terima notifikasi untuk update checksheet</p>
                                        </div>
                                        <div
                                            className={`toggle ${notifPush ? 'active' : ''}`}
                                            onClick={() => setNotifPush(!notifPush)}
                                        ></div>
                                    </div>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Email Alerts</h4>
                                            <p>Terima email untuk update penting</p>
                                        </div>
                                        <div
                                            className={`toggle ${emailAlerts ? 'active' : ''}`}
                                            onClick={() => setEmailAlerts(!emailAlerts)}
                                        ></div>
                                    </div>
                                </div>

                                <div className="settings-section">
                                    <h3 className="settings-section-title">
                                        <PaletteIcon /> Tampilan
                                    </h3>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Mode Gelap</h4>
                                            <p>Gunakan tema gelap untuk dashboard</p>
                                        </div>
                                        <div
                                            className={`toggle ${darkMode ? 'active' : ''}`}
                                            onClick={() => setDarkMode(!darkMode)}
                                        ></div>
                                    </div>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Bahasa</h4>
                                            <p>Pilih bahasa untuk dashboard</p>
                                        </div>
                                        <select style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                            <option>Bahasa Indonesia</option>
                                            <option>English</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Keamanan Tab */}
                        {activeTab === 'keamanan' && (
                            <>
                                <div className="settings-section">
                                    <h3 className="settings-section-title">
                                        <LockIcon /> Password
                                    </h3>
                                    <div className="form-group">
                                        <label style={{ textAlign: 'left' }}>Password Saat Ini</label>
                                        <input type="password" placeholder="Masukkan password saat ini" />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ textAlign: 'left' }}>Password Baru</label>
                                        <input type="password" placeholder="Masukkan password baru" />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ textAlign: 'left' }}>Konfirmasi Password Baru</label>
                                        <input type="password" placeholder="Konfirmasi password baru" />
                                    </div>
                                    <button className="btn btn-primary">Update Password</button>
                                </div>

                                <div className="settings-section" style={{ marginTop: '2rem' }}>
                                    <h3 className="settings-section-title">
                                        <ShieldIcon /> Keamanan Akun
                                    </h3>
                                    <div className="settings-row">
                                        <div className="settings-row-left">
                                            <h4>Two-Factor Authentication</h4>
                                            <p>Tambahkan lapisan keamanan ekstra</p>
                                        </div>
                                        <div className="toggle"></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
