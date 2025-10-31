import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/axios'
import { useAuth } from '@/store/auth'
import { toast } from 'sonner'

export default function LoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token, data.user)
      toast.success(`Logged in as ${data.user.name}`)
      nav('/')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Login failed')
    }
  }

  return (
    <div className="grid place-items-center min-h-[calc(100svh-56px)]">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Login</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
          <p className="mt-3 text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
