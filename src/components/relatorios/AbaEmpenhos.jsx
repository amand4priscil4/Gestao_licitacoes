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
      borderRadius: 8, padding: '14px 16px',
      borderLeft: `4px solid ${cor || 'var(--primary)'}`
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{valor}</div>
    </div>
  )
}

function CardValor({ empresa, valor, total }) {
  const cor = empresaCores[empresa]
  const pct = total > 0 ? ((valor / total) * 100).toFixed(1) : 0

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 8, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
          background: cor.bg, color: cor.color
        }}>{empresa}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
          background: '#f0fdf4', color: '#059669'
        }}>+{pct}%</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>do total faturado</div>
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

export default function AbaEmpenhos({ empenhos }) {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const filtrados = empenhos.filter(e => {
    const data = new Date(e.dataRecebimento)
    if (dataInicio && data < new Date(dataInicio)) return false
    if (dataFim && data > new Date(dataFim)) return false
    return true
  })

  const total = filtrados.length
  const faturados = filtrados.filter(e => e.modulo === 'faturados')
  const solicitacoes = filtrados.filter(e => e.modulo === 'solicitacoes')
  const emAndamento = filtrados.filter(e => e.modulo === 'empenhos')
  const valorFaturadoTotal = faturados.reduce((acc, e) => acc + e.valor, 0)

  const porEmpresa = ['EGC', 'GWC', 'SEGINFO'].map(emp => ({
    label: emp,
    total: filtrados.filter(e => e.empresa === emp).length,
    faturado: filtrados.filter(e => e.empresa === emp && e.modulo === 'faturados').reduce((acc, e) => acc + e.valor, 0),
    cor: empresaCores[emp].color
  }))

  const porTipoSolic = [
    { id: 'dispensa',     label: 'Dispensa',    cor: '#a16207' },
    { id: 'tmm',          label: 'TMM',          cor: '#c2410c' },
    { id: 'reequilibrio', label: 'Reequilíbrio', cor: '#7e22ce' },
  ].map(t => ({
    ...t,
    total: filtrados.filter(e => e.tipoSolicitacao === t.id).length,
    aceitas: filtrados.filter(e => e.tipoSolicitacao === t.id && e.colunasolicitacao === 'aceita').length,
    negadas: filtrados.filter(e => e.tipoSolicitacao === t.id && e.colunasolicitacao === 'negada').length,
  }))

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <CardMetrica label="Total de Empenhos" valor={total} cor="#6b7280" />
        <CardMetrica label="Em Andamento" valor={emAndamento.length} cor="#2563eb" />
        <CardMetrica label="Solicitações" valor={solicitacoes.length} cor="#d97706" />
        <CardMetrica label="Faturados" valor={faturados.length} cor="#059669" />
      </div>

      {/* Valor faturado por empresa */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Valor Faturado por Empresa
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {porEmpresa.map(emp => (
            <CardValor key={emp.label} empresa={emp.label} valor={emp.faturado} total={valorFaturadoTotal} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Por empresa — quantidade */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Empenhos por Empresa</h3>
          {porEmpresa.map(emp => (
            <BarraProgresso key={emp.label} label={emp.label} valor={emp.total} total={total || 1} cor={emp.cor} />
          ))}
        </div>

        {/* Por tipo de solicitação */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Solicitações por Tipo</h3>
          {porTipoSolic.map(t => (
            <div key={t.id} style={{ marginBottom: 16 }}>
              <BarraProgresso label={t.label} valor={t.total} total={solicitacoes.length || 1} cor={t.cor} />
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ color: '#059669' }}>✓ Aceitas: {t.aceitas}</span>
                <span style={{ color: '#ef4444' }}>✗ Negadas: {t.negadas}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}