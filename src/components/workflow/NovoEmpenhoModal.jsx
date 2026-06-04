import { useState } from 'react'
import { RefreshCw, Plus, Trash2 } from 'lucide-react'

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 13,
  color: 'var(--text)',
  background: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-muted)',
  marginBottom: 4,
  display: 'block',
  letterSpacing: '0.02em',
}

function gerarTicket() {
  const now = new Date()
  const ano = now.getFullYear()
  const mes = String(now.getMonth() + 1).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `${ano}${mes}${seq}`
}

const itemVazio = () => ({ produto: '', quantidade: 1, valorUnitario: '', marcaModelo: '' })

export default function NovoEmpenhoModal({ onClose, onSalvar, produtos = [] }) {
  const [form, setForm] = useState({
    ticket: gerarTicket(),
    orgao: '',
    empresa: 'SEGINFO',
    empenho: '',
    dataRecebimento: new Date().toISOString().split('T')[0],
    dataSolicitacao: '',
    descricao: '',
  })
  const [itens, setItens] = useState([itemVazio()])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  function setItem(idx, field, value) {
    setItens(prev => {
      const novos = [...prev]
      novos[idx] = { ...novos[idx], [field]: value }
      const qtd = parseFloat(field === 'quantidade' ? value : novos[idx].quantidade) || 0
      const vUnit = parseFloat(field === 'valorUnitario' ? value : novos[idx].valorUnitario) || 0
      novos[idx].valorTotal = qtd * vUnit
      return novos
    })
  }

  function adicionarItem() { setItens(prev => [...prev, itemVazio()]) }
  function removerItem(idx) { setItens(prev => prev.filter((_, i) => i !== idx)) }

  const valorTotal = itens.reduce((acc, it) => acc + (it.valorTotal || 0), 0)

  function handleSalvar() {
    if (!form.orgao || !form.descricao) {
      alert('Preencha os campos obrigatórios: Órgão e Descrição')
      return
    }
    const itensProcessados = itens
      .filter(it => it.produto || it.valorUnitario)
      .map(it => ({
        produto: it.produto,
        quantidade: parseFloat(it.quantidade) || 1,
        valorUnitario: parseFloat(it.valorUnitario) || 0,
        valorTotal: (parseFloat(it.quantidade) || 1) * (parseFloat(it.valorUnitario) || 0),
        marcaModelo: it.marcaModelo,
      }))
    onSalvar({ ...form, itens: itensProcessados, valor: valorTotal, modulo: 'empenhos', colunaEmpenho: 'recebido' })
  }

  const empresaCores = {
    EGC:     { color: '#2563eb', bg: '#eff6ff' },
    GWC:     { color: '#059669', bg: '#ecfdf5' },
    SEGINFO: { color: '#7c3aed', bg: '#f5f3ff' },
  }
  const cor = empresaCores[form.empresa]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 'var(--radius-lg)',
        width: 600, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Novo Empenho</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Preencha os dados para registrar um novo empenho.</p>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%',
            border: '1px solid var(--border)', background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18,
          }}>×</button>
        </div>

        <div style={{ padding: '20px 24px' }}>

          {/* Preview empresa */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: cor.bg,
            borderRadius: 'var(--radius-sm)', marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: cor.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: cor.color }}>{form.empresa}</span>
            <span style={{ fontSize: 12, color: cor.color, opacity: 0.7, marginLeft: 2 }}>· Empenho sendo cadastrado para esta empresa</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Ticket */}
            <div>
              <label style={labelStyle}>Ticket</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inputStyle, paddingRight: 34 }} value={form.ticket} onChange={e => set('ticket', e.target.value)} />
                <button onClick={() => set('ticket', gerarTicket())} style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}>
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Empresa */}
            <div>
              <label style={labelStyle}>Empresa *</label>
              <select style={inputStyle} value={form.empresa} onChange={e => set('empresa', e.target.value)}>
                <option>EGC</option><option>GWC</option><option>SEGINFO</option>
              </select>
            </div>

            {/* Nº Empenho */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nº do Empenho</label>
              <input style={inputStyle} value={form.empenho} onChange={e => set('empenho', e.target.value)} placeholder="Ex: 2025NE001234" />
            </div>

            {/* Órgão */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Órgão / Cliente *</label>
              <input style={inputStyle} value={form.orgao} onChange={e => set('orgao', e.target.value)} placeholder="Nome do órgão" />
            </div>

            {/* Datas */}
            <div>
              <label style={labelStyle}>Data de Recebimento</label>
              <input style={inputStyle} type="date" value={form.dataRecebimento} onChange={e => set('dataRecebimento', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Data da Solicitação</label>
              <input style={inputStyle} type="date" value={form.dataSolicitacao} onChange={e => set('dataSolicitacao', e.target.value)} />
            </div>

            {/* Descrição */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descrição *</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descreva o empenho" />
            </div>
          </div>

          {/* Itens */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>ITENS DO EMPENHO</label>
              <button onClick={adicionarItem} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)',
              }}>
                <Plus size={11} /> Adicionar item
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 80px 36px', gap: 6, marginBottom: 6 }}>
              {['Produto', 'Qtd', 'Valor Unit.', 'Marca/Modelo', 'Total', ''].map((h, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>{h}</span>
              ))}
            </div>

            {itens.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 80px 36px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                <input style={inputStyle} placeholder="Produto" value={item.produto} onChange={e => setItem(idx, 'produto', e.target.value)} />
                <input style={inputStyle} type="number" min="1" placeholder="1" value={item.quantidade} onChange={e => setItem(idx, 'quantidade', e.target.value)} />
                <input style={inputStyle} type="number" placeholder="0,00" value={item.valorUnitario} onChange={e => setItem(idx, 'valorUnitario', e.target.value)} />
                <input style={inputStyle} placeholder="Marca/Modelo" value={item.marcaModelo} onChange={e => setItem(idx, 'marcaModelo', e.target.value)} />
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', padding: '8px 6px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', textAlign: 'right' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorTotal || 0)}
                </div>
                {itens.length > 1 && (
                  <button onClick={() => removerItem(idx)} style={{
                    width: 32, height: 32, border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-sm)', background: '#fff',
                    color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}

            {/* Total geral */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10,
              marginTop: 10, padding: '10px 14px',
              background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>VALOR TOTAL DO EMPENHO</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            display: 'inline-flex', alignItems: 'center', padding: '8px 18px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            background: '#ffffff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', color: 'var(--text-muted)',
          }}>Cancelar</button>
          <button onClick={handleSalvar} style={{
            display: 'inline-flex', alignItems: 'center', padding: '8px 22px',
            border: 'none', borderRadius: 'var(--radius-sm)',
            background: 'var(--primary)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', color: '#ffffff',
          }}>Salvar empenho</button>
        </div>
      </div>
    </div>
  )
}