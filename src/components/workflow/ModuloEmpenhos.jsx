import { useState } from 'react'
import { Info, Plus, Pencil, Trash2, ArrowRight, CheckCircle } from 'lucide-react'

const EMPRESAS = ['EGC', 'GWC', 'SEGINFO']
const POR_PAGINA = 10

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#ecfdf5' },
  SEGINFO: { color: '#7c3aed', bg: '#f5f3ff' },
}

const COLUNAS = [
  { id: 'recebido',    label: 'Recebido',    color: '#6b7280', headerBg: '#f9fafb' },
  { id: 'listado',     label: 'Listado',     color: '#2563eb', headerBg: '#eff6ff' },
  { id: 'faturamento', label: 'Faturamento', color: '#d97706', headerBg: '#fffbeb' },
]

const tipoSolicInfo = {
  dispensa:     { bg: '#fefce8', color: '#a16207', label: 'Dispensa' },
  tmm:          { bg: '#fff7ed', color: '#c2410c', label: 'TMM' },
  reequilibrio: { bg: '#faf5ff', color: '#7e22ce', label: 'Reequilíbrio' },
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
  transition: 'border-color 0.15s',
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '7px 14px',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    background: color,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  }
}

function DetalhesModal({ emp, onClose, onAtualizar, onExcluir }) {
  const [editando, setEditando] = useState(false)
  const [modalSolic, setModalSolic] = useState(false)
  const [tipoSolic, setTipoSolic] = useState('dispensa')
  const [form, setForm] = useState({
    ticket: emp.ticket,
    orgao: emp.orgao,
    empresa: emp.empresa,
    descricao: emp.descricao,
    valor: emp.valor,
    dataRecebimento: emp.dataRecebimento?.split('T')[0] || '',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  function moverColuna(coluna) { onAtualizar(emp._id, { colunaEmpenho: coluna }); onClose() }
  function criarSolicitacao() {
    onAtualizar(emp._id, { modulo: 'solicitacoes', colunasolicitacao: 'enviada', tipoSolicitacao: tipoSolic })
    setModalSolic(false); onClose()
  }
  function marcarFaturado() { onAtualizar(emp._id, { modulo: 'faturados' }); onClose() }
  function handleSalvarEdicao() { onAtualizar(emp._id, { ...form, valor: parseFloat(form.valor) }); setEditando(false); onClose() }
  function handleExcluir() {
    if (window.confirm(`Excluir o empenho #${emp.ticket}?`)) { onExcluir(emp._id); onClose() }
  }

  const cor = empresaCores[emp.empresa] || empresaCores.EGC
  const solic = emp.tipoSolicitacao ? tipoSolicInfo[emp.tipoSolicitacao] : null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        width: 520, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 3 }}>
              #{emp.ticket}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              {emp.orgao}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => setEditando(!editando)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: editando ? 'var(--primary)' : 'var(--surface)',
                color: editando ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Pencil size={12} />
              {editando ? 'Cancelar' : 'Editar'}
            </button>
            <button
              onClick={handleExcluir}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
                color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Trash2 size={12} />
              Excluir
            </button>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '1px solid var(--border)', background: 'var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18,
              }}
            >×</button>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {editando ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Ticket</label>
                <input style={inputStyle} value={form.ticket} onChange={e => set('ticket', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Empresa</label>
                <select style={inputStyle} value={form.empresa} onChange={e => set('empresa', e.target.value)}>
                  <option>EGC</option><option>GWC</option><option>SEGINFO</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Órgão</label>
                <input style={inputStyle} value={form.orgao} onChange={e => set('orgao', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Valor</label>
                <input style={inputStyle} type="number" value={form.valor} onChange={e => set('valor', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Data de recebimento</label>
                <input style={inputStyle} type="date" value={form.dataRecebimento} onChange={e => set('dataRecebimento', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descrição</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} value={form.descricao} onChange={e => set('descricao', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSalvarEdicao} style={btnAcao('var(--primary)')}>
                  Salvar alterações
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                  background: cor.bg, color: cor.color,
                }}>
                  {emp.empresa}
                </span>
                {solic && (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                    background: solic.bg, color: solic.color,
                  }}>
                    {solic.label}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={labelStyle}>Descrição</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{emp.descricao}</div>
                </div>
                <div>
                  <div style={labelStyle}>Valor</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emp.valor)}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Data de recebimento</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>
                    {new Date(emp.dataRecebimento).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Coluna atual</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    {emp.colunaEmpenho === 'recebido' ? 'Recebido' : emp.colunaEmpenho === 'listado' ? 'Listado' : 'Faturamento'}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em' }}>
                  AÇÕES
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {emp.colunaEmpenho === 'recebido' && (
                    <button onClick={() => moverColuna('listado')} style={btnAcao('#2563eb')}>
                      <ArrowRight size={13} /> Mover para Listado
                    </button>
                  )}
                  {emp.colunaEmpenho === 'listado' && (
                    <>
                      <button onClick={() => moverColuna('faturamento')} style={btnAcao('#059669')}>
                        <ArrowRight size={13} /> Faturamento
                      </button>
                      <button onClick={() => setModalSolic(true)} style={btnAcao('#d97706')}>
                        <Plus size={13} /> Solicitação
                      </button>
                    </>
                  )}
                  {emp.colunaEmpenho === 'faturamento' && (
                    <button onClick={marcarFaturado} style={btnAcao('#059669')}>
                      <CheckCircle size={13} /> Marcar Faturado
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {modalSolic && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
            padding: 24, width: 340, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>
              Tipo de Solicitação
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Selecione o tipo antes de criar a solicitação.
            </p>
            <select value={tipoSolic} onChange={e => setTipoSolic(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }}>
              <option value="dispensa">Dispensa</option>
              <option value="tmm">TMM</option>
              <option value="reequilibrio">Reequilíbrio</option>
            </select>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setModalSolic(false)} style={btnAcao('#6b7280')}>Cancelar</button>
              <button onClick={criarSolicitacao} style={btnAcao('#2563eb')}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmpenhoCard({ emp, onAtualizar, onExcluir }) {
  const [detalhes, setDetalhes] = useState(false)
  const cor = empresaCores[emp.empresa] || empresaCores.EGC
  const solic = emp.tipoSolicitacao ? tipoSolicInfo[emp.tipoSolicitacao] : null

  return (
    <>
      <div
        onClick={() => setDetalhes(true)}
        style={{
          background: '#ffffff', borderRadius: 'var(--radius)',
          padding: '12px 14px', marginBottom: 8,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
          transition: 'box-shadow 0.15s, border-color 0.15s', cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.borderColor = 'var(--border-hover)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)'
          e.currentTarget.style.borderColor = 'var(--border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            #{emp.ticket}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10, fontWeight: 600,
            padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            background: cor.bg, color: cor.color,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cor.color }} />
            {emp.empresa}
          </span>
        </div>

        <div className="truncate" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
          {emp.orgao}
        </div>

        {solic && (
          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: '2px 8px', borderRadius: 'var(--radius-pill)',
              background: solic.bg, color: solic.color,
            }}>
              {solic.label}
            </span>
          </div>
        )}

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid var(--border)', paddingTop: 8,
        }}>
          <span style={{ fontSize: 10, color: 'var(--text-light)' }}>
            {new Date(emp.dataRecebimento).toLocaleDateString('pt-BR')}
          </span>
          <button
            onClick={e => { e.stopPropagation(); setDetalhes(true) }}
            style={{
              width: 22, height: 22, borderRadius: '50%',
              border: '1px solid var(--border)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
            }}
          >
            <Info size={11} />
          </button>
        </div>
      </div>

      {detalhes && (
        <DetalhesModal emp={emp} onClose={() => setDetalhes(false)} onAtualizar={onAtualizar} onExcluir={onExcluir} />
      )}
    </>
  )
}

function Coluna({ col, cards, onAtualizar, onExcluir, onNovoEmpenho }) {
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
        background: col.headerBg, padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            background: col.color + '22', color: col.color,
            borderRadius: 'var(--radius-pill)', padding: '1px 8px',
          }}>
            {cards.length}
          </span>
          {col.id === 'recebido' && (
            <button
              onClick={onNovoEmpenho}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                border: 'none', background: col.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: '10px 10px 4px' }}>
        {visiveis.map(emp => (
          <EmpenhoCard key={emp._id} emp={emp} onAtualizar={onAtualizar} onExcluir={onExcluir} />
        ))}
        {cards.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '28px 0' }}>
            Nenhum empenho
          </div>
        )}
        {temMais && (
          <button
            onClick={() => setPagina(p => p + 1)}
            style={{
              width: '100%', padding: '7px',
              border: '1px dashed var(--border-hover)',
              borderRadius: 'var(--radius-sm)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', marginBottom: 8, transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--primary-light)'
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.color = 'var(--primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            Ver mais ({cards.length - visiveis.length} restantes)
          </button>
        )}
      </div>
    </div>
  )
}

export default function ModuloEmpenhos({ empenhos, onAtualizar, onExcluir, onNovoEmpenho }) {
  const [abaAtiva, setAbaAtiva] = useState('EGC')
  const empFiltrados = empenhos.filter(e => e.empresa === abaAtiva)

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Empenhos</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Acompanhamento por empresa e coluna.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {EMPRESAS.map(emp => (
          <button
            key={emp}
            onClick={() => setAbaAtiva(emp)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 16px', border: '1px solid',
              borderColor: abaAtiva === emp ? empresaCores[emp].color : 'var(--border)',
              borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
              background: abaAtiva === emp ? empresaCores[emp].bg : 'var(--surface)',
              color: abaAtiva === emp ? empresaCores[emp].color : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            {abaAtiva === emp && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: empresaCores[emp].color }} />
            )}
            {emp}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {COLUNAS.map(col => (
          <Coluna
            key={col.id}
            col={col}
            cards={empFiltrados.filter(e => e.colunaEmpenho === col.id)}
            onAtualizar={onAtualizar}
            onExcluir={onExcluir}
            onNovoEmpenho={onNovoEmpenho}
          />
        ))}
      </div>
    </div>
  )
}