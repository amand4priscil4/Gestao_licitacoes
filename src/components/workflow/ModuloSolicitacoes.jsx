import { useState } from 'react'
import { Info, Pencil, Trash2, CheckCircle, XCircle, Ban, Bookmark, Plus } from 'lucide-react'

const EMPRESAS = ['EGC', 'GWC', 'SEGINFO']
const POR_PAGINA = 10

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#ecfdf5' },
  SEGINFO: { color: '#7c3aed', bg: '#f5f3ff' },
}

const COLUNAS = [
  { id: 'enviada',   label: 'Enviada',   color: '#6b7280', headerBg: '#f9fafb' },
  { id: 'aceita',    label: 'Aceita',    color: '#059669', headerBg: '#ecfdf5' },
  { id: 'negada',    label: 'Negada',    color: '#ef4444', headerBg: '#fef2f2' },
  { id: 'cancelada', label: 'Cancelada', color: '#9ca3af', headerBg: '#f9fafb' },
]

const tipoSolicCores = {
  dispensa:     { color: '#a16207', bg: '#fefce8', label: 'Dispensa' },
  tmm:          { color: '#c2410c', bg: '#fff7ed', label: 'TMM' },
  reequilibrio: { color: '#7e22ce', bg: '#faf5ff', label: 'Reequilíbrio' },
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 13,
  outline: 'none',
  background: 'var(--surface)',
  color: 'var(--text)',
}

const labelStyle = {
  fontSize: 11,
  color: 'var(--text-muted)',
  marginBottom: 4,
  display: 'block',
  fontWeight: 500,
  letterSpacing: '0.02em',
}

function btnAcao(color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '7px 14px', border: 'none',
    borderRadius: 'var(--radius-pill)',
    background: color, color: '#fff',
    fontSize: 12, fontWeight: 600,
    cursor: 'pointer', transition: 'opacity 0.15s',
  }
}

function calcularAlerta(emp, prazos) {
  if (!emp.dataSolicitacao) return null
  const diasSemResposta = Math.floor((Date.now() - new Date(emp.dataSolicitacao)) / 86400000)
  const prazo = prazos?.[emp.tipoSolicitacao] ?? 7
  const reforcos = emp.reforcos || []
  if (reforcos.length > 0) {
    const ultimo = new Date(reforcos[reforcos.length - 1].data)
    const diasDesdeReforco = Math.floor((Date.now() - ultimo) / 86400000)
    if (diasDesdeReforco <= prazo) return { cor: '#2563eb', tipo: 'reforco', data: ultimo, dias: diasSemResposta }
  }
  if (diasSemResposta > prazo) return { cor: '#ef4444', tipo: 'excedido', dias: diasSemResposta }
  return { cor: '#16a34a', tipo: 'prazo', dias: diasSemResposta }
}

function DetalhesModal({ emp, onClose, onAtualizar, onExcluir, prazos }) {
  const [editando, setEditando] = useState(false)
  const [novoReforco, setNovoReforco] = useState('')
  const [obsReforco, setObsReforco] = useState('')
  const tipo = tipoSolicCores[emp.tipoSolicitacao] || tipoSolicCores.dispensa
  const cor  = empresaCores[emp.empresa] || empresaCores.EGC
  const alerta = calcularAlerta(emp, prazos)
  const isTMMAceita = emp.tipoSolicitacao === 'tmm' && emp.colunasolicitacao === 'aceita'

  const [form, setForm] = useState({
    ticket: emp.ticket,
    orgao: emp.orgao,
    empresa: emp.empresa,
    descricao: emp.descricao,
    valor: emp.valor,
    dataRecebimento: emp.dataRecebimento?.split('T')[0] || '',
    dataSolicitacao: emp.dataSolicitacao?.split('T')[0] || '',
    tipoSolicitacao: emp.tipoSolicitacao,
    marcaAtual: emp.marcaAtual || '',
    marcaSubstituta: emp.marcaSubstituta || '',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  function moverColuna(coluna) {
    if (coluna === 'aceita' && emp.tipoSolicitacao === 'tmm') {
      onAtualizar(emp._id, {
        colunasolicitacao: 'aceita',
        marcaAntiga: emp.marcaAtual,
        marcaNova: emp.marcaSubstituta,
      })
    } else {
      onAtualizar(emp._id, { colunasolicitacao: coluna })
    }
    onClose()
  }

  function moverParaFaturamento() {
    onAtualizar(emp._id, { colunasolicitacao: 'aceita', modulo: 'empenhos', colunaEmpenho: 'faturamento' })
    onClose()
  }

  function handleSalvarEdicao() {
    onAtualizar(emp._id, { ...form, valor: parseFloat(form.valor) })
    setEditando(false); onClose()
  }

  function handleExcluir() {
    if (window.confirm(`Excluir a solicitação #${emp.ticket}?`)) { onExcluir(emp._id); onClose() }
  }

  function adicionarReforco() {
    if (!novoReforco) return
    const reforcos = [...(emp.reforcos || []), { data: novoReforco, observacao: obsReforco }]
    onAtualizar(emp._id, { reforcos })
    setNovoReforco('')
    setObsReforco('')
  }

  const reforcos = emp.reforcos || []

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        width: 560, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 3 }}>
              #{emp.ticket}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{emp.orgao}</h3>
            {alerta && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                <Bookmark size={12} fill={alerta.cor} color={alerta.cor} />
                <span style={{ fontSize: 11, color: alerta.cor, fontWeight: 600 }}>
                  {alerta.tipo === 'reforco'
                    ? `Reforço em ${new Date(alerta.data).toLocaleDateString('pt-BR')} · ${alerta.dias} dias desde a solicitação`
                    : alerta.tipo === 'excedido'
                    ? `Prazo excedido · ${alerta.dias} dias sem resposta`
                    : `No prazo · ${alerta.dias} dias`}
                </span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={() => setEditando(!editando)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              background: editando ? 'var(--primary)' : 'var(--surface)',
              color: editando ? '#fff' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <Pencil size={12} />
              {editando ? 'Cancelar' : 'Editar'}
            </button>
            <button onClick={handleExcluir} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
              color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <Trash2 size={12} /> Excluir
            </button>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: '50%',
              border: '1px solid var(--border)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18,
            }}>×</button>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {editando ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={labelStyle}>Ticket</label><input style={inputStyle} value={form.ticket} onChange={e => set('ticket', e.target.value)} /></div>
              <div>
                <label style={labelStyle}>Empresa</label>
                <select style={inputStyle} value={form.empresa} onChange={e => set('empresa', e.target.value)}>
                  <option>EGC</option><option>GWC</option><option>SEGINFO</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Órgão</label><input style={inputStyle} value={form.orgao} onChange={e => set('orgao', e.target.value)} /></div>
              <div><label style={labelStyle}>Data de Recebimento</label><input style={inputStyle} type="date" value={form.dataRecebimento} onChange={e => set('dataRecebimento', e.target.value)} /></div>
              <div><label style={labelStyle}>Data da Solicitação</label><input style={inputStyle} type="date" value={form.dataSolicitacao} onChange={e => set('dataSolicitacao', e.target.value)} /></div>
              <div><label style={labelStyle}>Valor</label><input style={inputStyle} type="number" value={form.valor} onChange={e => set('valor', e.target.value)} /></div>
              <div>
                <label style={labelStyle}>Tipo de Solicitação</label>
                <select style={inputStyle} value={form.tipoSolicitacao} onChange={e => set('tipoSolicitacao', e.target.value)}>
                  <option value="dispensa">Dispensa</option>
                  <option value="tmm">TMM</option>
                  <option value="reequilibrio">Reequilíbrio</option>
                </select>
              </div>
              {form.tipoSolicitacao === 'tmm' && (
                <>
                  <div><label style={labelStyle}>Marca Atual</label><input style={inputStyle} value={form.marcaAtual} onChange={e => set('marcaAtual', e.target.value)} /></div>
                  <div><label style={labelStyle}>Marca Substituta</label><input style={inputStyle} value={form.marcaSubstituta} onChange={e => set('marcaSubstituta', e.target.value)} /></div>
                </>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descrição</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} value={form.descricao} onChange={e => set('descricao', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSalvarEdicao} style={btnAcao('var(--primary)')}>Salvar alterações</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: tipo.bg, color: tipo.color }}>{tipo.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: cor.bg, color: cor.color }}>{emp.empresa}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div><div style={labelStyle}>Descrição</div><div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{emp.descricao}</div></div>
                <div>
                  <div style={labelStyle}>Valor</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emp.valor)}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Data de Recebimento</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{emp.dataRecebimento ? new Date(emp.dataRecebimento).toLocaleDateString('pt-BR') : '—'}</div>
                </div>
                <div>
                  <div style={labelStyle}>Data da Solicitação</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{emp.dataSolicitacao ? new Date(emp.dataSolicitacao).toLocaleDateString('pt-BR') : '—'}</div>
                </div>
                <div>
                  <div style={labelStyle}>Status atual</div>
                  <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize', color: 'var(--text)' }}>{emp.colunasolicitacao}</div>
                </div>
                {emp.tipoSolicitacao === 'tmm' && (
                  <>
                    <div>
                      <div style={labelStyle}>{isTMMAceita ? 'Marca Antiga' : 'Marca Atual'}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{isTMMAceita ? (emp.marcaAntiga || emp.marcaAtual || '—') : (emp.marcaAtual || '—')}</div>
                    </div>
                    <div>
                      <div style={labelStyle}>{isTMMAceita ? 'Marca Nova' : 'Marca Substituta'}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{isTMMAceita ? (emp.marcaNova || emp.marcaSubstituta || '—') : (emp.marcaSubstituta || '—')}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Reforços */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bookmark size={11} /> REFORÇOS
                </div>
                {reforcos.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    {reforcos.map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        padding: '6px 10px', background: '#eff6ff',
                        borderRadius: 'var(--radius-sm)', marginBottom: 6, fontSize: 12,
                      }}>
                        <Bookmark size={11} fill="#2563eb" color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontWeight: 600, color: '#2563eb' }}>{new Date(r.data).toLocaleDateString('pt-BR')}</span>
                          {r.observacao && <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{r.observacao}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8, alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>Data do reforço</label>
                    <input style={inputStyle} type="date" value={novoReforco} onChange={e => setNovoReforco(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Observação (opcional)</label>
                    <input style={inputStyle} placeholder="Ex: Liguei, aguardando retorno" value={obsReforco} onChange={e => setObsReforco(e.target.value)} />
                  </div>
                  <button onClick={adicionarReforco} style={{ ...btnAcao('#2563eb'), height: 34, whiteSpace: 'nowrap' }}>
                    <Plus size={12} /> Reforço
                  </button>
                </div>
              </div>

              {/* Ações */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em' }}>AÇÕES</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {emp.colunasolicitacao === 'enviada' && (
                    <>
                      <button onClick={() => moverColuna('aceita')} style={btnAcao('#059669')}><CheckCircle size={13} /> Aceita</button>
                      <button onClick={() => moverColuna('negada')} style={btnAcao('#ef4444')}><XCircle size={13} /> Negada</button>
                      <button onClick={() => moverColuna('cancelada')} style={btnAcao('#9ca3af')}><Ban size={13} /> Cancelar</button>
                    </>
                  )}
                  {emp.colunasolicitacao === 'aceita' && (
                    <>
                      <button onClick={moverParaFaturamento} style={btnAcao('#d97706')}>Enviar para Faturamento</button>
                      <button onClick={() => moverColuna('cancelada')} style={btnAcao('#9ca3af')}><Ban size={13} /> Cancelar</button>
                    </>
                  )}
                  {emp.colunasolicitacao === 'negada' && (
                    <button onClick={() => moverColuna('cancelada')} style={btnAcao('#9ca3af')}><Ban size={13} /> Cancelar</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SolicitacaoCard({ emp, onAtualizar, onExcluir, prazos }) {
  const [detalhes, setDetalhes] = useState(false)
  const tipo = tipoSolicCores[emp.tipoSolicitacao] || tipoSolicCores.dispensa
  const cor  = empresaCores[emp.empresa] || empresaCores.EGC
  const alerta = calcularAlerta(emp, prazos)

  return (
    <>
      <div
        onClick={() => setDetalhes(true)}
        style={{
          background: '#ffffff', borderRadius: 'var(--radius)',
          padding: '12px 14px', marginBottom: 8,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
          transition: 'box-shadow 0.15s, border-color 0.15s',
          cursor: 'pointer', position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        {alerta && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <Bookmark size={14} fill={alerta.cor} color={alerta.cor} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>#{emp.ticket}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10, fontWeight: 600, padding: '2px 8px',
            borderRadius: 'var(--radius-pill)', background: cor.bg, color: cor.color,
            marginRight: alerta ? 18 : 0,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cor.color }} />
            {emp.empresa}
          </span>
        </div>

        <div className="truncate" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
          {emp.orgao}
        </div>

        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: tipo.bg, color: tipo.color }}>
            {tipo.label}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-light)' }}>
            Recebido: {emp.dataRecebimento ? new Date(emp.dataRecebimento).toLocaleDateString('pt-BR') : '—'}
          </span>
          {emp.dataSolicitacao && (
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>
              Solicitado: {new Date(emp.dataSolicitacao).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {detalhes && (
        <DetalhesModal emp={emp} onClose={() => setDetalhes(false)} onAtualizar={onAtualizar} onExcluir={onExcluir} prazos={prazos} />
      )}
    </>
  )
}

function Coluna({ col, cards, onAtualizar, onExcluir, prazos }) {
  const [pagina, setPagina] = useState(1)
  const ordenados = [...cards].sort((a, b) => new Date(b.dataRecebimento) - new Date(a.dataRecebimento))
  const visiveis  = ordenados.slice(0, pagina * POR_PAGINA)
  const temMais   = cards.length > visiveis.length

  return (
    <div style={{
      flex: 1, borderRadius: 'var(--radius)', border: '1px solid var(--border)',
      background: '#ffffff', boxShadow: 'var(--shadow-card)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 200,
    }}>
      <div style={{
        background: col.headerBg, padding: '10px 14px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, background: col.color + '22', color: col.color, borderRadius: 'var(--radius-pill)', padding: '1px 8px' }}>
          {cards.length}
        </span>
      </div>

      <div style={{ flex: 1, padding: '10px 10px 4px' }}>
        {visiveis.map(emp => (
          <SolicitacaoCard key={emp._id} emp={emp} onAtualizar={onAtualizar} onExcluir={onExcluir} prazos={prazos} />
        ))}
        {cards.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '28px 0' }}>Nenhuma solicitação</div>
        )}
        {temMais && (
          <button
            onClick={() => setPagina(p => p + 1)}
            style={{
              width: '100%', padding: '7px', border: '1px dashed var(--border-hover)',
              borderRadius: 'var(--radius-sm)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', marginBottom: 8, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Ver mais ({cards.length - visiveis.length} restantes)
          </button>
        )}
      </div>
    </div>
  )
}

export default function ModuloSolicitacoes({ empenhos, onAtualizar, onExcluir, prazos }) {
  const [abaAtiva, setAbaAtiva] = useState('EGC')
  const empFiltrados = empenhos.filter(e => e.empresa === abaAtiva)

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Solicitações</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Dispensas, TMM e Reequilíbrios em andamento.</p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {EMPRESAS.map(emp => (
          <button key={emp} onClick={() => setAbaAtiva(emp)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 16px', border: '1px solid',
            borderColor: abaAtiva === emp ? empresaCores[emp].color : 'var(--border)',
            borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
            background: abaAtiva === emp ? empresaCores[emp].bg : 'var(--surface)',
            color: abaAtiva === emp ? empresaCores[emp].color : 'var(--text-muted)',
            transition: 'all 0.15s',
          }}>
            {abaAtiva === emp && <span style={{ width: 6, height: 6, borderRadius: '50%', background: empresaCores[emp].color }} />}
            {emp}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {COLUNAS.map(col => (
          <Coluna key={col.id} col={col} cards={empFiltrados.filter(e => e.colunasolicitacao === col.id)} onAtualizar={onAtualizar} onExcluir={onExcluir} prazos={prazos} />
        ))}
      </div>
    </div>
  )
}