import { NavLink } from 'react-router-dom'
import { Kanban, Building2, BarChart2, Settings, GitBranch, MessageSquare } from 'lucide-react'

const nav = [
  { to: '/workflow',     icon: Kanban,        label: 'Workflow' },
  { to: '/atendimento',  icon: MessageSquare, label: 'Atendimento' },
  { to: '/orgaos',       icon: Building2,     label: 'Órgãos' },
  { to: '/relatorios',   icon: BarChart2,     label: 'Relatórios' },
  { to: '/fluxograma',   icon: GitBranch,     label: 'Fluxograma' },
  { to: '/configuracoes',icon: Settings,      label: 'Configurações' },
]

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 'var(--sidebar-w)', background: '#1e3a5f',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
          GESTÃO LICITAÇÕES
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          EGC · GWC · SEGINFO
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 10px' }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 6,
            marginBottom: 2, fontSize: 13, fontWeight: 500,
            textDecoration: 'none', transition: 'all 0.15s',
            background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
          })}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>
          © {new Date().getFullYear()} · Gestão Licitações
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          Desenvolvido por Amanda Alves
        </div>
      </div>
    </aside>
  )
}