import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/store/auth'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  return (
    <header className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-semibold">SlotSwapper</Link>
        {token ? (
          <div className="flex items-center gap-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" data-active={loc.pathname === '/'}>My Calendar</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/marketplace" data-active={loc.pathname === '/marketplace'}>Marketplace</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/requests" data-active={loc.pathname === '/requests'}>Requests</Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <span className="text-sm opacity-80 hidden sm:inline">{user?.name}</span>
            <Button variant="outline" onClick={() => { logout(); nav('/login'); }}>Logout</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/register">Sign up</Link></Button>
          </div>
        )}
      </div>
    </header>
  )
}
