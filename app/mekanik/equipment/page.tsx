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

const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
)

const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 16, height: 16 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
)

export default function EquipmentPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')

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

    const filteredEquipment = equipmentList.filter(eq => {
        const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === 'all' || eq.status.toLowerCase() === filter.toLowerCase()
        return matchesSearch && matchesFilter
    })

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Mechanic Dashboard" />

            <main className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <h1>Equipment</h1>
                        <p>Kelola seluruh equipment dan aset</p>
                    </div>
                    <div className="content-header-right">
                        <button className="btn btn-primary">Tambah Equipment</button>
                    </div>
                </header>

                <div className="content-body">
                    {/* Search and Filter */}
                    <div className="search-filter-bar">
                        <div className="search-input">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Cari Equipment"
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
                                <option value="aktif">Aktif</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    {/* Equipment Grid */}
                    <div className="equipment-grid">
                        {filteredEquipment.map((equipment) => (
                            <div key={equipment.id} className="equipment-card">
                                <div className="equipment-card-header">
                                    <div className="equipment-icon">
                                        <CubeIcon />
                                    </div>
                                    <span className={`badge ${equipment.status === 'Aktif' ? 'badge-green' : 'badge-orange'}`}>
                                        {equipment.status}
                                    </span>
                                </div>

                                <h3 className="equipment-name">{equipment.name}</h3>
                                <p className="equipment-code">{equipment.code}</p>
                                <p className="equipment-location">{equipment.category} • {equipment.location}</p>

                                <div className="equipment-meta">
                                    <div className="equipment-category">
                                        <TagIcon />
                                        <span>{equipment.category}</span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        {equipment.sheets.length} template checksheet tersedia
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
