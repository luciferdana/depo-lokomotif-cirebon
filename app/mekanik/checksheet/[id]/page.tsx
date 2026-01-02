'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { getSession, User } from '@/lib/auth'

// Import all equipment data
import crane100t from '@/data/crane-100t.json'
import genset2kva from '@/data/genset-2kva.json'
import genset5kva from '@/data/genset-5kva.json'
import motorCompressor from '@/data/motor-compressor.json'
import overheadCrane from '@/data/overhead-crane-5ton.json'

const equipmentData: Record<string, any> = {
    'crane-100t': crane100t,
    'genset-2kva': genset2kva,
    'genset-5kva': genset5kva,
    'motor-compressor': motorCompressor,
    'overhead-crane-5ton': overheadCrane,
}

interface ChecksheetItem {
    id: string
    no: number
    category: string
    name: string
    description: string
    status: 'ok' | 'nok' | null
    keterangan: string
}

interface Checksheet {
    id: string
    equipmentId: string
    equipmentName: string
    template: string
    date: string
    status: 'progress' | 'selesai' | 'pending'
    progress: number
    description: string
    items?: ChecksheetItem[]
    signatures?: {
        pelaksana: string
        pengawas: string
        spv: string
    }
}

export default function ChecksheetDetailPage() {
    const router = useRouter()
    const params = useParams()
    const checksheetId = params.id as string

    const [user, setUser] = useState<User | null>(null)
    const [checksheet, setChecksheet] = useState<Checksheet | null>(null)
    const [items, setItems] = useState<ChecksheetItem[]>([])
    const [saving, setSaving] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [signatures, setSignatures] = useState({
        pelaksana: '',
        pengawas: '',
        spv: ''
    })

    useEffect(() => {
        const session = getSession()
        if (!session || session.roleType !== 'mekanik') {
            router.push('/login/mekanik')
            return
        }
        setUser(session)

        // Load checksheet from localStorage
        const savedChecksheets = localStorage.getItem('depo_checksheets')
        if (savedChecksheets) {
            const allChecksheets: Checksheet[] = JSON.parse(savedChecksheets)
            const found = allChecksheets.find(cs => cs.id === checksheetId)

            if (found) {
                setChecksheet(found)
                if (found.signatures) {
                    setSignatures(found.signatures)
                }

                // Load saved items or create from template
                if (found.items && found.items.length > 0) {
                    setItems(found.items)
                    // Expand all categories by default
                    const cats = new Set(found.items.map(i => i.category).filter(Boolean))
                    setExpandedCategories(cats as Set<string>)
                } else {
                    // Generate items from equipment template
                    const equipment = equipmentData[found.equipmentId]
                    if (equipment && equipment.checksheet_templates) {
                        const templateData = equipment.checksheet_templates[found.template]
                        if (templateData && templateData.items) {
                            const generatedItems: ChecksheetItem[] = []
                            let itemIndex = 0

                            templateData.items.forEach((item: any) => {
                                const category = item.category || 'Uncategorized'

                                // Add main item
                                if (item.name && item.name.trim() !== '') {
                                    generatedItems.push({
                                        id: `item-${itemIndex++}`,
                                        no: item.no || itemIndex,
                                        category: category,
                                        name: item.name,
                                        description: item.description || '',
                                        status: null,
                                        keterangan: ''
                                    })
                                }

                                // Add sub-items
                                if (item.sub_items && item.sub_items.length > 0) {
                                    item.sub_items.forEach((subItem: any) => {
                                        if (subItem.name && subItem.name.trim() !== '') {
                                            generatedItems.push({
                                                id: `item-${itemIndex++}`,
                                                no: item.no || 0,
                                                category: category,
                                                name: `${item.name} - ${subItem.name.replace(/^[a-z]\.\s*/i, '')}`,
                                                description: subItem.description || '',
                                                status: null,
                                                keterangan: ''
                                            })
                                        }
                                    })
                                }
                            })

                            const filteredItems = generatedItems.filter(i => i.name && i.name.trim() !== '')
                            setItems(filteredItems)

                            // Expand all categories by default
                            const cats = new Set(filteredItems.map(i => i.category).filter(Boolean))
                            setExpandedCategories(cats as Set<string>)
                        }
                    }
                }
            }
        }
    }, [router, checksheetId])

    const handleStatusChange = (itemId: string, status: 'ok' | 'nok') => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, status } : item
        ))
    }

    const handleKeteranganChange = (itemId: string, keterangan: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, keterangan } : item
        ))
    }

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(category)) {
                newSet.delete(category)
            } else {
                newSet.add(category)
            }
            return newSet
        })
    }

    const calculateProgress = () => {
        const totalItems = items.length
        const completedItems = items.filter(i => i.status !== null).length
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    }

    const handleSave = () => {
        if (!checksheet) return

        setSaving(true)

        const progress = calculateProgress()
        const updatedChecksheet: Checksheet = {
            ...checksheet,
            items,
            progress,
            status: progress === 100 ? 'selesai' : 'progress',
            signatures
        }

        // Save to localStorage
        const savedChecksheets = localStorage.getItem('depo_checksheets')
        if (savedChecksheets) {
            const allChecksheets: Checksheet[] = JSON.parse(savedChecksheets)
            const updatedList = allChecksheets.map(cs =>
                cs.id === checksheetId ? updatedChecksheet : cs
            )
            localStorage.setItem('depo_checksheets', JSON.stringify(updatedList))
        }

        setChecksheet(updatedChecksheet)

        setTimeout(() => {
            setSaving(false)
            alert('Progress berhasil disimpan!')
        }, 500)
    }

    if (!user || !checksheet) {
        return <div>Loading...</div>
    }

    const progress = calculateProgress()

    // Group items by category
    const categories = [...new Set(items.map(i => i.category).filter(Boolean))]

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Mechanic Dashboard" />

            <main className="main-content">
                {/* Header */}
                <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                    <Link href="/mekanik/checksheet" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Kembali ke Daftar
                    </Link>
                </div>

                <div className="content-body">
                    {/* Title Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>{checksheet.equipmentName}</h1>
                            <p style={{ color: '#3b82f6', fontSize: '0.875rem' }}>Checksheet {checksheet.template} | {checksheet.date}</p>
                        </div>
                        <div style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            backgroundColor: progress === 100 ? '#dcfce7' : '#dbeafe',
                            color: progress === 100 ? '#166534' : '#1e40af',
                            fontWeight: '500',
                            fontSize: '0.875rem'
                        }}>
                            Progress: {progress}%
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="section-card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Equipment</p>
                                <p style={{ fontWeight: '500' }}>{checksheet.equipmentName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Template</p>
                                <p style={{ fontWeight: '500' }}>Template checksheet {checksheet.template}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Periode</p>
                                <p style={{ fontWeight: '500' }}>{checksheet.date}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Status</p>
                                <p style={{ fontWeight: '500', color: progress === 100 ? '#22c55e' : '#f59e0b' }}>
                                    {progress === 100 ? 'Selesai' : 'Dalam Progress'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Checklist Table */}
                    <div className="section-card">
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 200px 1fr 120px 200px',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderBottom: '2px solid #e2e8f0',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            color: '#64748b'
                        }}>
                            <span>NO</span>
                            <span>NAMA BAGIAN</span>
                            <span>URAIAN PEKERJAAN</span>
                            <span style={{ textAlign: 'center' }}>STATUS</span>
                            <span>KETERANGAN</span>
                        </div>

                        {/* Category Sections */}
                        {categories.map((category) => {
                            const categoryItems = items.filter(i => i.category === category)
                            const isExpanded = expandedCategories.has(category)

                            return (
                                <div key={category}>
                                    {/* Category Header */}
                                    <div
                                        onClick={() => toggleCategory(category)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1rem',
                                            backgroundColor: '#f8fafc',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #e2e8f0',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }}>▶</span>
                                        {category}
                                    </div>

                                    {/* Category Items */}
                                    {isExpanded && categoryItems.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '60px 200px 1fr 120px 200px',
                                                gap: '1rem',
                                                padding: '0.75rem 1rem',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontSize: '0.875rem',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ color: '#3b82f6' }}>{item.no || idx + 1}</span>
                                            <span style={{ color: '#3b82f6' }}>{item.name}</span>
                                            <span style={{ color: '#3b82f6' }}>{item.description}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleStatusChange(item.id, 'ok')}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '4px',
                                                        border: item.status === 'ok' ? 'none' : '1px solid #e2e8f0',
                                                        cursor: 'pointer',
                                                        backgroundColor: item.status === 'ok' ? '#22c55e' : 'white',
                                                        color: item.status === 'ok' ? 'white' : '#64748b',
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    OK
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(item.id, 'nok')}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '4px',
                                                        border: item.status === 'nok' ? 'none' : '1px solid #e2e8f0',
                                                        cursor: 'pointer',
                                                        backgroundColor: item.status === 'nok' ? '#ef4444' : 'white',
                                                        color: item.status === 'nok' ? 'white' : '#64748b',
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    N.OK
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Tambahkan keterangan..."
                                                value={item.keterangan}
                                                onChange={(e) => handleKeteranganChange(item.id, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '4px',
                                                    fontSize: '0.875rem',
                                                    backgroundColor: '#f8fafc'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>

                    {/* Signature Section */}
                    <div className="section-card" style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.875rem' }}>PELAKSANA FASILITAS</p>
                                <input
                                    type="text"
                                    placeholder="NIPP..........."
                                    value={signatures.pelaksana}
                                    onChange={(e) => setSignatures(prev => ({ ...prev, pelaksana: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.875rem' }}>PENGAWAS FASILITAS</p>
                                <input
                                    type="text"
                                    placeholder="NIPP..........."
                                    value={signatures.pengawas}
                                    onChange={(e) => setSignatures(prev => ({ ...prev, pengawas: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.875rem' }}>MENGETAHUI SPV FASILITAS</p>
                                <input
                                    type="text"
                                    placeholder="NIPP..........."
                                    value={signatures.spv}
                                    onChange={(e) => setSignatures(prev => ({ ...prev, spv: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                            style={{ padding: '0.75rem 2rem' }}
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Progress'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
