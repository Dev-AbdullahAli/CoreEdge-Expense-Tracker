'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { Group } from '../../lib/types'
import Link from 'next/link'
import { globalStyles } from '../../lib/styles'

const styles = {
    dashboardContainer: "max-w-6xl mx-auto p-6",
    header: "mb-8",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    inputGroup: "flex gap-4",
    welcomeText: "text-gray-600 mt-2",
    signOutButton: "px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:underline",
    headerFlex: "flex justify-between items-center"
}

export default function Dashboard() {
    const router = useRouter()
    const [groups, setGroups] = useState<Group[]>([])
    const [newGroupName, setNewGroupName] = useState('')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
            } else {
                setUser(user)
            }
        }
        checkAuth()
    }, [router])

    useEffect(() => {
        if (user) {
            getGroups()
        }
    }, [user])

    async function getGroups() {
        if (!user) return
        const { data } = await supabase
            .from('groups')
            .select('*')
            .eq('user_id', user.id)
        setGroups(data || [])
    }

    async function createGroup(e: React.FormEvent) {
        e.preventDefault()
        const { data, error } = await supabase
            .from('groups')
            .insert([{ name: newGroupName, user_id: user.id }])
            .select()
            .single()

        if (!error) {
            setNewGroupName('')
            getGroups()
        } else {
            alert(error.message || error)
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <div className={styles.headerFlex}>
                    <h1 className={globalStyles.gradientText}>Dashboard</h1>
                    <button
                        onClick={handleSignOut}
                        className={styles.signOutButton}
                    >
                        Sign Out
                    </button>
                </div>
                <p className={styles.welcomeText}>Welcome, {user?.email}</p>
            </div>

            <form onSubmit={createGroup} className="mb-8">
                <div className="input-group">
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="New group name"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        required
                    />
                    <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
                        Create Group
                    </button>
                </div>
            </form>

            <div className={styles.grid}>
                {groups.map((group) => (
                    <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="card hover:scale-105 transition-all"
                    >
                        <h2 className="text-gradient text-xl font-semibold">{group.name}</h2>
                    </Link>
                ))
                }
            </div >
        </div >
    )
}