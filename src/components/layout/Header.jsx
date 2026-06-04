import { NavLink, useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  Kanban, MessageSquare, Building2,
  Settings, CheckSquare, FileText
} from 'lucide-react'

const nav = [
  { to: '/workflow',    icon: Kanban,        label: 'Workflow' },
  { to: '/atendimento', icon: MessageSquare, label: 'Atendimento' },
  { to: '/orgaos',      icon: Building2,     label: 'Órgãos' },
  { to: '/tarefas',     icon: CheckSquare,   label: 'Tarefas' },
  { to: '/documentos',  icon: FileText,      label: 'Documentos' },
]

export default function Header() {
  const navigate = useNavigate()

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--header-h)',
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      zIndex: 100,
      gap: 32,
    }}>

      {/* Logo */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        lineHeight: 1.2, flexShrink: 0, marginRight: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--header-text)', letterSpacing: '0.04em' }}>
          GESTÃO LICITAÇÕES
        </span>
        <span style={{ fontSize: 10, color: 'var(--header-text-muted)', letterSpacing: '0.06em' }}>
          EGC · GWC · SEGINFO
        </span>
      </div>

      {/* Separador */}
      <div style={{ width: 1, height: 24, background: 'var(--header-border)', flexShrink: 0 }} />

      {/* Navegação */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: isActive ? 'var(--nav-active-bg)' : 'transparent',
              color: isActive ? 'var(--nav-active-text)' : 'var(--header-text-muted)',
              border: isActive ? 'none' : '1px solid transparent',
            })}
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Direita: data + engrenagem + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: 'var(--header-text-muted)' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>

        <button
          onClick={() => navigate('/configuracoes')}
          title="Configurações"
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--header-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--header-text-muted)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'var(--header-text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--header-text-muted)' }}
        >
          <Settings size={15} />
        </button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}