import { useState, useEffect } from 'react'
import { Loader2, Plus, Kanban } from 'lucide-react'
import { empenhoService } from '../services/api'
import ModuloEmpenhos from '../components/workflow/ModuloEmpenhos'
import ModuloSolicitacoes from '../components/workflow/ModuloSolicitacoes'
import ModuloFaturados from '../components/workflow/ModuloFaturados'
import NovoEmpenhoModal from '../components/workflow/NovoEmpenhoModal'

export default function Workflow() {
  const [empenhos, setEmpenhos]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const res = await empenhoService.listar()
      setEmpenhos(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function atualizar(id, dados) {
    try {
      const res = await empenhoService.atualizar(id, dados)
      setEmpenhos(prev => prev.map(e => e._id === id ? res.data : e))
    } catch (err) {
      console.error(err)
    }
  }

  async function excluir(id) {
    try {
      await empenhoService.deletar(id)
      setEmpenhos(prev => prev.filter(e => e._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleNovoEmpenho(dados) {
    try {
      const res = await empenhoService.criar(dados)
      setEmpenhos(prev => [res.data, ...prev])
      setModalAberto(false)
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data?.error || err.message))
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, gap: 10, color: 'var(--text-muted)' }}>
      <Loader2 size={20} strokeWidth={1.5} style={{ animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 13 }}>Carregando...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const totalEmpenhos     = empenhos.filter(e => e.modulo === 'empenhos').length
  const totalSolicitacoes = empenhos.filter(e => e.modulo === 'solicitacoes').length
  const totalFaturados    = empenhos.filter(e => e.modulo === 'faturados').length

  return (
    <div className="page-wrap">

      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <Kanban size={15} color="var(--primary)" strokeWidth={2} />
          </div>
          <div>
            <div className="page-header-title">Workflow</div>
            <div className="page-header-subtitle">Gestão de empenhos, solicitações e faturamento</div>
          </div>
        </div>
        <div className="page-header-actions">
          {[
            { label: 'Empenhos', val: totalEmpenhos, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Solicitações', val: totalSolicitacoes, color: '#d97706', bg: '#fffbeb' },
            { label: 'Faturados', val: totalFaturados, color: '#059669', bg: '#ecfdf5' },
          ].map(({ label, val, color, bg }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px',
              background: bg,
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
            Novo empenho
          </button>
        </div>
      </div>

      {/* Módulos */}
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ModuloEmpenhos
          empenhos={empenhos.filter(e => e.modulo === 'empenhos')}
          onAtualizar={atualizar}
          onExcluir={excluir}
          onNovoEmpenho={() => setModalAberto(true)}
        />
        <ModuloSolicitacoes
          empenhos={empenhos.filter(e => e.modulo === 'solicitacoes')}
          onAtualizar={atualizar}
          onExcluir={excluir}
        />
        <ModuloFaturados
          empenhos={empenhos.filter(e => e.modulo === 'faturados')}
          onExcluir={excluir}
        />
      </div>

      {modalAberto && (
        <NovoEmpenhoModal
          onClose={() => setModalAberto(false)}
          onSalvar={handleNovoEmpenho}
        />
      )}
    </div>
  )
}