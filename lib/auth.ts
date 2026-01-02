// Demo users for authentication
export const DEMO_USERS = {
    kepala: [
        { username: 'kepala01', password: 'kepala123', name: 'Ir. Bambang Santoso', role: 'Kepala Lokomotif' }
    ],
    supervisor: [
        { username: 'supervisor01', password: 'super123', name: 'Ahmad Wijaya', role: 'Supervisor' },
        { username: 'supervisor02', password: 'super123', name: 'Budi Hartono', role: 'Supervisor' }
    ],
    mekanik: [
        { username: 'mekanik01', password: 'mekanik123', name: 'Ahmad Fauzi', role: 'Mekanik Senior', id: 'MKN-001' },
        { username: 'mekanik02', password: 'mekanik123', name: 'Budi Santoso', role: 'Mekanik', id: 'MKN-002' },
        { username: 'mekanik03', password: 'mekanik123', name: 'Candra Wijaya', role: 'Mekanik', id: 'MKN-003' }
    ]
}

export type UserRole = 'kepala' | 'supervisor' | 'mekanik'

export interface User {
    username: string
    name: string
    role: string
    roleType: UserRole
    id?: string
}

export function authenticateUser(roleType: UserRole, username: string, password: string): User | null {
    const users = DEMO_USERS[roleType]
    const user = users.find(u => u.username === username && u.password === password)

    if (user) {
        return {
            username: user.username,
            name: user.name,
            role: user.role,
            roleType,
            id: (user as any).id
        }
    }

    return null
}

export function saveSession(user: User) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('depo_user', JSON.stringify(user))
    }
}

export function getSession(): User | null {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('depo_user')
        if (data) {
            return JSON.parse(data)
        }
    }
    return null
}

export function clearSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('depo_user')
    }
}
