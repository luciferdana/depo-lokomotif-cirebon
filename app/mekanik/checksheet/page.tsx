'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'
import equipmentList from '@/data/equipment-list.json'

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20, color: '#94a3b8' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
)

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
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
}

export default function ChecksheetPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [checksheets, setChecksheets] = useState<Checksheet[]>([])

    // Form state
    const [selectedEquipment, setSelectedEquipment] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('')

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
            setChecksheets(JSON.parse(savedChecksheets))
        }
    }, [router])

    const handleCreateChecksheet = () => {
        if (!selectedEquipment || !selectedTemplate) return

        const equipment = equipmentList.find(eq => eq.id === selectedEquipment)
        if (!equipment) return

        const newChecksheet: Checksheet = {
            id: `CHK-${Date.now()}`,
            equipmentId: selectedEquipment,
            equipmentName: equipment.name,
            template: selectedTemplate,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            status: 'progress',
            progress: 0,
            description: 'Sedang dalam pemeriksaan rutin'
        }

        const updatedChecksheets = [...checksheets, newChecksheet]
        setChecksheets(updatedChecksheets)
        localStorage.setItem('depo_checksheets', JSON.stringify(updatedChecksheets))

        setShowModal(false)
        setSelectedEquipment('')
        setSelectedTemplate('')
    }

    const getSelectedEquipmentSheets = () => {
        if (!selectedEquipment) return []
        const equipment = equipmentList.find(eq => eq.id === selectedEquipment)
        return equipment?.sheets || []
    }

    if (!user) {
        return <div>Loading...</div>
    }

    const statusLabels: Record<string, string> = {
        progress: 'Dalam Progress',
        selesai: 'Selesai',
        pending: 'Pending'
    }

    const statusColors: Record<string, string> = {
        progress: 'badge-orange',
        selesai: 'badge-green',
        pending: 'badge-blue'
    }

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Mechanic Dashboard" />

            <main className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <h1>Checksheet</h1>
                        <p>Kelola dan pantau seluruh checksheet fasilitas</p>
                    </div>
                    <div className="content-header-right">
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            + Buat Checksheet
                        </button>
                    </div>
                </header>

                <div className="content-body">
                    {/* Search and Filter */}
                    <div className="search-filter-bar">
                        <div className="search-input">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Cari Checksheet"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-dropdown">
                            <FilterIcon />
                            <select
                                style={{ border: 'none', background: 'none', fontSize: '0.875rem' }}
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="progress">Dalam Progress</option>
                                <option value="selesai">Selesai</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* Checksheet List */}
                    {checksheets.length === 0 ? (
                        <div className="section-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: '#64748b' }}>Belum ada checksheet. Klik "Buat Checksheet" untuk memulai.</p>
                        </div>
                    ) : (
                        checksheets.map((cs) => (
                            <div key={cs.id} className="checksheet-card">
                                <div className="checksheet-header">
                                    <div>
                                        <span className="checksheet-title">{cs.equipmentName}</span>
                                        <span className="checksheet-id">#{cs.id}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className={`badge ${statusColors[cs.status]}`}>
                                            {statusLabels[cs.status]}
                                        </span>
                                        <span className="checksheet-time">2 jam lalu</span>
                                    </div>
                                </div>
                                <div className="checksheet-meta">
                                    <span>Template: {cs.template}</span>
                                    <span>•</span>
                                    <span>{cs.date}</span>
                                </div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.875rem' }}>Progress</span>
                                        <span style={{ fontSize: '0.875rem' }}>{cs.progress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill blue" style={{ width: `${cs.progress}%` }}></div>
                                    </div>
                                </div>
                                <p className="checksheet-desc">{cs.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Buat Checksheet Baru</h2>

                        <div className="form-group">
                            <label style={{ textAlign: 'left' }}>Pilih Equipment</label>
                            <select
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}
                                value={selectedEquipment}
                                onChange={(e) => {
                                    setSelectedEquipment(e.target.value)
                                    setSelectedTemplate('')
                                }}
                            >
                                <option value="">-- Pilih Equipment --</option>
                                {equipmentList.map(eq => (
                                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ textAlign: 'left' }}>Pilih Template</label>
                            <select
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                disabled={!selectedEquipment}
                            >
                                <option value="">-- Pilih Template --</option>
                                {getSelectedEquipmentSheets().map((sheet: string) => (
                                    <option key={sheet} value={sheet}>{sheet}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleCreateChecksheet}
                                disabled={!selectedEquipment || !selectedTemplate}
                            >
                                Buat Checksheet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
