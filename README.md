# Sistema de Gestão de Licitações

> Aplicação web desenvolvida para automatizar e organizar o fluxo interno de gestão de licitações públicas de empresas que fornecem materiais para órgãos públicos.

📁 **Repositório:** [github.com/amand4priscil4/Gestao_licitacoes](https://github.com/amand4priscil4/Gestao_licitacoes)

---

## Sumário

- [Contexto e Problema](#contexto-e-problema)
- [Como as Regras de Negócio Evoluíram](#como-as-regras-de-negócio-evoluíram)
- [Mapeamento do Fluxo de Processos](#mapeamento-do-fluxo-de-processos)
- [Levantamento de Requisitos](#levantamento-de-requisitos)
- [Decisões de Arquitetura e Tecnologia](#decisões-de-arquitetura-e-tecnologia)
- [Módulos do Sistema](#módulos-do-sistema)
- [Como Executar](#como-executar)
- [Roadmap](#roadmap)

---

## Contexto e Problema

O processo de gestão de empenhos envolve múltiplos responsáveis, etapas sequenciais e comunicação constante com órgãos públicos. Antes do sistema, o fluxo era controlado manualmente por planilhas, e-mails e comunicações informais, o que gerava falhas de comunicação entre os membros da equipe.

O problema central foi identificado a partir da **observação do dia a dia e conversas diretas com a equipe**. O caso mais crítico: quando um empenho recebia uma solicitação de **dispensa** (valor muito baixo para compensar o envio), essa informação ficava isolada na planilha. Outros empenhos do mesmo órgão continuavam sendo faturados normalmente, sem que a equipe soubesse que havia uma dispensa em aberto. O resultado eram reclamações dos órgãos — um problema de visibilidade que comprometia a relação com o cliente.

Além disso, foram identificados outros pontos de falha:

- Dificuldade em saber em qual etapa do processo cada empenho se encontrava
- Falta de rastreabilidade das tratativas enviadas (Dispensa, TMM, Reequilíbrio)
- Demandas recebidas por e-mail e WhatsApp sem registro centralizado
- Ausência de alertas para solicitações sem retorno por muito tempo
- Informações de contato dos órgãos dispersas

---

## Como as Regras de Negócio Evoluíram

Uma das etapas mais importantes do projeto foi a **análise exploratória dos dados históricos** para embasar decisões de produto com evidências reais, e não apenas suposições.

### Mineração de dados dos e-mails

Para entender os padrões de comunicação com os órgãos, foi realizada uma exportação dos e-mails do Outlook das três contas corporativas (`licita5@grupomoov.com`, `licita5@gwc.ind.br`, `licita5@seginfope.com.br`), resultando em um volume de **42.009 e-mails** brutos.

Esses dados foram processados com **Python e Pandas no Google Colab**, cruzando os e-mails com a planilha de controle de tickets (10.419 registros). O resultado foi um mapeamento completo de **541 empenhos EGC ativos** com status inferido automaticamente a partir dos assuntos dos e-mails.

```python
# Exemplo do pipeline de análise
palavras_chave = ['empenho', 'TMM', 'reequilíbrio', 'nota fiscal', 'entrega']
df_filtrado = df[df['Assunto'].str.contains('|'.join(palavras_chave), case=False)]

# Inferência de status por padrão de assunto
def inferir_status(assunto):
    if 'TMM' in assunto.upper(): return 'TMM - TROCA DE MARCA/MODELO'
    if 'DISPENSA' in assunto.upper(): return 'DISPENSA'
    # ... 24 categorias de status no total
```

Os 24 status identificados revelaram padrões que não estavam documentados, como:

- Volume expressivo de **TMM** (troca de marca/modelo) — tratativa que precisava de fluxo próprio no sistema
- Presença de **NAF** (Nota de Autorização de Fornecimento) e **Ordens de Fornecimento** como entidades distintas de empenhos
- Necessidade de rastrear **reforços** (cobranças) por prazo excedido, com histórico de datas

Essa análise foi determinante para a definição dos campos do modelo de dados, dos tipos de solicitação e dos prazos de alerta configuráveis.

### Regras de negócio que emergiram da análise

A partir dos dados, foram identificadas e formalizadas regras que antes eram tácitas:

**Sobre TMM:**
- Ao aceitar uma TMM, os campos `Marca Atual` e `Marca Substituta` devem ser renomeados para `Marca Antiga` e `Marca Nova`, preservando o histórico
- A TMM aceita **não vai direto para Faturamento** — fica em "Aceita" até que a responsável confirme a entrega para o time de faturamento

**Sobre prazos:**
- Cada tipo de solicitação tem um prazo configurável separado (Dispensa: 7 dias, TMM: 10 dias, Reequilíbrio: 10 dias)
- Ao exceder o prazo sem resposta, o card recebe um marcador vermelho
- É possível registrar **reforços** (cobranças) com data e observação, que alteram o marcador para azul

**Sobre itens do empenho:**
- Um empenho pode ter múltiplos itens, cada um com produto, quantidade, valor unitário, marca/modelo e número do item
- O valor total do empenho é calculado automaticamente pela soma dos itens
- Os produtos e marcas/modelos são gerenciados em cadastro próprio, com status ativo/inativo para marcas não disponíveis no momento

### Migração inicial dos dados

O banco de dados foi populado a partir da planilha de controle histórico utilizando Python, gerando:

- **1.220 tickets únicos** importados no MongoDB
- **645 órgãos** extraídos e importados
- **197 produtos** únicos catalogados
- **620 marcas/modelos** associadas aos produtos

```python
# Agrupamento de itens por ticket
tickets = {}
for _, row in df_filtrado.iterrows():
    ticket = str(row['TICKET']).strip()
    if ticket not in tickets:
        tickets[ticket] = { 'ticket': ticket, 'itens': [], 'valor': 0, ... }
    tickets[ticket]['itens'].append({
        'produto': get_produto(row),
        'marcaModelo': safe_str(row['MARCA/MODELO']),
        'quantidade': safe_float(row['QTD']),
        'valorTotal': safe_float(row['VENDA TOTAL']),
    })
```

---

## Mapeamento do Fluxo de Processos

Antes do desenvolvimento, o fluxo de trabalho foi mapeado em detalhes junto à equipe.

### Pessoas envolvidas

| Responsável | Papel no processo |
|-------------|------------------|
| **Usuário 01** | Mapeia licitações nos portais, transmite propostas e documentos de habilitação |
| **Usuário 02** | Recebe e-mails dos órgãos, assina atas e contratos, lista empenhos na planilha gerando ticket |
| **Usuário 03** | Renomeia arquivos dos empenhos, envia tratativas por e-mail, monitora e-mails e WhatsApp dos órgãos |
| **Usuário 04** | Pega empenhos na pasta, verifica aptidão para faturar e cadastra no sistema |
| **Usuário 05** | Atualiza documentos de habilitação, solicita cotação de frete e emite nota fiscal |

### Fluxo mapeado

```
Órgão envia empenho/OF por e-mail
        ↓
Usuário 02 recebe → lista na planilha → gera ticket → confirma recebimento ao órgão
        ↓
Usuário 03 renomeia o arquivo e move para pasta
        ↓
Usuário 04 pega na pasta → verifica aptidão para faturar
        ↓
   ┌────┴────┐
  APTO    NÃO APTO
   ↓          ↓
Cadastra   Usuário 03 classifica a tratativa:
no sistema  ├── Dispensa (valor baixo)
   ↓         ├── TMM (item indisponível, solicitar troca ao órgão)
Usuário 05  └── Reequilíbrio (preço defasado, enviar solicitação formal)
solicita
frete → emite NF
```

---

## Levantamento de Requisitos

### Requisitos Funcionais

**Módulo Empenhos**
- RF01 — Cadastrar empenhos com ticket, órgão, empresa, nº do empenho, data de recebimento, data de listagem, múltiplos itens (produto, qtd, valor unitário, marca/modelo) e valor total calculado automaticamente
- RF02 — Visualizar empenhos em kanban por colunas: Recebido → Listado → Faturamento
- RF03 — Mover empenhos entre colunas
- RF04 — Filtrar empenhos por empresa (EGC, GWC, SEGINFO)
- RF05 — Criar solicitação (Dispensa, TMM, Reequilíbrio) a partir de um empenho em "Listado", com pop-up de preenchimento antes de mover
- RF06 — Marcar empenho como Faturado

**Módulo Solicitações**
- RF07 — Visualizar solicitações em kanban: Enviada → Aceita → Negada → Cancelada
- RF08 — Ao aceitar TMM, renomear campos de marca e manter em "Aceita" (não ir direto para Faturamento)
- RF09 — Botão explícito "Enviar para Faturamento" a partir de "Aceita"
- RF10 — Registrar reforços (cobranças) com data e observação
- RF11 — Marcador visual de alerta por prazo: verde (no prazo), azul (reforço feito), vermelho (prazo excedido)

**Módulo Faturados**
- RF12 — Listar empenhos faturados com busca por ticket, órgão e período

**Módulo Atendimento**
- RF13 — Registrar demandas de e-mail e WhatsApp
- RF14 — Vincular atendimento a ticket, ata ou contrato
- RF15 — Filtrar por órgão, empresa, canal e prioridade
- RF16 — Visualizar por colunas: Sinalizado → Encaminhado → Resolvido

**Módulo Órgãos**
- RF17 — Cadastrar órgãos com nome, UASG, município, estado, e-mails, telefones e observações
- RF18 — Visualizar histórico de empenhos vinculados ao órgão

**Módulo Tarefas**
- RF19 — Kanban de tarefas do dia: A Fazer → Pendente → Resolvido
- RF20 — Campos: nome, quem solicitou, prioridade, empresa, órgão, ticket, NF, tipo, prazo, recorrente, observações
- RF21 — Na coluna "Pendente": registrar a quem recorrer e motivo da dúvida
- RF22 — Alertas de tarefas e solicitações com prazo excedido
- RF23 — Acesso rápido a sistemas externos (transportadoras, SIGE) com login/senha salvo localmente

**Módulo Documentos**
- RF24 — Gerador de e-mails para TMM, Dispensa e Reequilíbrio a partir de modelos com variáveis `{{campo}}`
- RF25 — Gerador de planilha de reequilíbrio com download em `.xlsx`
- RF26 — Modelos editáveis diretamente no sistema

**Módulo Atas/Contratos**
- RF27 — Cadastrar atas e contratos vinculados a órgãos, com itens, vigência, valor e status

**Módulo Tickets**
- RF28 — Listagem completa de todos os tickets com filtros avançados: data, valor, órgão, empresa, empenho, produto, marca, status

**Configurações**
- RF29 — Gerenciar responsáveis com cor de identificação
- RF30 — Configurar prazos de alerta por tipo de solicitação
- RF31 — Gerenciar produtos e marcas/modelos (com status ativo/inativo por marca)
- RF32 — Gerenciar empresas do grupo
- RF33 — Configurar tipos de solicitação com campos personalizáveis
- RF34 — Lista de preços por produto

### Requisitos Não Funcionais

- RNF01 — Autenticação segura com Clerk
- RNF02 — Interface estilo ERP: fundo cinza, page headers brancos, tabelas limpas
- RNF03 — Persistência em nuvem com MongoDB Atlas
- RNF04 — Deploy automatizado via GitHub → Vercel (frontend) e Railway (backend)
- RNF05 — Instalável como PWA na área de trabalho

---

## Decisões de Arquitetura e Tecnologia

### Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | React + Vite | Componentização por módulos; HMR eficiente para desenvolvimento |
| Backend | Node.js + Express | JavaScript unificado; API REST simples e extensível |
| Banco de dados | MongoDB Atlas | Modelo de documentos flexível para variações de campos entre módulos |
| Autenticação | Clerk | Suporte a múltiplos usuários sem implementar fluxo de login do zero |
| Análise de dados | Python + Pandas + Google Colab | Mineração e migração inicial dos dados históricos |
| Hospedagem frontend | Vercel | Deploy automático via GitHub, CDN global |
| Hospedagem backend | Railway | Servidor Node.js com variáveis de ambiente seguras |

### Por que MongoDB?

O modelo de negócio tem variações de campos entre módulos — uma solicitação de TMM tem campos de marca que uma Dispensa não tem; um atendimento vinculado a uma ata tem campos diferentes de um vinculado a um ticket. O modelo de documentos absorve essas variações sem a necessidade de múltiplas tabelas com joins complexos.

---

## Módulos do Sistema

```
server/
├── models/
│   ├── Empenho.js        # Tickets com itens, reforços, histórico
│   ├── Orgao.js          # Órgãos com UASG
│   ├── Atendimento.js    # Demandas por e-mail e WhatsApp
│   ├── Produto.js        # Catálogo de produtos
│   ├── Marca.js          # Marcas/modelos com status ativo/inativo
│   └── AtaContrato.js    # Atas e contratos vinculados a órgãos
└── routes/
    ├── empenhos.js
    ├── orgaos.js
    ├── atendimentos.js
    ├── produtos.js
    ├── marcas.js
    └── atascontratos.js

src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Navegação com engrenagem de configurações
│   │   └── Layout.jsx
│   └── workflow/
│       ├── ModuloEmpenhos.jsx  # Kanban com múltiplos itens por empenho
│       ├── ModuloSolicitacoes.jsx  # Com alertas e reforços
│       ├── ModuloFaturados.jsx
│       └── NovoEmpenhoModal.jsx    # Formulário com itens e valor calculado
├── pages/
│   ├── Workflow.jsx
│   ├── Atendimento.jsx
│   ├── Orgaos.jsx
│   ├── Tarefas.jsx         # Central do dia: kanban + alertas + acesso rápido
│   ├── Documentos.jsx      # Gerador de e-mails e planilhas
│   └── Configuracoes.jsx   # Abas: responsáveis, prazos, produtos, marcas, empresas, tipos
└── services/
    └── api.js              # empenhoService, orgaoService, produtoService, marcaService, ataContratoService
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
cd Gestao_licitacoes
npm install
npm run dev
```

Crie `.env` na raiz:

```env
VITE_CLERK_PUBLISHABLE_KEY=sua_chave_clerk
VITE_API_URL=http://localhost:3001/api
```

### Backend

```bash
cd server
npm install
npm run dev
```

Crie `server/.env`:

```env
MONGODB_URI=sua_connection_string_mongodb
PORT=3001
```

### Migração de dados históricos (opcional)

Para popular o banco a partir de uma planilha de controle de tickets no formato usado pelo sistema:

```bash
# No Google Colab, com a planilha no Google Drive
pip install pymongo pandas openpyxl
# Execute o script de migração disponível em /scripts/migrar_planilha.py
```

---

## Roadmap

O sistema está em produção e em uso pela equipe. As próximas evoluções planejadas:

- [ ] **Página Tickets** — listagem completa com filtros avançados
- [ ] **Página Atas/Contratos** — cadastro e gestão vinculada a órgãos
- [ ] **Módulo Documentos** — gerador de e-mails e planilhas com modelos editáveis
- [ ] **PWA** — instalação como app na área de trabalho
- [ ] **Integração N8N** — automação do recebimento de mensagens do WhatsApp
- [ ] **Notificações em tempo real** — alertas via WebSocket
- [ ] **Histórico de movimentações** — log de cada alteração por usuário e data
- [ ] **Exportação de relatórios** — PDF/Excel com filtros por período

---

## Sobre o Projeto

Este projeto nasceu de uma necessidade real identificada no ambiente de trabalho. O desenvolvimento partiu da **análise de dados históricos** (42.009 e-mails + 10.419 registros em planilha), passou pelo levantamento de requisitos junto à equipe e mapeamento de fluxo, e resultou em uma aplicação full-stack completa — do banco de dados à interface. O ciclo entre análise, descoberta de padrões e refinamento das regras de negócio foi iterativo e contínuo.

**Desenvolvido por Amanda Alves**
Estudante de Análise e Desenvolvimento de Sistemas — Senac Recife
Estudante de Gestão da Informação — UFPE