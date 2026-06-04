import { useState, useEffect } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { Loader2 } from 'lucide-react'
import KanbanColumn from './KanbanColumn'
import NovoEmpenhoModal from './NovoEmpenhoModal'
import { empenhoService } from '../../services/api'

const COLUNAS = ['recebido', 'listado', 'em_faturamento', 'aprovado', 'concluido', 'cancelado']

export default function KanbanBoard() {
  const [empenhos, setEmpenhos]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => { carregarEmpenhos() }, [])

  async function carregarEmpenhos() {
    try {
      const res = await empenhoService.listar()
      setEmpenhos(res.data)
    } catch (err) {
      console.error('Erro ao carregar empenhos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const novoStatus = destination.droppableId
    setEmpenhos(prev =>
      prev.map(e => e._id === draggableId ? { ...e, status: novoStatus } : e)
    )
    try {
      await empenhoService.atualizar(draggableId, { status: novoStatus })
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      carregarEmpenhos()
    }
  }

  async function handleNovoEmpenho(dados) {
    try {
      const res = await empenhoService.criar({ ...dados, status: 'recebido' })
      setEmpenhos(prev => [res.data, ...prev])
      setModalAberto(false)
    } catch (err) {
      alert('Erro ao salvar empenho: ' + (err.response?.data?.error || err.message))
    }
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 320,
      gap: 12,
      color: 'var(--text-muted)',
    }}>
      <Loader2
        size={28}
        strokeWidth={1.5}
        style={{ animation: 'spin 0.8s linear infinite', opacity: 0.5 }}
      />
      <span style={{ fontSize: 13 }}>Carregando empenhos...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 20,
          paddingTop: 4,
          /* scrollbar fina já definida no globals.css */
        }}>
          {COLUNAS.map(coluna => (
            <KanbanColumn
              key={coluna}
              id={coluna}
              empenhos={empenhos.filter(e => e.status === coluna)}
              onNovoEmpenho={() => setModalAberto(true)}
            />
          ))}
        </div>
      </DragDropContext>

      {modalAberto && (
        <NovoEmpenhoModal
          onClose={() => setModalAberto(false)}
          onSalvar={handleNovoEmpenho}
        />
      )}
    </>
  )
}