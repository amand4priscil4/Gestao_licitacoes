const PRAZOS_DEFAULT = {
  dispensa: 7,
  tmm: 10,
  reequilibrio: 10,
  atendimento: 5,
}

const tipoSolicCores = {
  dispensa:     { color: '#a16207', bg: '#fef9c3', label: 'Dispensa' },
  tmm:          { color: '#c2410c', bg: '#fff7ed', label: 'TMM' },
  reequilibrio: { color: '#7e22ce', bg: '#fdf4ff', label: 'Reequilíbrio' },
}

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#f0fdf4' },
  SEGINFO: { color: '#7c3aed', bg: '#faf5ff' },
}

function diasPassados(data) {
  const agora = new Date()
  const dataItem = new Date(data)
  return Math.floor((agora - dataItem) / (1000 * 60 * 60 * 24))
}

function AlertaCard({ item, tipo, dias, prazo }) {
  const urgente = dias >= prazo * 1.5
  const tipo_info = tipo === 'atendimento'
    ? { color: '#2563eb', bg: '#eff6ff', label: 'Atendimento' }
    : tipoSolicCores[item.tipoSolicitacao] || tipoSolicCores.dispensa

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderLeft: `4px solid ${urgente ? '#ef4444' : '#d97706'}`,
      borderRadius: 8, padding: '14px 16px', marginBottom: 10,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
              background: tipo_info.bg, color: tipo_info.color
            }}>{tipo_info.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
              background: empresaCores[item.empresa]?.bg, color: empresaCores[item.empresa]?.color
            }}>{item.empresa}</span>
            {urgente && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                background: '#fef2f2', color: '#ef4444'
              }}>🚨 URGENTE</span>
            )}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
            {tipo === 'atendimento' ? item.assunto : item.orgao}
          </div>
          {tipo !== 'atendimento' && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>#{item.ticket} · {item.orgao}</div>
          )}
          {tipo === 'atendimento' && item.encaminhadoPara && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              Encaminhado para: <strong>{item.encaminhadoPara}</strong>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
          <div style={{
            fontSize: 20, fontWeight: 700,
            color: urgente ? '#ef4444' : '#d97706'
          }}>{dias}d</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>sem retorno</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>prazo: {prazo}d</div>
        </div>
      </div>
    </div>
  )
}

export default function AbaAlertas({ empenhos, atendimentos }) {
  const prazos = JSON.parse(localStorage.getItem('prazos_alerta') || JSON.stringify(PRAZOS_DEFAULT))

  // Solicitações sem retorno (coluna enviada)
  const solicPendentes = empenhos.filter(e =>
    e.modulo === 'solicitacoes' && e.colunasolicitacao === 'enviada'
  ).map(e => ({
    ...e,
    dias: diasPassados(e.updatedAt || e.createdAt),
    prazo: prazos[e.tipoSolicitacao] || 7
  })).filter(e => e.dias >= e.prazo)
    .sort((a, b) => b.dias - a.dias)

  // Atendimentos encaminhados sem resolução
  const atendPendentes = atendimentos.filter(a =>
    a.coluna === 'encaminhado'
  ).map(a => ({
    ...a,
    dias: diasPassados(a.updatedAt || a.createdAt),
    prazo: prazos.atendimento || 5
  })).filter(a => a.dias >= a.prazo)
    .sort((a, b) => b.dias - a.dias)

  const totalAlertas = solicPendentes.length + atendPendentes.length

  return (
    <div>
      {/* Resumo */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24
      }}>
        <div style={{
          background: totalAlertas > 0 ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${totalAlertas > 0 ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: 8, padding: '14px 20px', flex: 1
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: totalAlertas > 0 ? '#ef4444' : '#059669', marginBottom: 4 }}>
            {totalAlertas > 0 ? '⚠️ ALERTAS ATIVOS' : '✅ TUDO EM DIA'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: totalAlertas > 0 ? '#ef4444' : '#059669' }}>
            {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''}
          </div>
        </div>
        <div style={{
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 8, padding: '14px 20px'
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>SOLICITAÇÕES</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{solicPendentes.length}</div>
        </div>
        <div style={{
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 8, padding: '14px 20px'
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>ATENDIMENTOS</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>{atendPendentes.length}</div>
        </div>
      </div>

      {totalAlertas === 0 ? (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 8, padding: 40, textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}></div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>Tudo em dia!</div>
          <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>Nenhuma solicitação ou atendimento passou do prazo.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Solicitações */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
              Solicitações sem retorno ({solicPendentes.length})
            </h3>
            {solicPendentes.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-light)', padding: '20px 0' }}>Nenhuma pendência</div>
            ) : (
              solicPendentes.map(e => (
                <AlertaCard key={e._id} item={e} tipo="solicitacao" dias={e.dias} prazo={e.prazo} />
              ))
            )}
          </div>

          {/* Atendimentos */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
              Atendimentos sem resolução ({atendPendentes.length})
            </h3>
            {atendPendentes.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-light)', padding: '20px 0' }}>Nenhuma pendência</div>
            ) : (
              atendPendentes.map(a => (
                <AlertaCard key={a._id} item={a} tipo="atendimento" dias={a.dias} prazo={a.prazo} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}