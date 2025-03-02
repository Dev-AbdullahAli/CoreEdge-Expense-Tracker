'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Expense } from '../../../lib/types'
import { globalStyles } from '../../../lib/styles'
import { useRouter } from 'next/navigation'

const styles = {
    groupContainer: "max-w-4xl mx-auto p-6",
    expenseList: "space-y-4",
    inputGroup: "flex gap-4 items-center",
    amountInput: "w-32",
    expenseCard: "bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
}

export default function GroupPage({ params }: { params: { groupId: string } }) {
    const router = useRouter()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [groupName, setGroupName] = useState('')
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
        getGroupDetails()
        getExpenses()
    }, [])

    async function getGroupDetails() {
        const { data } = await supabase
            .from('groups')
            .select('name')
            .eq('id', params.groupId)
            .single()
        if (data) setGroupName(data.name)
    }

    async function getExpenses() {
        const { data } = await supabase
            .from('expenses')
            .select('*')
            .eq('group_id', params.groupId)
        console.log("data.....", data)
        setExpenses(data || [])
    }

    async function addExpense(e: React.FormEvent) {
        e.preventDefault();
        const { data, error } = await supabase
            .from('expenses')
            .insert([
                { description, amount: parseFloat(amount), group_id: params.groupId, user_id: user.id },
            ])
            .select()
        console.log("data.....error", data, error)
        if (!error) {
            setDescription('')
            setAmount('')
            getExpenses()
        } else {
            alert(error.message)
        }


    }

    return (
        <div className={styles.groupContainer}>
            <h1 className={globalStyles.gradientText}>{groupName}</h1>

            <form onSubmit={addExpense} className="mb-8">
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Expense description"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        required
                    />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className={`${styles.amountInput} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
                        required
                        step="0.01"
                    />
                    <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
                        Add Expense
                    </button>
                </div>
            </form>

            <div className={styles.expenseList}>
                {expenses.map((expense) => (
                    <div key={expense.id} className={styles.expenseCard}>
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-700">{expense.description}</p>
                            <p className="font-semibold text-gradient">${expense.amount.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}