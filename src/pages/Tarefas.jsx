import { useState, useEffect } from 'react'
import { Plus, X, Check, AlertTriangle, ExternalLink, Eye, EyeOff, CheckSquare, Bell, Zap, GitBranch, Pencil, Trash2 } from 'lucide-react'

const TAREFAS_KEY = 'tarefas_sistema'
const CREDENCIAIS_KEY = 'credenciais_acesso'

const PRIORIDADES = [
  { key: 'baixa',    label: 'Baixa',    color: '#059669', bg: '#ecfdf5' },
  { key: 'media',    label: 'Média',    color: '#d97706', bg: '#fffbeb' },
  { key: 'alta',     label: 'Alta',     color: '#ef4444', bg: '#fef2f2' },
  { key: 'urgente',  label: 'Urgente',  color: '#7c3aed', bg: '#f5f3ff' },
]

const TIPOS = ['Entrega', 'Cobrança', 'Documento', 'Interno', 'Outro']
const EMPRESAS = ['EGC', 'GWC', 'SEGINFO']

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#ecfdf5' },
  SEGINFO: { color: '#7c3aed', bg: '#f5f3ff' },
}

const COLUNAS = [
  { id: 'afazer',   label: 'A Fazer',  color: '#2563eb', headerBg: '#eff6ff' },
  { id: 'pendente', label: 'Pendente', color: '#d97706', headerBg: '#fffbeb' },
  { id: 'resolvido',label: 'Resolvido',color: '#059669', headerBg: '#ecfdf5' },
]

const inputStyle = {
  width: '100%', padding: '8px 10px',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
  fontSize: 13, outline: 'none', background: '#fff', color: 'var(--text)',
}

const labelStyle = {
  fontSize: 11, color: 'var(--text-muted)', marginBottom: 4,
  display: 'block', fontWeight: 500, letterSpacing: '0.02em',
}

function tarefaVazia() {
  return {
    id: Date.now().toString(),
    nome: '', quemSolicitou: '', descricao: '',
    prioridade: 'media', empresa: '', orgao: '', ticket: '',
    nf: '', tipo: '', prazo: '', observacoes: '',
    recorrente: false, coluna: 'afazer',
    aQuemRecorrer: '', motivoDuvida: '',
    criadoEm: new Date().toISOString(),
  }
}

function NovaeTarefaModal({ onClose, onSalvar, responsaveis, tarefaInicial }) {
  const [form, setForm] = useState(tarefaInicial || tarefaVazia())
  const set = (f, v) => setForm(x => ({ ...x, [f]: v }))

  function handleSalvar() {
    if (!form.nome.trim()) { alert('Digite o nome da tarefa'); return }
    onSalvar(form)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: 620, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{tarefaInicial ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Preencha os dados da tarefa</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}>×</button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Nome */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nome da tarefa *</label>
              <input style={inputStyle} placeholder="Ex: Enviar NF para Prefeitura de Recife" value={form.nome} onChange={e => set('nome', e.target.value)} autoFocus />
            </div>

            {/* Quem solicitou */}
            <div>
              <label style={labelStyle}>Quem solicitou</label>
              <select style={inputStyle} value={form.quemSolicitou} onChange={e => set('quemSolicitou', e.target.value)}>
                <option value="">Selecione...</option>
                {responsaveis.map(r => <option key={r.id} value={r.nome}>{r.nome}</option>)}
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label style={labelStyle}>Prioridade</label>
              <select style={inputStyle} value={form.prioridade} onChange={e => set('prioridade', e.target.value)}>
                {PRIORIDADES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>

            {/* Empresa */}
            <div>
              <label style={labelStyle}>Empresa</label>
              <select style={inputStyle} value={form.empresa} onChange={e => set('empresa', e.target.value)}>
                <option value="">Selecione...</option>
                {EMPRESAS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label style={labelStyle}>Tipo</label>
              <select style={inputStyle} value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                <option value="">Selecione...</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Órgão */}
            <div>
              <label style={labelStyle}>Órgão</label>
              <input style={inputStyle} placeholder="Nome do órgão" value={form.orgao} onChange={e => set('orgao', e.target.value)} />
            </div>

            {/* Prazo */}
            <div>
              <label style={labelStyle}>Prazo</label>
              <input style={inputStyle} type="date" value={form.prazo} onChange={e => set('prazo', e.target.value)} />
            </div>

            {/* Ticket */}
            <div>
              <label style={labelStyle}>Ticket</label>
              <input style={inputStyle} placeholder="Ex: 202504001" value={form.ticket} onChange={e => set('ticket', e.target.value)} />
            </div>

            {/* NF */}
            <div>
              <label style={labelStyle}>Nota Fiscal</label>
              <input style={inputStyle} placeholder="Nº da NF" value={form.nf} onChange={e => set('nf', e.target.value)} />
            </div>

            {/* Recorrente */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => set('recorrente', !form.recorrente)}
                style={{
                  width: 36, height: 20, borderRadius: 'var(--radius-pill)',
                  background: form.recorrente ? 'var(--primary)' : '#e5e7eb',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2,
                  left: form.recorrente ? 18 : 2,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tarefa recorrente</span>
            </div>

            {/* Descrição */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descrição</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} placeholder="Detalhes da tarefa..." value={form.descricao} onChange={e => set('descricao', e.target.value)} />
            </div>

            {/* Observações */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Observações</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 52 }} placeholder="Anotações adicionais..." value={form.observacoes} onChange={e => set('observacoes', e.target.value)} />
            </div>

            {/* Se pendente */}
            {form.coluna === 'pendente' && (
              <>
                <div>
                  <label style={labelStyle}>A quem recorrer</label>
                  <select style={inputStyle} value={form.aQuemRecorrer} onChange={e => set('aQuemRecorrer', e.target.value)}>
                    <option value="">Selecione...</option>
                    {responsaveis.map(r => <option key={r.id} value={r.nome}>{r.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Motivo da dúvida</label>
                  <input style={inputStyle} placeholder="Qual é a dúvida?" value={form.motivoDuvida} onChange={e => set('motivoDuvida', e.target.value)} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)' }}>
            Cancelar
          </button>
          <button onClick={handleSalvar} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 22px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff' }}>
            {tarefaInicial ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TarefaCard({ tarefa, onMover, onEditar, onExcluir, responsaveis }) {
  const prio = PRIORIDADES.find(p => p.key === tarefa.prioridade) || PRIORIDADES[1]
  const emp = tarefa.empresa ? empresaCores[tarefa.empresa] : null
  const vencida = tarefa.prazo && new Date(tarefa.prazo) < new Date() && tarefa.coluna !== 'resolvido'

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)',
      padding: '12px 14px', marginBottom: 8,
      border: `1px solid ${vencida ? '#fecaca' : 'var(--border)'}`,
      boxShadow: 'var(--shadow-card)', cursor: 'pointer',
      borderLeft: `3px solid ${prio.color}`,
    }}>
      {/* Header card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, flex: 1, marginRight: 8 }}>{tarefa.nome}</span>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={() => onEditar(tarefa)} style={{ width: 22, height: 22, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Pencil size={10} />
          </button>
          <button onClick={() => onExcluir(tarefa.id)} style={{ width: 22, height: 22, border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: prio.bg, color: prio.color }}>{prio.label}</span>
        {emp && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: emp.bg, color: emp.color }}>{tarefa.empresa}</span>}
        {tarefa.tipo && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: '#f1f5f9', color: '#64748b' }}>{tarefa.tipo}</span>}
        {tarefa.recorrente && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: '#f0fdf4', color: '#16a34a' }}>🔁 Recorrente</span>}
      </div>

      {/* Infos */}
      {tarefa.ticket && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>🎫 Ticket: <strong>{tarefa.ticket}</strong></div>}
      {tarefa.nf && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>🧾 NF: <strong>{tarefa.nf}</strong></div>}
      {tarefa.quemSolicitou && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>👤 {tarefa.quemSolicitou}</div>}
      {tarefa.coluna === 'pendente' && tarefa.aQuemRecorrer && (
        <div style={{ fontSize: 11, color: '#d97706', marginBottom: 3, fontWeight: 500 }}>❓ Recorrer: {tarefa.aQuemRecorrer}</div>
      )}

      {/* Prazo */}
      {tarefa.prazo && (
        <div style={{ fontSize: 11, fontWeight: 600, color: vencida ? '#ef4444' : 'var(--text-muted)', marginBottom: 8 }}>
          {vencida ? '⚠️' : '📅'} {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
          {vencida && ' — VENCIDA'}
        </div>
      )}

      {/* Ações mover */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {tarefa.coluna !== 'afazer' && (
          <button onClick={() => onMover(tarefa.id, 'afazer')} style={{ fontSize: 10, padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', background: '#fff', color: 'var(--text-muted)', cursor: 'pointer' }}>
            → A Fazer
          </button>
        )}
        {tarefa.coluna !== 'pendente' && (
          <button onClick={() => onMover(tarefa.id, 'pendente')} style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #fed7aa', borderRadius: 'var(--radius-pill)', background: '#fff7ed', color: '#d97706', cursor: 'pointer' }}>
            → Pendente
          </button>
        )}
        {tarefa.coluna !== 'resolvido' && (
          <button onClick={() => onMover(tarefa.id, 'resolvido')} style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-pill)', background: '#ecfdf5', color: '#059669', cursor: 'pointer' }}>
            ✓ Resolvido
          </button>
        )}
      </div>
    </div>
  )
}

// ── ABA: Kanban ──────────────────────────────────────────
function AbaKanban({ tarefas, onAtualizar, responsaveis }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)

  function salvarTarefa(tarefa) {
    const lista = tarefas.find(t => t.id === tarefa.id)
      ? tarefas.map(t => t.id === tarefa.id ? tarefa : t)
      : [...tarefas, tarefa]
    onAtualizar(lista)
  }

  function mover(id, coluna) {
    onAtualizar(tarefas.map(t => t.id === id ? { ...t, coluna } : t))
  }

  function excluir(id) {
    if (window.confirm('Excluir tarefa?')) onAtualizar(tarefas.filter(t => t.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => { setEditando(null); setModalAberto(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Nova Tarefa
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {COLUNAS.map(col => {
          const cards = tarefas.filter(t => t.coluna === col.id)
          return (
            <div key={col.id} style={{ background: '#f8f9fb', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ background: col.headerBg, padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: col.color + '22', color: col.color, borderRadius: 'var(--radius-pill)', padding: '1px 8px' }}>{cards.length}</span>
              </div>
              <div style={{ padding: '10px' }}>
                {cards.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '24px 0' }}>Nenhuma tarefa</div>}
                {cards.map(t => (
                  <TarefaCard key={t.id} tarefa={t} onMover={mover} onEditar={t => { setEditando(t); setModalAberto(true) }} onExcluir={excluir} responsaveis={responsaveis} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {modalAberto && (
        <NovaeTarefaModal
          onClose={() => { setModalAberto(false); setEditando(null) }}
          onSalvar={salvarTarefa}
          responsaveis={responsaveis}
          tarefaInicial={editando}
        />
      )}
    </div>
  )
}

// ── ABA: Alertas ─────────────────────────────────────────
function AbaAlertas({ tarefas, empenhos, prazos }) {
  const hoje = new Date()

  const tarefasVencidas = tarefas.filter(t =>
    t.prazo && new Date(t.prazo) < hoje && t.coluna !== 'resolvido'
  ).sort((a, b) => new Date(a.prazo) - new Date(b.prazo))

  const solicVencidas = empenhos.filter(e => {
    if (e.modulo !== 'solicitacoes' || e.colunasolicitacao !== 'enviada') return false
    if (!e.dataSolicitacao) return false
    const dias = Math.floor((hoje - new Date(e.dataSolicitacao)) / 86400000)
    const prazo = prazos?.[e.tipoSolicitacao] ?? 7
    return dias > prazo
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tarefas vencidas */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={16} color="#ef4444" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>Tarefas Vencidas</span>
          <span style={{ fontSize: 12, fontWeight: 700, background: '#fecaca', color: '#ef4444', borderRadius: 'var(--radius-pill)', padding: '1px 8px' }}>{tarefasVencidas.length}</span>
        </div>
        <div style={{ padding: '12px 20px' }}>
          {tarefasVencidas.length === 0
            ? <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '16px 0' }}>✓ Nenhuma tarefa vencida</div>
            : tarefasVencidas.map(t => {
                const dias = Math.floor((hoje - new Date(t.prazo)) / 86400000)
                return (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t.nome}</div>
                      <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>Venceu em {new Date(t.prazo).toLocaleDateString('pt-BR')} · {dias} dia{dias !== 1 ? 's' : ''} atrás</div>
                    </div>
                    {t.empresa && <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: empresaCores[t.empresa]?.bg, color: empresaCores[t.empresa]?.color }}>{t.empresa}</span>}
                  </div>
                )
              })
          }
        </div>
      </div>

      {/* Solicitações vencidas */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: '#fffbeb', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={16} color="#d97706" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>Solicitações com Prazo Excedido</span>
          <span style={{ fontSize: 12, fontWeight: 700, background: '#fed7aa', color: '#d97706', borderRadius: 'var(--radius-pill)', padding: '1px 8px' }}>{solicVencidas.length}</span>
        </div>
        <div style={{ padding: '12px 20px' }}>
          {solicVencidas.length === 0
            ? <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '16px 0' }}>✓ Nenhuma solicitação com prazo excedido</div>
            : solicVencidas.map(e => {
                const dias = Math.floor((hoje - new Date(e.dataSolicitacao)) / 86400000)
                const prazo = prazos?.[e.tipoSolicitacao] ?? 7
                return (
                  <div key={e._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fffdf0', border: '1px solid #fed7aa', borderRadius: 'var(--radius-sm)', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{e.orgao}</div>
                      <div style={{ fontSize: 11, color: '#d97706', marginTop: 2 }}>#{e.ticket} · {dias} dias sem resposta (prazo: {prazo}d)</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: '#fff7ed', color: '#c2410c' }}>{e.tipoSolicitacao?.toUpperCase()}</span>
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

// ── ABA: Acesso Rápido ───────────────────────────────────
function AbaAcessoRapido() {
  const [creds, setCreds] = useState(() => {
    const s = localStorage.getItem(CREDENCIAIS_KEY)
    return s ? JSON.parse(s) : {
      totalExpress: { url: 'https://www.totalexpress.com.br', login: '', senha: '' },
      brasspress:   { url: 'https://www.brasspress.com.br', login: '', senha: '' },
      sige:         { url: 'https://app.sigecloud.com.br', login: '', senha: '' },
    }
  })
  const [mostrarSenha, setMostrarSenha] = useState({})
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({})

  function salvar() {
    localStorage.setItem(CREDENCIAIS_KEY, JSON.stringify(creds))
    setEditando(null)
  }

  function iniciarEdicao(key) {
    setEditando(key)
    setForm({ ...creds[key] })
  }

  function confirmarEdicao() {
    setCreds(c => ({ ...c, [editando]: form }))
    localStorage.setItem(CREDENCIAIS_KEY, JSON.stringify({ ...creds, [editando]: form }))
    setEditando(null)
  }

  const sistemas = [
    { key: 'totalExpress', nome: 'Total Express', cor: '#e53e3e', bg: '#fff5f5', emoji: '🚚' },
    { key: 'brasspress',   nome: 'Brasspress',    cor: '#d97706', bg: '#fffbeb', emoji: '📦' },
    { key: 'sige',         nome: 'SIGE Cloud',    cor: '#7c3aed', bg: '#f5f3ff', emoji: '☁️' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {sistemas.map(({ key, nome, cor, bg, emoji }) => (
        <div key={key} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '14px 16px', background: bg, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: cor }}>{nome}</span>
          </div>
          <div style={{ padding: '16px' }}>
            {editando === key ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div><label style={labelStyle}>URL</label><input style={inputStyle} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
                <div><label style={labelStyle}>Login</label><input style={inputStyle} value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))} /></div>
                <div><label style={labelStyle}>Senha</label><input style={inputStyle} type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} /></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={confirmarEdicao} style={{ flex: 1, padding: '7px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <Check size={12} /> Salvar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ padding: '7px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {creds[key].login && (
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Login</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{creds[key].login || '—'}</div>
                  </div>
                )}
                {creds[key].senha && (
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Senha</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: 'monospace' }}>
                        {mostrarSenha[key] ? creds[key].senha : '••••••••'}
                      </span>
                      <button onClick={() => setMostrarSenha(m => ({ ...m, [key]: !m[key] }))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        {mostrarSenha[key] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <a href={creds[key].url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: cor, color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    <ExternalLink size={12} /> Acessar
                  </a>
                  <button onClick={() => iniciarEdicao(key)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Pencil size={11} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────
const ABAS = [
  { id: 'kanban',      label: 'Tarefas',       icon: CheckSquare },
  { id: 'alertas',     label: 'Alertas',        icon: Bell },
  { id: 'acesso',      label: 'Acesso Rápido',  icon: Zap },
  { id: 'fluxograma',  label: 'Fluxograma',     icon: GitBranch },
]

export default function Tarefas() {
  const [abaAtiva, setAbaAtiva] = useState('kanban')
  const [tarefas, setTarefas] = useState(() => {
    const s = localStorage.getItem(TAREFAS_KEY)
    return s ? JSON.parse(s) : []
  })
  const [empenhos, setEmpenhos] = useState([])
  const [prazos, setPrazos] = useState(() => {
    const s = localStorage.getItem('prazos_alerta')
    return s ? JSON.parse(s) : { dispensa: 7, tmm: 10, reequilibrio: 10, atendimento: 5 }
  })
  const [responsaveis] = useState(() => {
    const s = localStorage.getItem('responsaveis')
    return s ? JSON.parse(s) : []
  })

  useEffect(() => {
    fetch('http://localhost:3001/api/empenhos')
      .then(r => r.json())
      .then(data => setEmpenhos(data))
      .catch(() => {})
  }, [])

  function atualizarTarefas(lista) {
    setTarefas(lista)
    localStorage.setItem(TAREFAS_KEY, JSON.stringify(lista))
  }

  const totalAlertas = tarefas.filter(t => t.prazo && new Date(t.prazo) < new Date() && t.coluna !== 'resolvido').length +
    empenhos.filter(e => {
      if (e.modulo !== 'solicitacoes' || e.colunasolicitacao !== 'enviada' || !e.dataSolicitacao) return false
      const dias = Math.floor((Date.now() - new Date(e.dataSolicitacao)) / 86400000)
      return dias > (prazos?.[e.tipoSolicitacao] ?? 7)
    }).length

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <CheckSquare size={15} color="var(--primary)" strokeWidth={2} />
          </div>
          <div>
            <div className="page-header-title">Tarefas</div>
            <div className="page-header-subtitle">Central do dia — tarefas, alertas e acesso rápido</div>
          </div>
        </div>
        <div className="page-header-actions">
          {totalAlertas > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#fef2f2', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 600, color: '#ef4444' }}>
              <Bell size={12} />
              {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className="page-body">
        {/* Abas */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {ABAS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setAbaAtiva(id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: 'none',
              borderBottom: abaAtiva === id ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'transparent',
              color: abaAtiva === id ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: abaAtiva === id ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s', marginBottom: -1,
            }}>
              <Icon size={13} />
              {label}
              {id === 'alertas' && totalAlertas > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, background: '#ef4444', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '1px 6px', marginLeft: 2 }}>
                  {totalAlertas}
                </span>
              )}
            </button>
          ))}
        </div>

        {abaAtiva === 'kanban'     && <AbaKanban tarefas={tarefas} onAtualizar={atualizarTarefas} responsaveis={responsaveis} />}
        {abaAtiva === 'alertas'    && <AbaAlertas tarefas={tarefas} empenhos={empenhos} prazos={prazos} />}
        {abaAtiva === 'acesso'     && <AbaAcessoRapido />}
        {abaAtiva === 'fluxograma' && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <iframe src="/fluxograma" style={{ width: '100%', height: '70vh', border: 'none', borderRadius: 'var(--radius-sm)' }} title="Fluxograma" />
          </div>
        )}
      </div>
    </div>
  )
}