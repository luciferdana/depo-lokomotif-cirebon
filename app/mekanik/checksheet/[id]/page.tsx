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
}

export default function ChecksheetDetailPage() {
    const router = useRouter()
    const params = useParams()
    const checksheetId = params.id as string

    const [user, setUser] = useState<User | null>(null)
    const [checksheet, setChecksheet] = useState<Checksheet | null>(null)
    const [items, setItems] = useState<ChecksheetItem[]>([])
    const [saving, setSaving] = useState(false)

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

                // Load saved items or create from template
                if (found.items && found.items.length > 0) {
                    setItems(found.items)
                } else {
                    // Generate items from equipment template
                    const equipment = equipmentData[found.equipmentId]
                    if (equipment && equipment.checksheet_templates) {
                        const templateData = equipment.checksheet_templates[found.template]
                        if (templateData && templateData.items) {
                            const generatedItems: ChecksheetItem[] = []
                            let itemIndex = 0

                            templateData.items.forEach((item: any) => {
                                // Add main item
                                generatedItems.push({
                                    id: `item-${itemIndex++}`,
                                    name: item.name || '',
                                    description: item.description || '',
                                    status: null,
                                    keterangan: ''
                                })

                                // Add sub-items
                                if (item.sub_items && item.sub_items.length > 0) {
                                    item.sub_items.forEach((subItem: any) => {
                                        generatedItems.push({
                                            id: `item-${itemIndex++}`,
                                            name: `  ${subItem.name}`,
                                            description: subItem.description || '',
                                            status: null,
                                            keterangan: ''
                                        })
                                    })
                                }
                            })

                            setItems(generatedItems.filter(i => i.name && i.name.trim() !== ''))
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
            status: progress === 100 ? 'selesai' : 'progress'
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

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} dashboardTitle="Mechanic Dashboard" />

            <main className="main-content">
                <header className="content-header">
                    <div className="content-header-left">
                        <h1>{checksheet.equipmentName}</h1>
                        <p>Template: {checksheet.template} • {checksheet.date}</p>
                    </div>
                    <div className="content-header-right">
                        <Link href="/mekanik/checksheet" className="btn btn-outline">← Kembali</Link>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Menyimpan...' : 'Simpan Progress'}
                        </button>
                    </div>
                </header>

                <div className="content-body">
                    {/* Progress Card */}
                    <div className="section-card">
                        <div className="section-card-header">
                            <h3 className="section-card-title">Progress Checksheet</h3>
                            <span className="section-card-value">{progress}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className={`progress-bar-fill ${progress === 100 ? 'green' : 'blue'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="progress-text">
                            {items.filter(i => i.status !== null).length} dari {items.length} item selesai dicek
                        </p>
                    </div>

                    {/* Checklist Items */}
                    <div className="section-card">
                        <h3 className="section-card-title" style={{ marginBottom: '1rem' }}>Daftar Pemeriksaan</h3>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>No</th>
                                        <th>Nama Bagian</th>
                                        <th>Uraian Pekerjaan</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                                        <th style={{ width: '200px' }}>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td style={{ whiteSpace: 'pre-wrap' }}>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => handleStatusChange(item.id, 'ok')}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            backgroundColor: item.status === 'ok' ? '#22c55e' : '#e2e8f0',
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
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            backgroundColor: item.status === 'nok' ? '#ef4444' : '#e2e8f0',
                                                            color: item.status === 'nok' ? 'white' : '#64748b',
                                                            fontWeight: 500,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        N.OK
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="Keterangan..."
                                                    value={item.keterangan}
                                                    onChange={(e) => handleKeteranganChange(item.id, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '4px',
                                                        fontSize: '0.875rem'
                                                    }}
                                                />
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
