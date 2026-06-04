import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Building2 } from 'lucide-react'

const empresaCores = {
  EGC:     { bg: '#eff6ff', color: '#2563eb', dot: '#2563eb' },
  GWC:     { bg: '#ecfdf5', color: '#059669', dot: '#059669' },
  SEGINFO: { bg: '#f5f3ff', color: '#7c3aed', dot: '#7c3aed' },
}

const tratativaCores = {
  faturar:      { bg: '#ecfdf5', color: '#059669' },
  dispensa:     { bg: '#fefce8', color: '#a16207' },
  tmm:          { bg: '#fff7ed', color: '#c2410c' },
  reequilibrio: { bg: '#faf5ff', color: '#7e22ce' },
}

const tratativaLabel = {
  faturar:      'Faturar',
  dispensa:     'Dispensa',
  tmm:          'TMM',
  reequilibrio: 'Reequilíbrio',
}

export default function EmpenhoCard({ empenho, provided }) {
  const emp  = empresaCores[empenho.empresa]  || empresaCores.EGC
  const trat = tratativaCores[empenho.tipotratativa] || tratativaCores.faturar

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        marginBottom: '8px',
        boxShadow: 'var(--shadow-card)',
        cursor: 'grab',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        ...provided.draggableProps.style,
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
      {/* Linha 1: Ticket + Badge empresa */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 9,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          #{empenho.ticket}
        </span>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 'var(--radius-pill)',
          background: emp.bg,
          color: emp.color,
        }}>
          <span style={{
            width: 5, height: 5,
            borderRadius: '50%',
            background: emp.dot,
            flexShrink: 0,
          }} />
          {empenho.empresa}
        </span>
      </div>

      {/* Órgão */}
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 3,
        lineHeight: 1.35,
      }}>
        {empenho.orgao}
      </div>

      {/* Descrição */}
      <div
        className="truncate"
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        {empenho.descricao}
      </div>

      {/* Linha 2: Valor + Tratativa */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(empenho.valor)}
        </span>

        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '3px 9px',
          borderRadius: 'var(--radius-pill)',
          background: trat.bg,
          color: trat.color,
        }}>
          {tratativaLabel[empenho.tipotratativa]}
        </span>
      </div>

      {/* Linha 3: Data */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        color: 'var(--text-light)',
        borderTop: '1px solid var(--border)',
        paddingTop: 8,
      }}>
        <Calendar size={10} strokeWidth={1.5} />
        {format(new Date(empenho.dataRecebimento), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
      </div>
    </div>
  )
}