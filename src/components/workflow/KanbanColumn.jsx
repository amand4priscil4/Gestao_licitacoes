import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import EmpenhoCard from './EmpenhoCard'

const colunasCores = {
  recebido:       { color: '#6b7280', bg: '#f9fafb', countBg: '#f3f4f6', countColor: '#6b7280' },
  listado:        { color: '#2563eb', bg: '#eff6ff', countBg: '#dbeafe', countColor: '#2563eb' },
  em_faturamento: { color: '#d97706', bg: '#fffbeb', countBg: '#fef3c7', countColor: '#d97706' },
  aprovado:       { color: '#059669', bg: '#ecfdf5', countBg: '#d1fae5', countColor: '#059669' },
  concluido:      { color: '#10b981', bg: '#ecfdf5', countBg: '#d1fae5', countColor: '#059669' },
  cancelado:      { color: '#ef4444', bg: '#fef2f2', countBg: '#fee2e2', countColor: '#ef4444' },
}

const colunasLabel = {
  recebido:       'Recebido',
  listado:        'Listado',
  em_faturamento: 'Em Faturamento',
  aprovado:       'Aprovado / Faturando',
  concluido:      'Concluído',
  cancelado:      'Cancelado / Dispensado',
}

export default function KanbanColumn({ id, empenhos, onNovoEmpenho }) {
  const cor = colunasCores[id] || colunasCores.recebido

  return (
    <div style={{
      minWidth: 264,
      maxWidth: 264,
      background: '#ffffff',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 'calc(100vh - 130px)',
    }}>

      {/* Header da coluna */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: cor.bg,
        borderRadius: 'var(--radius) var(--radius) 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: cor.color,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: cor.color,
            letterSpacing: '0.01em',
          }}>
            {colunasLabel[id]}
          </span>
        </div>

        <span style={{
          fontSize: 11,
          fontWeight: 700,
          background: cor.countBg,
          color: cor.countColor,
          borderRadius: 'var(--radius-pill)',
          padding: '1px 8px',
          minWidth: 22,
          textAlign: 'center',
        }}>
          {empenhos.length}
        </span>
      </div>

      {/* Área de cards droppable */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 10px 4px',
              background: snapshot.isDraggingOver
                ? `${cor.color}08`
                : 'transparent',
              transition: 'background 0.2s',
              minHeight: 80,
              borderRadius: '0 0 var(--radius) var(--radius)',
            }}
          >
            {empenhos.map((emp, index) => (
              <Draggable key={emp._id} draggableId={emp._id} index={index}>
                {(provided) => (
                  <EmpenhoCard empenho={emp} provided={provided} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {/* Estado vazio */}
            {empenhos.length === 0 && !snapshot.isDraggingOver && (
              <div style={{
                textAlign: 'center',
                padding: '24px 12px',
                color: 'var(--text-light)',
                fontSize: 11,
              }}>
                Nenhum empenho
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Botão novo empenho — só na coluna Recebido */}
      {id === 'recebido' && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onNovoEmpenho}
            style={{
              width: '100%',
              padding: '7px',
              border: '1px dashed var(--border-hover)',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
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
            <Plus size={13} strokeWidth={2} />
            Novo empenho
          </button>
        </div>
      )}
    </div>
  )
}