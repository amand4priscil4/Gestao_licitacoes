import { useState, useEffect } from 'react'
import { atendimentoService, orgaoService } from '../services/api'
import { Info, Plus, Pencil, Trash2, UserCheck, CheckCircle, Loader2, Mail, MessageCircle, MessageSquare } from 'lucide-react'

const EMPRESAS = ['EGC', 'GWC', 'SEGINFO']
const POR_PAGINA = 10

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#ecfdf5' },
  SEGINFO: { color: '#7c3aed', bg: '#f5f3ff' },
}

const COLUNAS = [
  { id: 'sinalizado',  label: 'Sinalizado',  color: '#6b7280', headerBg: '#f9fafb' },
  { id: 'encaminhado', label: 'Encaminhado', color: '#2563eb', headerBg: '#eff6ff' },
  { id: 'resolvido',   label: 'Resolvido',   color: '#059669', headerBg: '#ecfdf5' },
]

const prioridadeCores = {
  baixa: { color: '#059669', bg: '#ecfdf5', label: 'Baixa' },
  media: { color: '#d97706', bg: '#fffbeb', label: 'Média' },
  alta:  { color: '#ef4444', bg: '#fef2f2', label: 'Alta'  },
}

const canalInfo = {
  email:    { color: '#2563eb', bg: '#eff6ff', label: 'E-mail',    Icon: Mail },
  whatsapp: { color: '#059669', bg: '#ecfdf5', label: 'WhatsApp',  Icon: MessageCircle },
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 13,
  outline: 'none',
  background: '#ffffff',
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
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '7px 14px', border: 'none',
    borderRadius: 'var(--radius-pill)',
    background: color, color: '#fff',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.15s',
  }
}

const RESPONSAVEIS_DEFAULT = ['Gustavo', 'Mariana', 'Ingridy', 'Everson']

function NovoAtendimentoModal({ onClose, onSalvar, orgaos, responsaveis }) {
  const [form, setForm] = useState({
    empresa: 'SEGINFO',
    orgao: '',
    canal: 'email',
    assunto: '',
    prioridade: 'media',
    observacoes: '',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const cor = empresaCores[form.empresa]

  function handleSalvar() {
    if (!form.orgao || !form.assunto) {
      alert('Preencha os campos obrigatórios: Órgão e Assunto')
      return
    }
    onSalvar({ ...form, coluna: 'sinalizado' })
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 'var(--radius-lg)',
        width: 520, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Novo Atendimento
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              Registre uma nova demanda recebida.
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%',
            border: '1px solid var(--border)', background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18,
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* Preview empresa */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: cor.bg,
            borderRadius: 'var(--radius-sm)', marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: cor.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: cor.color }}>
              {form.empresa}
            </span>
            <span style={{ fontSize: 12, color: cor.color, opacity: 0.7, marginLeft: 2 }}>
              · Atendimento sendo registrado para esta empresa
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Empresa *</label>
              <select style={inputStyle} value={form.empresa} onChange={e => set('empresa', e.target.value)}>
                <option>EGC</option><option>GWC</option><option>SEGINFO</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Canal *</label>
              <select style={inputStyle} value={form.canal} onChange={e => set('canal', e.target.value)}>
                <option value="email">E-mail</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Órgão *</label>
              <input
                style={inputStyle} value={form.orgao}
                onChange={e => set('orgao', e.target.value)}
                placeholder="Digite ou selecione o órgão"
                list="orgaos-list"
              />
              <datalist id="orgaos-list">
                {orgaos.map(o => <option key={o._id} value={o.nome} />)}
              </datalist>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Assunto *</label>
              <input style={inputStyle} value={form.assunto}
                onChange={e => set('assunto', e.target.value)}
                placeholder="Descreva brevemente o assunto" />
            </div>
            <div>
              <label style={labelStyle}>Prioridade</label>
              <select style={inputStyle} value={form.prioridade} onChange={e => set('prioridade', e.target.value)}>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Observações</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
                value={form.observacoes} onChange={e => set('observacoes', e.target.value)}
                placeholder="Informações adicionais..." />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 18px', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', background: '#ffffff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)',
          }}>Cancelar</button>
          <button onClick={handleSalvar} style={{
            padding: '8px 22px', border: 'none',
            borderRadius: 'var(--radius-sm)', background: 'var(--text)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#ffffff',
          }}>Salvar atendimento</button>
        </div>
      </div>
    </div>
  )
}

function DetalhesModal({ atendimento, onClose, onAtualizar, onExcluir, responsaveis }) {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    empresa: atendimento.empresa,
    orgao: atendimento.orgao,
    canal: atendimento.canal,
    assunto: atendimento.assunto,
    prioridade: atendimento.prioridade,
    observacoes: atendimento.observacoes || '',
    encaminhadoPara: atendimento.encaminhadoPara || '',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const prio  = prioridadeCores[atendimento.prioridade]
  const canal = canalInfo[atendimento.canal] || canalInfo.email
  const emp   = empresaCores[atendimento.empresa] || empresaCores.EGC

  function moverColuna(coluna) { onAtualizar(atendimento._id, { coluna }); onClose() }
  function encaminhar(para) { onAtualizar(atendimento._id, { coluna: 'encaminhado', encaminhadoPara: para }); onClose() }
  function handleSalvar() { onAtualizar(atendimento._id, { ...form }); setEditando(false); onClose() }
  function handleExcluir() {
    if (window.confirm('Excluir este atendimento?')) { onExcluir(atendimento._id); onClose() }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 'var(--radius-lg)',
        width: 520, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3 }}>
              {atendimento.orgao}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>
              {atendimento.assunto}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
            <button onClick={() => setEditando(!editando)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              background: editando ? 'var(--primary)' : 'var(--surface)',
              color: editando ? '#fff' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <Pencil size={12} />{editando ? 'Cancelar' : 'Editar'}
            </button>
            <button onClick={handleExcluir} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
              color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <Trash2 size={12} />Excluir
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
              <div>
                <label style={labelStyle}>Empresa</label>
                <select style={inputStyle} value={form.empresa} onChange={e => set('empresa', e.target.value)}>
                  <option>EGC</option><option>GWC</option><option>SEGINFO</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Canal</label>
                <select style={inputStyle} value={form.canal} onChange={e => set('canal', e.target.value)}>
                  <option value="email">E-mail</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Órgão</label>
                <input style={inputStyle} value={form.orgao} onChange={e => set('orgao', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Assunto</label>
                <input style={inputStyle} value={form.assunto} onChange={e => set('assunto', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Prioridade</label>
                <select style={inputStyle} value={form.prioridade} onChange={e => set('prioridade', e.target.value)}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Observações</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
                  value={form.observacoes} onChange={e => set('observacoes', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSalvar} style={btnAcao('var(--primary)')}>
                  Salvar alterações
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)', background: emp.bg, color: emp.color,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: emp.color }} />
                  {atendimento.empresa}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)', background: canal.bg, color: canal.color,
                }}>
                  <canal.Icon size={11} />
                  {canal.label}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)', background: prio.bg, color: prio.color,
                }}>
                  {prio.label}
                </span>
              </div>

              {/* Dados */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={labelStyle}>Órgão</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{atendimento.orgao}</div>
                </div>
                <div>
                  <div style={labelStyle}>Data</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>
                    {new Date(atendimento.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Status</div>
                  <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize', color: 'var(--text)' }}>
                    {atendimento.coluna}
                  </div>
                </div>
                {atendimento.encaminhadoPara && (
                  <div>
                    <div style={labelStyle}>Encaminhado para</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {atendimento.encaminhadoPara}
                    </div>
                  </div>
                )}
                {atendimento.observacoes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={labelStyle}>Observações</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                      {atendimento.observacoes}
                    </div>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em' }}>
                  AÇÕES
                </div>
                {atendimento.coluna === 'sinalizado' && (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>
                        Encaminhar para:
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {responsaveis.map(r => (
                          <button key={r} onClick={() => encaminhar(r)} style={btnAcao('#2563eb')}>
                            <UserCheck size={12} />{r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => moverColuna('resolvido')} style={btnAcao('#059669')}>
                      <CheckCircle size={13} /> Marcar Resolvido
                    </button>
                  </>
                )}
                {atendimento.coluna === 'encaminhado' && (
                  <button onClick={() => moverColuna('resolvido')} style={btnAcao('#059669')}>
                    <CheckCircle size={13} /> Marcar Resolvido
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AtendimentoCard({ atendimento, onAtualizar, onExcluir, responsaveis }) {
  const [detalhes, setDetalhes] = useState(false)
  const prio  = prioridadeCores[atendimento.prioridade]
  const canal = canalInfo[atendimento.canal] || canalInfo.email
  const emp   = empresaCores[atendimento.empresa] || empresaCores.EGC

  return (
    <>
      <div
        onClick={() => setDetalhes(true)}
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          marginBottom: 8,
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${prio.color}`,
          boxShadow: 'var(--shadow-card)',
          transition: 'box-shadow 0.15s, border-color 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.borderColor = `${prio.color}88`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)'
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.borderLeftColor = prio.color
        }}
      >
        {/* Linha 1: canal + empresa + prioridade */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 10, fontWeight: 600, padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            background: canal.bg, color: canal.color,
          }}>
            <canal.Icon size={9} strokeWidth={2} />
            {canal.label}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 10, fontWeight: 600, padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            background: emp.bg, color: emp.color,
          }}>
            {atendimento.empresa}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            background: prio.bg, color: prio.color,
            marginLeft: 'auto',
          }}>
            {prio.label}
          </span>
        </div>

        {/* Órgão */}
        <div className="truncate" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
          {atendimento.orgao}
        </div>

        {/* Assunto */}
        <div className="truncate" style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
          {atendimento.assunto}
        </div>

        {/* Footer: data + botão info */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid var(--border)', paddingTop: 8,
        }}>
          <span style={{ fontSize: 10, color: 'var(--text-light)' }}>
            {new Date(atendimento.createdAt).toLocaleDateString('pt-BR')}
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
        <DetalhesModal
          atendimento={atendimento}
          onClose={() => setDetalhes(false)}
          onAtualizar={onAtualizar}
          onExcluir={onExcluir}
          responsaveis={responsaveis}
        />
      )}
    </>
  )
}

function Coluna({ col, cards, onAtualizar, onExcluir, responsaveis }) {
  const [pagina, setPagina] = useState(1)
  const ordenados = [...cards].sort((a, b) => {
    const prioOrdem = { alta: 0, media: 1, baixa: 2 }
    return prioOrdem[a.prioridade] - prioOrdem[b.prioridade] ||
      new Date(b.createdAt) - new Date(a.createdAt)
  })
  const visiveis = ordenados.slice(0, pagina * POR_PAGINA)
  const temMais  = cards.length > visiveis.length

  return (
    <div style={{
      flex: 1,
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      background: '#ffffff',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      minHeight: 200,
    }}>
      {/* Header */}
      <div style={{
        background: col.headerBg,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: col.color + '22', color: col.color,
          borderRadius: 'var(--radius-pill)', padding: '1px 8px',
        }}>
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, padding: '10px 10px 4px' }}>
        {visiveis.map(at => (
          <AtendimentoCard
            key={at._id}
            atendimento={at}
            onAtualizar={onAtualizar}
            onExcluir={onExcluir}
            responsaveis={responsaveis}
          />
        ))}
        {cards.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '28px 0' }}>
            Nenhum atendimento
          </div>
        )}
        {temMais && (
          <button
            onClick={() => setPagina(p => p + 1)}
            style={{
              width: '100%', padding: '7px',
              border: '1px dashed var(--border-hover)',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent', color: 'var(--text-muted)',
              fontSize: 12, fontWeight: 500, cursor: 'pointer', marginBottom: 8,
              transition: 'all 0.15s',
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

export default function Atendimento() {
  const [atendimentos, setAtendimentos] = useState([])
  const [orgaos, setOrgaos]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [abaAtiva, setAbaAtiva]         = useState('EGC')
  const [modalAberto, setModalAberto]   = useState(false)
  const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || JSON.stringify(RESPONSAVEIS_DEFAULT))

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const [resAt, resOrg] = await Promise.all([
        atendimentoService.listar(),
        orgaoService.listar(),
      ])
      setAtendimentos(resAt.data)
      setOrgaos(resOrg.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function atualizar(id, dados) {
    try {
      const res = await atendimentoService.atualizar(id, dados)
      setAtendimentos(prev => prev.map(a => a._id === id ? res.data : a))
    } catch (err) { console.error(err) }
  }

  async function excluir(id) {
    try {
      await atendimentoService.deletar(id)
      setAtendimentos(prev => prev.filter(a => a._id !== id))
    } catch (err) { console.error(err) }
  }

  async function handleNovo(dados) {
    try {
      const res = await atendimentoService.criar(dados)
      setAtendimentos(prev => [res.data, ...prev])
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data?.error || err.message))
    }
  }

  const filtrados = atendimentos.filter(a => a.empresa === abaAtiva)

  // Contadores para os cards de resumo
  const alta    = filtrados.filter(a => a.prioridade === 'alta' && a.coluna !== 'resolvido').length
  const pendentes = filtrados.filter(a => a.coluna !== 'resolvido').length

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: 320, gap: 12, color: 'var(--text-muted)',
    }}>
      <Loader2 size={28} strokeWidth={1.5}
        style={{ animation: 'spin 0.8s linear infinite', opacity: 0.5 }} />
      <span style={{ fontSize: 13 }}>Carregando atendimentos...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="page-wrap">
      {/* Page header ERP */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <MessageSquare size={15} color="var(--primary)" strokeWidth={2} />
          </div>
          <div>
            <div className="page-header-title">Atendimento</div>
            <div className="page-header-subtitle">Demandas recebidas por e-mail e WhatsApp</div>
          </div>
        </div>
        <div className="page-header-actions">
          {[
            { label: 'Pendentes', val: pendentes, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Alta prioridade', val: alta, color: '#ef4444', bg: '#fef2f2' },
          ].map(({ label, val, color, bg }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', background: bg,
              borderRadius: 'var(--radius-pill)',
              fontSize: 11, fontWeight: 600, color,
            }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>{val}</span>
              <span style={{ fontWeight: 500, opacity: 0.8 }}>{label}</span>
            </div>
          ))}
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            <Plus size={13} strokeWidth={2.5} />
            Novo Atendimento
          </button>
        </div>
      </div>

      <div className="page-body">

      {/* Abas empresa */}
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
            {abaAtiva === emp && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: empresaCores[emp].color }} />
            )}
            {emp}
          </button>
        ))}
      </div>

      {/* Colunas */}
      <div style={{ display: 'flex', gap: 12 }}>
        {COLUNAS.map(col => (
          <Coluna
            key={col.id}
            col={col}
            cards={filtrados.filter(a => a.coluna === col.id)}
            onAtualizar={atualizar}
            onExcluir={excluir}
            responsaveis={responsaveis}
          />
        ))}
      </div>

      {modalAberto && (
        <NovoAtendimentoModal
          onClose={() => setModalAberto(false)}
          onSalvar={handleNovo}
          orgaos={orgaos}
          responsaveis={responsaveis}
        />
      )}
      </div>{/* /page-body */}
    </div>
  )
}