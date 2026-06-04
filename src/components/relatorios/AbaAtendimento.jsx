import { useState } from 'react'

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#f0fdf4' },
  SEGINFO: { color: '#7c3aed', bg: '#faf5ff' },
}

function CardMetrica({ label, valor, cor }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 8, padding: '16px 20px',
      borderLeft: `4px solid ${cor || 'var(--primary)'}`
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{valor}</div>
    </div>
  )
}

function BarraProgresso({ label, valor, total, cor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{valor} ({pct}%)</span>
      </div>
      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: cor, borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

export default function AbaAtendimento({ atendimentos }) {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const filtrados = atendimentos.filter(a => {
    const data = new Date(a.createdAt)
    if (dataInicio && data < new Date(dataInicio)) return false
    if (dataFim && data > new Date(dataFim)) return false
    return true
  })

  const total = filtrados.length
  const sinalizados = filtrados.filter(a => a.coluna === 'sinalizado').length
  const encaminhados = filtrados.filter(a => a.coluna === 'encaminhado').length
  const resolvidos = filtrados.filter(a => a.coluna === 'resolvido').length

  const porEmpresa = ['EGC', 'GWC', 'SEGINFO'].map(emp => ({
    label: emp,
    total: filtrados.filter(a => a.empresa === emp).length,
    cor: empresaCores[emp].color
  }))

  const porCanal = [
    { id: 'email',    label: '📧 E-mail',    cor: '#2563eb' },
    { id: 'whatsapp', label: '💬 WhatsApp',   cor: '#059669' },
  ].map(c => ({ ...c, total: filtrados.filter(a => a.canal === c.id).length }))

  const porPrioridade = [
    { id: 'alta',  label: 'Alta',  cor: '#ef4444' },
    { id: 'media', label: 'Média', cor: '#d97706' },
    { id: 'baixa', label: 'Baixa', cor: '#059669' },
  ].map(p => ({ ...p, total: filtrados.filter(a => a.prioridade === p.id).length }))

  // Por responsável
  const responsaveisMap = {}
  filtrados.filter(a => a.encaminhadoPara).forEach(a => {
    responsaveisMap[a.encaminhadoPara] = (responsaveisMap[a.encaminhadoPara] || 0) + 1
  })
  const porResponsavel = Object.entries(responsaveisMap)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)

  return (
    <div>
      {/* Filtro período */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Período:</span>
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>até</span>
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
        {(dataInicio || dataFim) && (
          <button onClick={() => { setDataInicio(''); setDataFim('') }} style={{
            padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 4,
            background: '#fff', fontSize: 12, cursor: 'pointer', color: 'var(--text-muted)'
          }}>Limpar</button>
        )}
      </div>

      {/* Métricas gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <CardMetrica label="TOTAL" valor={total} cor="#6b7280" />
        <CardMetrica label="SINALIZADOS" valor={sinalizados} cor="#6b7280" />
        <CardMetrica label="ENCAMINHADOS" valor={encaminhados} cor="#2563eb" />
        <CardMetrica label="RESOLVIDOS" valor={resolvidos} cor="#059669" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Por empresa */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Por Empresa</h3>
          {porEmpresa.map(emp => (
            <BarraProgresso key={emp.label} label={emp.label} valor={emp.total} total={total || 1} cor={emp.cor} />
          ))}
        </div>

        {/* Por canal */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Por Canal</h3>
          {porCanal.map(c => (
            <BarraProgresso key={c.id} label={c.label} valor={c.total} total={total || 1} cor={c.cor} />
          ))}
        </div>

        {/* Por prioridade */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Por Prioridade</h3>
          {porPrioridade.map(p => (
            <BarraProgresso key={p.id} label={p.label} valor={p.total} total={total || 1} cor={p.cor} />
          ))}
        </div>

        {/* Por responsável */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Por Responsável</h3>
          {porResponsavel.length > 0 ? porResponsavel.map(r => (
            <BarraProgresso key={r.nome} label={r.nome} valor={r.total} total={encaminhados || 1} cor="#2563eb" />
          )) : (
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Nenhum encaminhamento ainda</div>
          )}
        </div>
      </div>
    </div>
  )
}