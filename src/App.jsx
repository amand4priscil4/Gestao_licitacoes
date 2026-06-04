import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import Workflow from './pages/Workflow'
import Atendimento from './pages/Atendimento'
import Orgaos from './pages/Orgaos'
import Tarefas from './pages/Tarefas'
import Documentos from './pages/Documentos'
import Configuracoes from './pages/Configuracoes'

function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/workflow" replace />} />
            <Route path="workflow" element={<Workflow />} />
            <Route path="atendimento" element={<Atendimento />} />
            <Route path="orgaos" element={<Orgaos />} />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BrowserRouter>
  )
}

export default App