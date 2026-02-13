import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(res => {
      if(res.data.session?.user) setUser(res.data.session.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if(error) setError(error.message)
    else setUser(data.user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  if(user) {
    return (
      <div>
        <h2>Bem-vindo, {user.email}</h2>
        <button onClick={handleLogout}>Sair</button>
      </div>
    )
  }

  return (
      <div>
        <h1>Login AtlasFlow</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Entrar</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </div>
  )
}

export default App

