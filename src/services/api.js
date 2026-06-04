import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://gestaolicitacoes-production.up.railway.app/api'

const api = axios.create({ baseURL })

export const empenhoService = {
  listar: () => api.get('/empenhos'),
  criar: (data) => api.post('/empenhos', data),
  atualizar: (id, data) => api.put(`/empenhos/${id}`, data),
  deletar: (id) => api.delete(`/empenhos/${id}`)
}

export const orgaoService = {
  listar: () => api.get('/orgaos'),
  buscar: (id) => api.get(`/orgaos/${id}`),
  criar: (data) => api.post('/orgaos', data),
  atualizar: (id, data) => api.put(`/orgaos/${id}`, data),
  deletar: (id) => api.delete(`/orgaos/${id}`)
}

export const atendimentoService = {
  listar: () => api.get('/atendimentos'),
  criar: (data) => api.post('/atendimentos', data),
  atualizar: (id, data) => api.put(`/atendimentos/${id}`, data),
  deletar: (id) => api.delete(`/atendimentos/${id}`)
}

export const produtoService = {
  listar: () => api.get('/produtos'),
  criar: (data) => api.post('/produtos', data),
  atualizar: (id, data) => api.put(`/produtos/${id}`, data),
  deletar: (id) => api.delete(`/produtos/${id}`)
}

export const marcaService = {
  listar: () => api.get('/marcas'),
  criar: (data) => api.post('/marcas', data),
  atualizar: (id, data) => api.put(`/marcas/${id}`, data),
  deletar: (id) => api.delete(`/marcas/${id}`)
}

export const ataContratoService = {
  listar: () => api.get('/atascontratos'),
  criar: (data) => api.post('/atascontratos', data),
  atualizar: (id, data) => api.put(`/atascontratos/${id}`, data),
  deletar: (id) => api.delete(`/atascontratos/${id}`)
}

export default api