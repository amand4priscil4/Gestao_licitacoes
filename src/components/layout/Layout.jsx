import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <Header />
      <main style={{
        flex: 1,
        paddingTop: 'var(--header-h)',
        background: 'var(--bg)',
        minHeight: 'calc(100vh - var(--header-h))',
        overflowX: 'hidden',
      }}>
        <Outlet />
      </main>
    </div>
  )
}