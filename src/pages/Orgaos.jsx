import { useState, useEffect } from 'react'
import { orgaoService } from '../services/api'
import { Building2, Plus, Info, Search, Pencil, Trash2, MapPin, Mail, Phone } from 'lucide-react'

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

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

function OrgaoModal({ orgao, onClose, onSalvar, onExcluir, empenhos }) {
  const [editando, setEditando] = useState(!orgao)
  const [form, setForm] = useState({
    nome:        orgao?.nome        || '',
    municipio:   orgao?.municipio   || '',
    estado:      orgao?.estado      || '',
    emails:      orgao?.emails?.join(', ')    || '',
    telefones:   orgao?.telefones?.join(', ') || '',
    observacoes: orgao?.observacoes || '',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  function handleSalvar() {
    if (!form.nome) { alert('Nome é obrigatório'); return }
    onSalvar({
      ...form,
      emails:    form.emails.split(',').map(e => e.trim()).filter(Boolean),
      telefones: form.telefones.split(',').map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  function handleExcluir() {
    if (window.confirm(`Excluir o órgão "${orgao.nome}"?`)) {
      onExcluir(orgao._id)
      onClose()
    }
  }

  const valorTotal = empenhos?.reduce((acc, e) => acc + (e.valor || 0), 0) || 0

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        width: 580,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 'var(--radius-sm)',
              background: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Building2 size={18} color="#2563eb" strokeWidth={1.5} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                {orgao ? orgao.nome : 'Novo Órgão'}
              </h3>
              {orgao?.municipio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <MapPin size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {orgao.municipio}{orgao.estado ? ` / ${orgao.estado}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {orgao && (
              <>
                <button
                  onClick={() => setEditando(!editando)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: editando ? 'var(--primary)' : 'var(--surface)',
                    color: editando ? '#fff' : 'var(--text-muted)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <Pencil size={12} />{editando ? 'Cancelar' : 'Editar'}
                </button>
                <button
                  onClick={handleExcluir}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface)',
                    color: '#ef4444',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <Trash2 size={12} />Excluir
                </button>
              </>
            )}
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
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome *</label>
                <input style={inputStyle} value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Nome do órgão" />
              </div>
              <div>
                <label style={labelStyle}>Município</label>
                <input style={inputStyle} value={form.municipio}
                  onChange={e => set('municipio', e.target.value)}
                  placeholder="Cidade" />
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <select style={inputStyle} value={form.estado}
                  onChange={e => set('estado', e.target.value)}>
                  <option value="">—</option>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>E-mails (separados por vírgula)</label>
                <input style={inputStyle} value={form.emails}
                  onChange={e => set('emails', e.target.value)}
                  placeholder="email1@orgao.gov.br, email2@orgao.gov.br" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Telefones / WhatsApp (separados por vírgula)</label>
                <input style={inputStyle} value={form.telefones}
                  onChange={e => set('telefones', e.target.value)}
                  placeholder="(81) 99999-9999" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Observações</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                  value={form.observacoes}
                  onChange={e => set('observacoes', e.target.value)}
                  placeholder="Observações gerais sobre o órgão" />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSalvar}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 22px', border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--text)', color: '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Salvar órgão
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={labelStyle}>Localização</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    {orgao.municipio || '—'}{orgao.estado ? ` / ${orgao.estado}` : ''}
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>Total em empenhos</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>E-mails</div>
                  {orgao.emails?.length > 0
                    ? orgao.emails.map((e, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>
                          <Mail size={11} color="var(--text-muted)" />{e}
                        </div>
                      ))
                    : <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</div>}
                </div>

                <div>
                  <div style={labelStyle}>Telefones / WhatsApp</div>
                  {orgao.telefones?.length > 0
                    ? orgao.telefones.map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>
                          <Phone size={11} color="var(--text-muted)" />{t}
                        </div>
                      ))
                    : <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</div>}
                </div>

                {orgao.observacoes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={labelStyle}>Observações</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                      {orgao.observacoes}
                    </div>
                  </div>
                )}
              </div>

              {/* Histórico de empenhos */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>
                  HISTÓRICO DE EMPENHOS ({empenhos?.length || 0})
                </div>
                {empenhos?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {empenhos.map(emp => (
                      <div key={emp._id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px',
                        background: '#f9fafb',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                            #{emp.ticket}
                          </span>
                          <span style={{ fontSize: 12, marginLeft: 8, color: 'var(--text)' }}>
                            {emp.descricao}
                          </span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emp.valor)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-light)', padding: '16px 0', textAlign: 'center' }}>
                    Nenhum empenho vinculado
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Orgaos() {
  const [orgaos, setOrgaos]                   = useState([])
  const [loading, setLoading]                 = useState(true)
  const [busca, setBusca]                     = useState('')
  const [modalAberto, setModalAberto]         = useState(false)
  const [orgaoSelecionado, setOrgaoSelecionado] = useState(null)
  const [empenhosOrgao, setEmpenhosOrgao]     = useState([])

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const res = await orgaoService.listar()
      setOrgaos(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function abrirOrgao(orgao) {
    try {
      const res = await orgaoService.buscar(orgao._id)
      setOrgaoSelecionado(res.data)
      setEmpenhosOrgao(res.data.empenhos || [])
      setModalAberto(true)
    } catch (err) { console.error(err) }
  }

  async function handleSalvar(dados) {
    try {
      if (orgaoSelecionado) {
        const res = await orgaoService.atualizar(orgaoSelecionado._id, dados)
        setOrgaos(prev => prev.map(o => o._id === orgaoSelecionado._id ? res.data : o))
      } else {
        const res = await orgaoService.criar(dados)
        setOrgaos(prev => [res.data, ...prev])
      }
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data?.error || err.message))
    }
  }

  async function handleExcluir(id) {
    try {
      await orgaoService.deletar(id)
      setOrgaos(prev => prev.filter(o => o._id !== id))
    } catch (err) { console.error(err) }
  }

  const filtrados = orgaos.filter(o =>
    !busca ||
    o.nome.toLowerCase().includes(busca.toLowerCase()) ||
    o.municipio?.toLowerCase().includes(busca.toLowerCase())
  )

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: 320, gap: 12, color: 'var(--text-muted)',
    }}>
      <Building2 size={28} strokeWidth={1.5} style={{ opacity: 0.3 }} />
      <span style={{ fontSize: 13 }}>Carregando órgãos...</span>
    </div>
  )

  return (
    <div className="page-wrap">

      {/* Page header ERP */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <Building2 size={15} color="var(--primary)" strokeWidth={2} />
          </div>
          <div>
            <div className="page-header-title">Órgãos</div>
            <div className="page-header-subtitle">{orgaos.length} órgão{orgaos.length !== 1 ? 's' : ''} cadastrado{orgaos.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => { setOrgaoSelecionado(null); setEmpenhosOrgao([]); setModalAberto(true) }}>
            <Plus size={13} strokeWidth={2.5} />
            Novo Órgão
          </button>
        </div>
      </div>

      <div className="page-body">

      {/* Toolbar de busca */}
      <div className="page-toolbar">
        <Search size={13} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
        <input
          className="erp-input"
          style={{ width: 280, height: 28, border: 'none', outline: 'none', fontSize: 12 }}
          placeholder="Buscar por nome ou município..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {/* Tabela */}
      <div className="erp-table-wrap">
        {filtrados.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Building2 size={32} strokeWidth={1} style={{ marginBottom: 10, opacity: 0.25 }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>Nenhum órgão encontrado</div>
            <div style={{ fontSize: 12, marginTop: 4, color: 'var(--text-light)' }}>
              {busca ? 'Tente outro termo de busca.' : 'Clique em "Novo Órgão" para começar.'}
            </div>
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                {['Nome', 'Município / Estado', 'E-mails', 'Telefones', ''].map(h => (
                  <th key={h} style={{
                    padding: '9px 14px',
                    fontSize: 10, fontWeight: 600,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((orgao, i) => (
                <tr
                  key={orgao._id}
                  style={{
                    borderBottom: i < filtrados.length - 1 ? '1px solid var(--border)' : 'none',
                    background: '#ffffff',
                    transition: 'background 0.1s',
                    cursor: 'pointer',
                  }}
                  onClick={() => abrirOrgao(orgao)}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                        background: '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Building2 size={14} color="#2563eb" strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                        {orgao.nome}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                      <MapPin size={11} />
                      {orgao.municipio || '—'}{orgao.estado ? ` / ${orgao.estado}` : ''}
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {orgao.emails?.[0]
                        ? <><Mail size={11} /> {orgao.emails[0]}</>
                        : '—'}
                      {orgao.emails?.length > 1 && (
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          padding: '1px 6px', borderRadius: 'var(--radius-pill)',
                          background: '#eff6ff', color: '#2563eb',
                        }}>+{orgao.emails.length - 1}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {orgao.telefones?.[0]
                        ? <><Phone size={11} />{orgao.telefones[0]}</>
                        : '—'}
                      {orgao.telefones?.length > 1 && (
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          padding: '1px 6px', borderRadius: 'var(--radius-pill)',
                          background: '#eff6ff', color: '#2563eb',
                        }}>+{orgao.telefones.length - 1}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); abrirOrgao(orgao) }}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: '1px solid var(--border)', background: 'var(--surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-muted)',
                      }}
                    >
                      <Info size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <OrgaoModal
          orgao={orgaoSelecionado}
          empenhos={empenhosOrgao}
          onClose={() => { setModalAberto(false); setOrgaoSelecionado(null) }}
          onSalvar={handleSalvar}
          onExcluir={handleExcluir}
        />
      )}
      </div>{/* /page-body */}
    </div>
  )
}