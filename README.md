# Sistema de Gestão de Empenhos

> Aplicação web desenvolvida para automatizar e organizar o fluxo interno de gestão de licitações públicas de três empresas: **EGC**, **GWC** e **SEGINFO**.


📁 **Repositório:** [github.com/amand4priscil4/Gestao_licitacoes](https://github.com/amand4priscil4/Gestao_licitacoes)

---

## Sumário

- [Contexto e Problema](#contexto-e-problema)
- [Mapeamento do Fluxo de Processos](#mapeamento-do-fluxo-de-processos)
- [Levantamento de Requisitos](#levantamento-de-requisitos)
- [Decisões de Arquitetura e Tecnologia](#decisões-de-arquitetura-e-tecnologia)
- [Design e Prototipação](#design-e-prototipação)
- [Módulos do Sistema](#módulos-do-sistema)
- [Como Executar](#como-executar)
- [Roadmap](#roadmap)

---

## Contexto e Problema

O processo de gestão de empenhos envolve múltiplos responsáveis, etapas sequenciais e comunicação constante com órgãos públicos. Antes do sistema, o fluxo era controlado manualmente através de planilhas, e-mails e comunicações informais, o que gerava falhas de comunicação entre os membros da equipe.

O problema central foi identificado a partir de **observação do dia a dia e conversas diretas com a equipe**. O caso mais crítico era o seguinte: quando um empenho recebia uma solicitação de **dispensa** (valor muito baixo para compensar o envio), essa informação ficava isolada na planilha. Outros empenhos do mesmo órgão continuavam sendo faturados normalmente, sem que a equipe soubesse que havia uma dispensa em aberto para aquele órgão. O resultado era uma **reclamação do órgão** questionando por que outros empenhos foram atendidos enquanto o da dispensa ficou sem resposta — um problema de visibilidade que comprometia a relação com o cliente.

Além disso, foram identificados outros pontos de falha:

- Dificuldade em saber em qual etapa do processo cada empenho se encontrava
- Falta de rastreabilidade das tratativas enviadas (Dispensa, TMM, Reequilíbrio)
- Demandas recebidas por e-mail e WhatsApp sem registro centralizado
- Ausência de alertas para solicitações que ficavam sem retorno por muito tempo
- Informações de contato dos órgãos dispersas

---

## Mapeamento do Fluxo de Processos

Antes de iniciar o desenvolvimento, o fluxo de trabalho foi mapeado em detalhes junto à equipe, identificando cada etapa, o responsável por ela e as possíveis ramificações do processo.

### Pessoas envolvidas

| Responsável | Papel no processo |
|-------------|------------------|
| **Usuário 01** | Mapeia licitações nos portais, transmite propostas e documentos de habilitação |
| **Usuário 02** | Recebe e-mails dos órgãos, assina atas e contratos, lista empenhos na planilha gerando ticket, confirma recebimento ao órgão somente após listagem |
| **Usuário 03** | Renomeia arquivos dos empenhos e move para pasta, envia tratativas por e-mail, verifica planilha antes de solicitar dispensa para checar se há outro empenho do mesmo órgão que possa ser somado, monitora e-mails e WhatsApp dos órgãos |
| **Usuário 04** | Pega empenhos na pasta, imprime, anota ticket, verifica aptidão para faturar, verifica estoque e cadastra no sistema |
| **Usuário 05** | Atualiza documentos de habilitação, solicita cotação de frete ao estoquista e emite nota fiscal após confirmação |

### Fluxo mapeado

```
Órgão envia empenho/OF por e-mail
        ↓
Usuário 02 recebe → assina atas/contratos → lista na planilha → gera ticket → confirma recebimento ao órgão
        ↓
Usuário 03 renomeia o arquivo e move para pasta
        ↓
Usuário 04 pega na pasta → verifica aptidão para faturar
        ↓
   ┌────┴────┐
  APTO    NÃO APTO
   ↓          ↓
Cadastra   Usuário 03 classifica a tratativa:
no sistema  ├── Dispensa (valor baixo, verificar se há outro empenho do mesmo órgão para somar)
   ↓         ├── TMM (item indisponível, solicitar autorização de troca ao órgão)
Usuário 05  └── Reequilíbrio (preço defasado, enviar solicitação formal ao órgão)
solicita
frete → emite NF
```

A partir desse mapeamento, ficou evidente onde o sistema precisava atuar: no controle de visibilidade entre etapas, na rastreabilidade das tratativas e no registro centralizado das demandas.

---

## Levantamento de Requisitos

Com o fluxo mapeado, os requisitos foram levantados a partir das dores identificadas em cada etapa.

### Requisitos Funcionais

**Módulo Empenhos**
- RF01 — Cadastrar empenhos com ticket (formato: `ANO+MÊS+3 dígitos`), órgão, empresa, valor, descrição e data de recebimento
- RF02 — Visualizar empenhos organizados por colunas: Recebido → Listado → Faturamento
- RF03 — Mover empenhos entre colunas
- RF04 — Filtrar empenhos por empresa (EGC, GWC, SEGINFO)
- RF05 — Criar solicitação (Dispensa, TMM, Reequilíbrio) diretamente a partir de um empenho
- RF06 — Marcar empenho como Faturado, movendo-o para o módulo de Faturados

**Módulo Solicitações**
- RF07 — Visualizar solicitações por colunas: Enviada → Aceita → Negada → Cancelada
- RF08 — Quando uma solicitação for aceita, retornar o empenho automaticamente para a coluna de Faturamento

**Módulo Faturados**
- RF09 — Listar empenhos faturados com busca por ticket, órgão e período

**Módulo Atendimento**
- RF10 — Registrar demandas recebidas por e-mail e WhatsApp
- RF11 — Definir prioridade (baixa, média, alta) e encaminhar para responsável
- RF12 — Visualizar demandas por colunas: Sinalizado → Encaminhado → Resolvido

**Módulo Órgãos**
- RF13 — Cadastrar órgãos com nome, município, estado, e-mails, telefones e observações
- RF14 — Visualizar histórico de empenhos vinculados ao órgão

**Módulo Relatórios**
- RF15 — Gerar métricas de empenhos e atendimentos por período
- RF16 — Exibir alertas automáticos para solicitações e atendimentos sem retorno após prazo configurável
- RF17 — Exibir painel lateral com histórico de ações recentes

**Módulo Fluxograma**
- RF18 — Exibir linha do tempo horizontal e editável do processo interno

**Módulo Configurações**
- RF19 — Gerenciar lista de responsáveis com nome e cor de identificação
- RF20 — Configurar prazos de alerta por tipo de solicitação e atendimento

### Requisitos Não Funcionais

- RNF01 — Autenticação segura com controle de acesso (apenas usuários autorizados)
- RNF02 — Interface responsiva e de uso intuitivo para a equipe
- RNF03 — Persistência dos dados em nuvem com disponibilidade contínua
- RNF04 — Deploy automatizado a cada atualização do repositório

---

## Decisões de Arquitetura e Tecnologia

### Por que separar frontend e backend?

A separação entre frontend e backend foi escolhida para facilitar a manutenção independente de cada camada, permitir que o frontend seja hospedado em uma CDN (Vercel) e o backend em um servidor dedicado (Railway), além de possibilitar futuramente a criação de integrações externas via API (como o N8N para automação do WhatsApp).

### Stack escolhida

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | React + Vite | Componentização facilita a criação dos módulos independentes; Vite oferece build rápido e HMR eficiente |
| Backend | Node.js + Express | Ambiente JavaScript unificado entre frontend e backend; Express é simples e adequado para uma API REST |
| Banco de dados | MongoDB Atlas | Modelo de documentos flexível se adapta bem à variação de dados entre empenhos, solicitações e atendimentos; hospedagem gerenciada na nuvem |
| Autenticação | Clerk | Solução completa de autenticação com suporte a múltiplos usuários, sem necessidade de implementar fluxo de login do zero |
| Hospedagem frontend | Vercel | Deploy automatizado via GitHub, CDN global, domínio gratuito |
| Hospedagem backend | Railway | Deploy contínuo do servidor Node.js com variáveis de ambiente seguras |

### Por que MongoDB e não um banco relacional?

O processo de negócio tem variações de dados entre os módulos — um empenho em atendimento tem campos diferentes de um empenho faturado, e uma solicitação do tipo TMM tem campos extras (marca atual e marca substituta) que os outros tipos não têm. O modelo de documentos do MongoDB absorve essas variações sem a necessidade de múltiplas tabelas com joins complexos, o que simplifica o desenvolvimento e a manutenção.

---

## Design e Prototipação

Antes do desenvolvimento, foi criado um wireframe no **Figma** para validar a estrutura de navegação e o layout dos módulos. As referências visuais foram buscadas em sistemas **CRM e ERP** para garantir uma interface familiar ao contexto de gestão de processos.

O design final foi guiado pelos seguintes princípios:

- **Clareza na navegação** — menu superior fixo com destaque visual no módulo ativo
- **Hierarquia de informação** — cards brancos com sombra leve sobre fundo cinza claro, separando conteúdo do fundo
- **Badges com semântica de cor** — cada empresa, status e tipo de tratativa tem uma cor consistente em todo o sistema
- **Densidade controlada** — colunas kanban permitem visualizar muitos itens sem poluição visual

### Paleta de cores

| Elemento | Cor |
|----------|-----|
| Fundo geral | `#f4f6f8` |
| Cards e superfícies | `#ffffff` |
| Header de navegação | `#111827` |
| Empresa EGC | `#2563eb` |
| Empresa GWC | `#059669` |
| Empresa SEGINFO | `#7c3aed` |
| Alerta / urgente | `#ef4444` |

---

## Módulos do Sistema

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Navegação superior
│   │   └── Layout.jsx          # Estrutura base das páginas
│   ├── workflow/
│   │   ├── ModuloEmpenhos.jsx  # Kanban de empenhos por empresa
│   │   ├── ModuloSolicitacoes.jsx
│   │   ├── ModuloFaturados.jsx
│   │   ├── EmpenhoCard.jsx
│   │   ├── KanbanColumn.jsx
│   │   └── NovoEmpenhoModal.jsx
│   └── relatorios/
│       ├── AbaEmpenhos.jsx
│       ├── AbaAtendimento.jsx
│       └── AbaAlertas.jsx
├── pages/
│   ├── Workflow.jsx
│   ├── Atendimento.jsx
│   ├── Orgaos.jsx
│   ├── Relatorios.jsx
│   ├── Fluxograma.jsx
│   └── Configuracoes.jsx
└── services/
    └── api.js                  # Camada de comunicação com o backend
```

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Conta no MongoDB Atlas
- Conta no Clerk

### Frontend

```bash
git clone https://github.com/amand4priscil4/Gestao_licitacoes
cd gestao-licitacoes
npm install
npm run dev
```

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_CLERK_PUBLISHABLE_KEY=sua_chave_clerk
VITE_API_URL=http://localhost:3001
```

### Backend

```bash
cd backend
npm install
npm start
```

Crie um arquivo `.env` na raiz do backend:

```env
MONGODB_URI=sua_connection_string_mongodb
CLERK_SECRET_KEY=sua_chave_secreta_clerk
PORT=3001
```

---

## Roadmap

O sistema está em produção e em uso pela equipe. As próximas evoluções planejadas são:

- [ ] **Integração com N8N** — automação do recebimento de mensagens do WhatsApp, criando atendimentos no sistema automaticamente
- [ ] **Notificações em tempo real** — alertas via WebSocket quando um empenho receber atualização
- [ ] **Histórico de movimentações** — log de cada alteração de status por usuário e data
- [ ] **Exportação de relatórios** — geração de PDF/Excel dos dados filtrados por período
- [ ] **Testes automatizados** — cobertura de testes unitários e de integração nos módulos principais

---

## Sobre o Projeto

Este projeto nasceu de uma necessidade real identificada no ambiente de trabalho. O desenvolvimento partiu da análise do processo, passou pelo levantamento de requisitos junto à equipe, prototipação no Figma e implementação completa da aplicação — do banco de dados à interface. Faz parte do portfólio de desenvolvimento da autora e continuará sendo evoluído com novas funcionalidades.

**Desenvolvido por Amanda Alves**  
Estudante de Análise e Desenvolvimento de Sistemas — Senac Recife
Estudante de Gestão da Informação - UFPE