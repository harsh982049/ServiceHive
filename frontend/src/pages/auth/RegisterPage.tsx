import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/axios'
import { toast } from 'sonner'

export default function RegisterPage() {
  const nav = useNavigate()
  const [name,setName] = useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.post('/auth/register', { name, email, password })
      toast.success("Account created. You can now sign in.")
      nav('/login')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Registration failed')
    }
  }

  return (
    <div className="grid place-items-center min-h-[calc(100svh-56px)]">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Create account</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
            <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <Button type="submit" className="w-full">Sign up</Button>
          </form>
          <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
