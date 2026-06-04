import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, X, CheckCircle2 } from 'lucide-react'

const empresaCores = {
  EGC:     { color: '#2563eb', bg: '#eff6ff' },
  GWC:     { color: '#059669', bg: '#ecfdf5' },
  SEGINFO: { color: '#7c3aed', bg: '#f5f3ff' },
}

const inputStyle = {
  padding: '7px 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 12,
  outline: 'none',
  background: 'var(--surface)',
  color: 'var(--text)',
  transition: 'border-color 0.15s',
}

export default function ModuloFaturados({ empenhos }) {
  const [busca, setBusca]           = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim]       = useState('')

  const filtrados = empenhos.filter(e => {
    const termoBusca = busca.toLowerCase()
    const matchBusca = !busca ||
      e.ticket.toLowerCase().includes(termoBusca) ||
      e.orgao.toLowerCase().includes(termoBusca)
    const dataEmp    = new Date(e.dataRecebimento)
    const matchInicio = !dataInicio || dataEmp >= new Date(dataInicio)
    const matchFim    = !dataFim    || dataEmp <= new Date(dataFim)
    return matchBusca && matchInicio && matchFim
  })

  const temFiltro = busca || dataInicio || dataFim

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Faturados</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Empenhos concluídos e faturados.
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px',
          background: '#ecfdf5',
          color: '#059669',
          borderRadius: 'var(--radius-pill)',
          fontSize: 12, fontWeight: 600,
        }}>
          <CheckCircle2 size={13} />
          {empenhos.length} faturado{empenhos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-card)',
      }}>
        {/* Busca */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search
            size={13}
            style={{
              position: 'absolute', left: 9, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            placeholder="Buscar por ticket ou órgão..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              ...inputStyle,
              width: '100%',
              paddingLeft: 28,
            }}
          />
        </div>

        {/* Data início */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>De</span>
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Data fim */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>Até</span>
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Limpar */}
        {temFiltro && (
          <button
            onClick={() => { setBusca(''); setDataInicio(''); setDataFim('') }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 12px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12, cursor: 'pointer',
              background: 'var(--surface)',
              color: 'var(--text-muted)',
              alignSelf: 'flex-end',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#fecaca'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <X size={12} /> Limpar
          </button>
        )}

        <span style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          alignSelf: 'flex-end',
          paddingBottom: 7,
          marginLeft: 'auto',
        }}>
          {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabela */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        {filtrados.length === 0 ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}>
            Nenhum empenho faturado encontrado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                {['Ticket', 'Órgão', 'Empresa', 'Descrição', 'Valor', 'Data'].map(h => (
                  <th key={h} style={{
                    padding: '9px 14px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((emp, i) => (
                <tr
                  key={emp._id}
                  style={{
                    borderBottom: i < filtrados.length - 1 ? '1px solid var(--border)' : 'none',
                    background: '#ffffff',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    #{emp.ticket}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
                    {emp.orgao}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 10, fontWeight: 600,
                      padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                      background: empresaCores[emp.empresa]?.bg,
                      color: empresaCores[emp.empresa]?.color,
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: empresaCores[emp.empresa]?.color,
                      }} />
                      {emp.empresa}
                    </span>
                  </td>
                  <td
                    className="truncate"
                    style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)', maxWidth: 200 }}
                  >
                    {emp.descricao}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emp.valor)}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {format(new Date(emp.dataRecebimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}