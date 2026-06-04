import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Check, X, Bell, Users, ChevronDown, ChevronUp, Settings, Package, Tag, Building2, FileText, ToggleLeft, ToggleRight, Search } from 'lucide-react'
import { produtoService, marcaService } from '../services/api'

const RESPONSAVEIS_KEY = 'responsaveis'
const PRAZOS_KEY = 'prazos_alerta'
const EMPRESAS_KEY = 'empresas'
const TIPOS_SOLIC_KEY = 'tipos_solicitacao'

const PRAZOS_DEFAULT = {
  dispensa: 7, tmm: 10, reequilibrio: 10, atendimento: 5,
}

const CORES_DISPONIVEIS = [
  { nome: 'Laranja', color: '#f97316', bg: '#fff7ed' },
  { nome: 'Azul',    color: '#2563eb', bg: '#eff6ff' },
  { nome: 'Roxo',    color: '#7c3aed', bg: '#faf5ff' },
  { nome: 'Verde',   color: '#059669', bg: '#ecfdf5' },
  { nome: 'Âmbar',   color: '#d97706', bg: '#fffbeb' },
  { nome: 'Cinza',   color: '#6b7280', bg: '#f9fafb' },
  { nome: 'Rosa',    color: '#db2777', bg: '#fdf2f8' },
  { nome: 'Ciano',   color: '#0891b2', bg: '#ecfeff' },
  { nome: 'Vermelho',color: '#ef4444', bg: '#fef2f2' },
]

const RESPONSAVEIS_DEFAULT = [
  { id: '1', nome: 'Claybson', color: '#f97316', bg: '#fff7ed' },
  { id: '2', nome: 'Ingridy',  color: '#2563eb', bg: '#eff6ff' },
  { id: '3', nome: 'Amanda',   color: '#7c3aed', bg: '#faf5ff' },
  { id: '4', nome: 'Everson',  color: '#059669', bg: '#ecfdf5' },
  { id: '5', nome: 'Mariana',  color: '#d97706', bg: '#fffbeb' },
]

const EMPRESAS_DEFAULT = [
  { id: '1', nome: 'EGC',     cnpj: '31.768.037/0001-98', color: '#2563eb', bg: '#eff6ff' },
  { id: '2', nome: 'GWC',     cnpj: '49.329.140/0001-05', color: '#059669', bg: '#ecfdf5' },
  { id: '3', nome: 'SEGINFO', cnpj: '05.807.475/0001-08', color: '#7c3aed', bg: '#f5f3ff' },
]

const TIPOS_SOLIC_DEFAULT = [
  { id: '1', nome: 'Dispensa',     color: '#a16207', bg: '#fefce8', campos: ['justificativa', 'valor'] },
  { id: '2', nome: 'TMM',          color: '#c2410c', bg: '#fff7ed', campos: ['marcaAtual', 'marcaSubstituta', 'itens'] },
  { id: '3', nome: 'Reequilíbrio', color: '#7e22ce', bg: '#faf5ff', campos: ['valor', 'justificativa', 'itens'] },
]

const CAMPOS_DISPONIVEIS = [
  { key: 'marcaAtual',      label: 'Marca Atual' },
  { key: 'marcaSubstituta', label: 'Marca Substituta' },
  { key: 'justificativa',   label: 'Justificativa' },
  { key: 'valor',           label: 'Valor Solicitado' },
  { key: 'itens',           label: 'Itens Envolvidos' },
  { key: 'dataPrazo',       label: 'Data Prazo' },
  { key: 'anexo',           label: 'Anexo/Documento' },
]

const PRAZOS_INFO = [
  { key: 'dispensa',     label: 'Dispensa',    cor: '#a16207', desc: 'Solicitações de dispensa sem retorno' },
  { key: 'tmm',          label: 'TMM',         cor: '#c2410c', desc: 'Solicitações TMM sem retorno' },
  { key: 'reequilibrio', label: 'Reequilíbrio',cor: '#7e22ce', desc: 'Solicitações de reequilíbrio sem retorno' },
  { key: 'atendimento',  label: 'Atendimento', cor: '#2563eb', desc: 'Atendimentos encaminhados sem resolução' },
]

const inputStyle = {
  width: '100%', padding: '8px 10px',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
  fontSize: 13, outline: 'none', background: '#ffffff', color: 'var(--text)',
}

const labelStyle = {
  fontSize: 11, color: 'var(--text-muted)', marginBottom: 4,
  display: 'block', fontWeight: 500, letterSpacing: '0.02em',
}

function SeletorCores({ corAtual, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {CORES_DISPONIVEIS.map(cor => (
        <button key={cor.nome} title={cor.nome} onClick={() => onChange(cor)} style={{
          width: 22, height: 22, borderRadius: '50%', background: cor.color,
          cursor: 'pointer', padding: 0,
          border: corAtual === cor.color ? '3px solid var(--text)' : '2px solid #fff',
          boxShadow: '0 0 0 1px var(--border)', transition: 'transform 0.1s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      ))}
    </div>
  )
}

function SecaoHeader({ icon: Icon, iconColor, iconBg, titulo, subtitulo, botao }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 20px', borderBottom: '1px solid var(--border)', background: '#f9fafb',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={iconColor} strokeWidth={1.5} />
        </div>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{titulo}</h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{subtitulo}</p>
        </div>
      </div>
      {botao}
    </div>
  )
}

// ── ABA: Responsáveis ──────────────────────────────────────
function AbaResponsaveis() {
  const [responsaveis, setResponsaveis] = useState(() => {
    const s = localStorage.getItem(RESPONSAVEIS_KEY)
    return s ? JSON.parse(s) : RESPONSAVEIS_DEFAULT
  })
  const [editando, setEditando] = useState(null)
  const [novo, setNovo] = useState({ nome: '', color: '#6b7280', bg: '#f9fafb' })
  const [adicionando, setAdicionando] = useState(false)

  function salvar(lista) {
    setResponsaveis(lista)
    localStorage.setItem(RESPONSAVEIS_KEY, JSON.stringify(lista))
  }

  function adicionar() {
    if (!novo.nome.trim()) { alert('Digite um nome'); return }
    salvar([...responsaveis, { id: Date.now().toString(), ...novo }])
    setNovo({ nome: '', color: '#6b7280', bg: '#f9fafb' })
    setAdicionando(false)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <SecaoHeader
        icon={Users} iconColor="#2563eb" iconBg="#eff6ff"
        titulo="Responsáveis" subtitulo="Usados no Fluxograma e no módulo de Atendimento"
        botao={
          <button onClick={() => setAdicionando(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Adicionar
          </button>
        }
      />
      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {responsaveis.map(resp => (
          <div key={resp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', gap: 12 }}>
            {editando?.id === resp.id ? (
              <div style={{ display: 'flex', gap: 12, flex: 1, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={labelStyle}>Nome</label>
                  <input style={inputStyle} value={editando.nome} onChange={e => setEditando(r => ({ ...r, nome: e.target.value }))} autoFocus />
                </div>
                <div>
                  <label style={labelStyle}>Cor</label>
                  <SeletorCores corAtual={editando.color} onChange={cor => setEditando(r => ({ ...r, color: cor.color, bg: cor.bg }))} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { salvar(responsaveis.map(r => r.id === editando.id ? editando : r)); setEditando(null) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <Check size={12} /> Salvar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 12px', background: '#fff', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                    <X size={12} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: resp.bg, border: `2px solid ${resp.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: resp.color }}>{resp.nome[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{resp.nome}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: resp.color }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{CORES_DISPONIVEIS.find(c => c.color === resp.color)?.nome || 'Personalizado'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditando({ ...resp })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>
                    <Pencil size={11} /> Editar
                  </button>
                  <button onClick={() => { if (window.confirm('Excluir?')) salvar(responsaveis.filter(r => r.id !== resp.id)) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', background: '#fff', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
                    <Trash2 size={11} /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {adicionando && (
          <div style={{ padding: '16px', background: '#f9fafb', border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Novo Responsável</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={labelStyle}>Nome</label>
                <input style={inputStyle} placeholder="Nome do responsável" value={novo.nome} onChange={e => setNovo(r => ({ ...r, nome: e.target.value }))} autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Cor</label>
                <SeletorCores corAtual={novo.color} onChange={cor => setNovo(r => ({ ...r, color: cor.color, bg: cor.bg }))} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={adicionar} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <Check size={13} /> Adicionar
                </button>
                <button onClick={() => setAdicionando(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#fff', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, cursor: 'pointer' }}>
                  <X size={13} /> Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── ABA: Prazos ────────────────────────────────────────────
function AbaPrazos() {
  const [prazos, setPrazos] = useState(() => {
    const s = localStorage.getItem(PRAZOS_KEY)
    return s ? JSON.parse(s) : PRAZOS_DEFAULT
  })
  const [msg, setMsg] = useState('')

  function salvar(novos) {
    setPrazos(novos)
    localStorage.setItem(PRAZOS_KEY, JSON.stringify(novos))
    setMsg('Salvo!'); setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <SecaoHeader icon={Bell} iconColor="#d97706" iconBg="#fffbeb" titulo="Prazos de Alerta" subtitulo="Número de dias sem retorno para gerar alerta" botao={msg ? <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ {msg}</span> : null} />
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {PRAZOS_INFO.map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.cor }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 14 }}>{item.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button onClick={() => salvar({ ...prazos, [item.key]: Math.max(1, prazos[item.key] - 1) })} style={{ width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronDown size={14} />
              </button>
              <div style={{ textAlign: 'center', minWidth: 44 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: item.cor }}>{prazos[item.key]}</span>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>dias</div>
              </div>
              <button onClick={() => salvar({ ...prazos, [item.key]: prazos[item.key] + 1 })} style={{ width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronUp size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ABA: Produtos ──────────────────────────────────────────
function AbaProdutos() {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [novo, setNovo] = useState('')
  const [adicionando, setAdicionando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    produtoService.listar()
      .then(res => setProdutos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function adicionar() {
    if (!novo.trim()) return
    const res = await produtoService.criar({ nome: novo.trim() })
    setProdutos(p => [...p, res.data])
    setNovo(''); setAdicionando(false)
  }

  async function salvarEdicao(p) {
    const res = await produtoService.atualizar(p._id, { nome: p.nome })
    setProdutos(prev => prev.map(x => x._id === p._id ? res.data : x))
    setEditando(null)
  }

  async function excluir(id) {
    if (!window.confirm('Excluir produto?')) return
    await produtoService.deletar(id)
    setProdutos(prev => prev.filter(x => x._id !== id))
  }

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <SecaoHeader
        icon={Package} iconColor="#0891b2" iconBg="#ecfeff"
        titulo="Produtos" subtitulo="Lista de produtos comercializados pela empresa"
        botao={
          <button onClick={() => setAdicionando(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Adicionar
          </button>
        }
      />
      <div style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
          <Search size={13} color="var(--text-light)" />
          <input style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', width: '100%' }} placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>

        {adicionando && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nome do produto</label>
              <input style={inputStyle} placeholder="Ex: SSD 480GB" value={novo} onChange={e => setNovo(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && adicionar()} />
            </div>
            <button onClick={adicionar} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer', height: 36 }}>
              <Check size={12} /> Salvar
            </button>
            <button onClick={() => { setAdicionando(false); setNovo('') }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#fff', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer', height: 36 }}>
              <X size={12} />
            </button>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Carregando...</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtrados.length === 0 && !loading && <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '24px 0' }}>Nenhum produto cadastrado</div>}
          {filtrados.map(p => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              {editando?._id === p._id ? (
                <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={editando.nome} onChange={e => setEditando(x => ({ ...x, nome: e.target.value }))} autoFocus />
                  <button onClick={() => salvarEdicao(editando)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                    <Check size={11} /> Salvar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={13} color="#0891b2" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.nome}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditando({ ...p })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>
                      <Pencil size={10} /> Editar
                    </button>
                    <button onClick={() => excluir(p._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', background: '#fff', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>
                      <Trash2 size={10} /> Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ABA: Marcas/Modelos ────────────────────────────────────
function AbaMarcas() {
  const [marcas, setMarcas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [adicionando, setAdicionando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [novo, setNovo] = useState({ marca: '', modelo: '', produtoId: '', ativa: true })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([marcaService.listar(), produtoService.listar()])
      .then(([mRes, pRes]) => { setMarcas(mRes.data); setProdutos(pRes.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function adicionar() {
    if (!novo.marca.trim() || !novo.produtoId) { alert('Preencha marca e produto'); return }
    const res = await marcaService.criar(novo)
    setMarcas(m => [...m, res.data])
    setNovo({ marca: '', modelo: '', produtoId: '', ativa: true })
    setAdicionando(false)
  }

  async function toggleAtiva(m) {
    const res = await marcaService.atualizar(m._id, { ativa: !m.ativa })
    setMarcas(prev => prev.map(x => x._id === m._id ? res.data : x))
  }

  async function salvarEdicao() {
    const res = await marcaService.atualizar(editando._id, editando)
    setMarcas(prev => prev.map(x => x._id === editando._id ? res.data : x))
    setEditando(null)
  }

  async function excluir(id) {
    if (!window.confirm('Excluir marca?')) return
    await marcaService.deletar(id)
    setMarcas(prev => prev.filter(x => x._id !== id))
  }

  const filtradas = marcas.filter(m => {
    const prod = produtos.find(p => p._id === m.produtoId)
    return `${m.marca} ${m.modelo} ${prod?.nome || ''}`.toLowerCase().includes(busca.toLowerCase())
  })

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <SecaoHeader
        icon={Tag} iconColor="#db2777" iconBg="#fdf2f8"
        titulo="Marcas / Modelos" subtitulo="Associe marcas e modelos aos produtos cadastrados"
        botao={
          <button onClick={() => setAdicionando(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Adicionar
          </button>
        }
      />
      <div style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
          <Search size={13} color="var(--text-light)" />
          <input style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', width: '100%' }} placeholder="Buscar por marca, modelo ou produto..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>

        {adicionando && (
          <div style={{ padding: '16px', background: '#f9fafb', border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Nova Marca/Modelo</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Produto *</label>
                <select style={inputStyle} value={novo.produtoId} onChange={e => setNovo(n => ({ ...n, produtoId: e.target.value }))}>
                  <option value="">Selecione...</option>
                  {produtos.map(p => <option key={p._id} value={p._id}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Marca *</label>
                <input style={inputStyle} placeholder="Ex: Kingston" value={novo.marca} onChange={e => setNovo(n => ({ ...n, marca: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Modelo</label>
                <input style={inputStyle} placeholder="Ex: A400 480GB" value={novo.modelo} onChange={e => setNovo(n => ({ ...n, modelo: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={adicionar} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Check size={12} /> Salvar
              </button>
              <button onClick={() => setAdicionando(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#fff', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                <X size={12} /> Cancelar
              </button>
            </div>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Carregando...</div>}

        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && !loading && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-light)', padding: '24px' }}>Nenhuma marca cadastrada</td></tr>
              )}
              {filtradas.map(m => {
                const prod = produtos.find(p => p._id === m.produtoId)
                return (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 500 }}>{prod?.nome || '—'}</td>
                    <td>{editando?._id === m._id ? <input style={{ ...inputStyle, width: 140 }} value={editando.marca} onChange={e => setEditando(x => ({ ...x, marca: e.target.value }))} /> : m.marca}</td>
                    <td>{editando?._id === m._id ? <input style={{ ...inputStyle, width: 140 }} value={editando.modelo} onChange={e => setEditando(x => ({ ...x, modelo: e.target.value }))} /> : (m.modelo || '—')}</td>
                    <td>
                      <button onClick={() => toggleAtiva(m)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', border: 'none', borderRadius: 'var(--radius-pill)', background: m.ativa ? '#ecfdf5' : '#f1f5f9', color: m.ativa ? '#059669' : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {m.ativa ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        {m.ativa ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td>
                      {editando?._id === m._id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={salvarEdicao} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 11, cursor: 'pointer' }}>
                            <Check size={10} /> Salvar
                          </button>
                          <button onClick={() => setEditando(null)} style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 8px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 11, cursor: 'pointer' }}>
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setEditando({ ...m })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>
                            <Pencil size={10} /> Editar
                          </button>
                          <button onClick={() => excluir(m._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', background: '#fff', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>
                            <Trash2 size={10} /> Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── ABA: Empresas ──────────────────────────────────────────
function AbaEmpresas() {
  const [empresas, setEmpresas] = useState(() => {
    const s = localStorage.getItem(EMPRESAS_KEY)
    return s ? JSON.parse(s) : EMPRESAS_DEFAULT
  })
  const [adicionando, setAdicionando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [novo, setNovo] = useState({ nome: '', cnpj: '', color: '#6b7280', bg: '#f9fafb' })

  function salvar(lista) {
    setEmpresas(lista)
    localStorage.setItem(EMPRESAS_KEY, JSON.stringify(lista))
  }

  function adicionar() {
    if (!novo.nome.trim()) { alert('Digite o nome da empresa'); return }
    salvar([...empresas, { id: Date.now().toString(), ...novo }])
    setNovo({ nome: '', cnpj: '', color: '#6b7280', bg: '#f9fafb' })
    setAdicionando(false)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <SecaoHeader
        icon={Building2} iconColor="#7c3aed" iconBg="#f5f3ff"
        titulo="Empresas" subtitulo="Empresas do grupo cadastradas no sistema"
        botao={
          <button onClick={() => setAdicionando(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Adicionar
          </button>
        }
      />
      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {adicionando && (
          <div style={{ padding: '16px', background: '#f9fafb', border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Nova Empresa</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div><label style={labelStyle}>Nome *</label><input style={inputStyle} placeholder="Ex: HMA" value={novo.nome} onChange={e => setNovo(n => ({ ...n, nome: e.target.value }))} autoFocus /></div>
              <div><label style={labelStyle}>CNPJ</label><input style={inputStyle} placeholder="00.000.000/0001-00" value={novo.cnpj} onChange={e => setNovo(n => ({ ...n, cnpj: e.target.value }))} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Cor</label><SeletorCores corAtual={novo.color} onChange={cor => setNovo(n => ({ ...n, color: cor.color, bg: cor.bg }))} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={adicionar} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Check size={12} /> Salvar
              </button>
              <button onClick={() => setAdicionando(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#fff', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                <X size={12} /> Cancelar
              </button>
            </div>
          </div>
        )}
        {empresas.map(emp => (
          <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            {editando?.id === emp.id ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, flex: 1, alignItems: 'flex-end' }}>
                <div><label style={labelStyle}>Nome</label><input style={inputStyle} value={editando.nome} onChange={e => setEditando(x => ({ ...x, nome: e.target.value }))} /></div>
                <div><label style={labelStyle}>CNPJ</label><input style={inputStyle} value={editando.cnpj} onChange={e => setEditando(x => ({ ...x, cnpj: e.target.value }))} /></div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { salvar(empresas.map(x => x.id === editando.id ? editando : x)); setEditando(null) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                    <Check size={12} /> Salvar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: emp.bg, border: `2px solid ${emp.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: emp.color }}>{emp.nome.slice(0, 3)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{emp.nome}</div>
                    {emp.cnpj && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.cnpj}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditando({ ...emp })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>
                    <Pencil size={11} /> Editar
                  </button>
                  <button onClick={() => { if (window.confirm('Excluir empresa?')) salvar(empresas.filter(x => x.id !== emp.id)) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', background: '#fff', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
                    <Trash2 size={11} /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ABA: Tipos de Solicitação ──────────────────────────────
function AbaTiposSolicitacao() {
  const [tipos, setTipos] = useState(() => {
    const s = localStorage.getItem(TIPOS_SOLIC_KEY)
    return s ? JSON.parse(s) : TIPOS_SOLIC_DEFAULT
  })
  const [adicionando, setAdicionando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [novo, setNovo] = useState({ nome: '', color: '#6b7280', bg: '#f9fafb', campos: [] })

  function salvar(lista) {
    setTipos(lista)
    localStorage.setItem(TIPOS_SOLIC_KEY, JSON.stringify(lista))
  }

  function toggleCampo(lista, campo) {
    return lista.includes(campo) ? lista.filter(c => c !== campo) : [...lista, campo]
  }

  function adicionar() {
    if (!novo.nome.trim()) { alert('Digite o nome'); return }
    salvar([...tipos, { id: Date.now().toString(), ...novo }])
    setNovo({ nome: '', color: '#6b7280', bg: '#f9fafb', campos: [] })
    setAdicionando(false)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <SecaoHeader
        icon={FileText} iconColor="#d97706" iconBg="#fffbeb"
        titulo="Tipos de Solicitação" subtitulo="Configure os tipos e os campos disponíveis em cada um"
        botao={
          <button onClick={() => setAdicionando(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Adicionar
          </button>
        }
      />
      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {adicionando && (
          <div style={{ padding: '16px', background: '#f9fafb', border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Novo Tipo de Solicitação</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 12 }}>
              <div><label style={labelStyle}>Nome *</label><input style={inputStyle} placeholder="Ex: Rescisão" value={novo.nome} onChange={e => setNovo(n => ({ ...n, nome: e.target.value }))} autoFocus /></div>
              <div><label style={labelStyle}>Cor</label><SeletorCores corAtual={novo.color} onChange={cor => setNovo(n => ({ ...n, color: cor.color, bg: cor.bg }))} /></div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Campos disponíveis</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CAMPOS_DISPONIVEIS.map(c => (
                  <button key={c.key} onClick={() => setNovo(n => ({ ...n, campos: toggleCampo(n.campos, c.key) }))} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid', borderColor: novo.campos.includes(c.key) ? 'var(--primary)' : 'var(--border)', borderRadius: 'var(--radius-pill)', background: novo.campos.includes(c.key) ? 'var(--primary-light)' : '#fff', color: novo.campos.includes(c.key) ? 'var(--primary)' : 'var(--text-muted)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                    {novo.campos.includes(c.key) && <Check size={11} />}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={adicionar} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Check size={12} /> Salvar
              </button>
              <button onClick={() => setAdicionando(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#fff', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                <X size={12} /> Cancelar
              </button>
            </div>
          </div>
        )}

        {tipos.map(tipo => (
          <div key={tipo.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb' }}>
              {editando?.id === tipo.id ? (
                <div style={{ display: 'flex', gap: 10, flex: 1, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 140 }}><label style={labelStyle}>Nome</label><input style={inputStyle} value={editando.nome} onChange={e => setEditando(x => ({ ...x, nome: e.target.value }))} /></div>
                  <div><label style={labelStyle}>Cor</label><SeletorCores corAtual={editando.color} onChange={cor => setEditando(x => ({ ...x, color: cor.color, bg: cor.bg }))} /></div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { salvar(tipos.map(x => x.id === editando.id ? editando : x)); setEditando(null) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                      <Check size={12} /> Salvar
                    </button>
                    <button onClick={() => setEditando(null)} style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: tipo.bg, color: tipo.color, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: tipo.color }} />
                    {tipo.nome}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditando({ ...tipo })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>
                      <Pencil size={10} /> Editar
                    </button>
                    <button onClick={() => { if (window.confirm('Excluir tipo?')) salvar(tipos.filter(x => x.id !== tipo.id)) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', background: '#fff', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>
                      <Trash2 size={10} /> Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: '#fff' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: 8 }}>CAMPOS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {editando?.id === tipo.id ? (
                  CAMPOS_DISPONIVEIS.map(c => (
                    <button key={c.key} onClick={() => setEditando(x => ({ ...x, campos: toggleCampo(x.campos, c.key) }))} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid', borderColor: editando.campos.includes(c.key) ? 'var(--primary)' : 'var(--border)', borderRadius: 'var(--radius-pill)', background: editando.campos.includes(c.key) ? 'var(--primary-light)' : '#f9fafb', color: editando.campos.includes(c.key) ? 'var(--primary)' : 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>
                      {editando.campos.includes(c.key) && <Check size={10} />}
                      {c.label}
                    </button>
                  ))
                ) : (
                  tipo.campos?.length > 0
                    ? tipo.campos.map(c => {
                        const campo = CAMPOS_DISPONIVEIS.find(x => x.key === c)
                        return campo ? (
                          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 'var(--radius-pill)', background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 500 }}>
                            <Check size={9} /> {campo.label}
                          </span>
                        ) : null
                      })
                    : <span style={{ fontSize: 11, color: 'var(--text-light)' }}>Nenhum campo configurado</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────────
const ABAS = [
  { id: 'responsaveis', label: 'Responsáveis',        icon: Users },
  { id: 'prazos',       label: 'Prazos de Alerta',    icon: Bell },
  { id: 'produtos',     label: 'Produtos',             icon: Package },
  { id: 'marcas',       label: 'Marcas / Modelos',    icon: Tag },
  { id: 'empresas',     label: 'Empresas',             icon: Building2 },
  { id: 'tiposSolic',   label: 'Tipos de Solicitação', icon: FileText },
]

export default function Configuracoes() {
  const [abaAtiva, setAbaAtiva] = useState('responsaveis')

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <Settings size={15} color="var(--primary)" strokeWidth={2} />
          </div>
          <div>
            <div className="page-header-title">Configurações</div>
            <div className="page-header-subtitle">Gerencie responsáveis, produtos, empresas e tipos de solicitação</div>
          </div>
        </div>
      </div>

      <div className="page-body">
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
            </button>
          ))}
        </div>

        {abaAtiva === 'responsaveis' && <AbaResponsaveis />}
        {abaAtiva === 'prazos'       && <AbaPrazos />}
        {abaAtiva === 'produtos'     && <AbaProdutos />}
        {abaAtiva === 'marcas'       && <AbaMarcas />}
        {abaAtiva === 'empresas'     && <AbaEmpresas />}
        {abaAtiva === 'tiposSolic'   && <AbaTiposSolicitacao />}
      </div>
    </div>
  )
}