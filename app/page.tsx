'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { globalStyles } from '../lib/styles'

const styles = {
    formContainer: "space-y-6",
    labelText: "text-sm font-medium text-gray-700",
    inputGroup: "space-y-2",
    toggleButton: "text-white-600 hover:text-blue-600 font-medium transition-colors underline-offset-4 hover:underline"
}

export default function Home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/dashboard')
            }
        }
        checkAuth()
    }, [router])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (!error) router.push('/dashboard')
            else alert(error.message)
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (!error) alert('Check your email to confirm your account')
            else alert(error.message)
        }
    }

    return (
        <div className={globalStyles.container}>
            <div className={`${globalStyles.card} w-full max-w-md`}>
                <div className="text-center mb-8">
                    <h2 className="text-gradient text-3xl font-bold mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600">
                        {isLogin ? 'Login to access your account' : 'Register to get started'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className={styles.formContainer}>
                    <div className={styles.inputGroup}>
                        <label className={styles.labelText}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={globalStyles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.labelText}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={globalStyles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>

                    <div className="text-center pt-4 text-white">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className={styles.toggleButton}
                        >
                            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}