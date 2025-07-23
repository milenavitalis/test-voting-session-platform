# Plataforma Digital de Sessões de Votação

## Contexto do Negócio

No modelo de cooperativismo, decisões importantes são tomadas em assembleias por meio de votação.  
Esta plataforma digital visa modernizar esse processo, permitindo que associados participem de votações remotamente, de forma segura e transparente.  
Nosso objetivo é construir o coração dessa plataforma.

---

## Objetivo Geral

Desenvolver uma aplicação Web FullStack para gerenciamento de sessões de votação, com:

- Backend em Python (FastAPI)
- Frontend em React.js com Redux
- Autenticação via token JWT
- Containerização completa com Docker Compose

---

## Funcionalidades

- Criação de Tópicos
- Abertura de Sessões com tempo configurável
- Votação "Sim" ou "Não" dentro do tempo permitido
- Cadastro e autenticação de usuários via CPF + senha (bcrypt + JWT)

---

## Como rodar a aplicação

A aplicação está toda containerizada e orquestrada via Docker Compose. Basta ter Docker e Docker Compose instalados.
Para iniciar todos os serviços (frontend, backend, banco de dados e testes), rode:

```bash
docker compose up --build
```

Se quiser rodar apenas o backend com os testes (por exemplo), rode:

```bash
docker compose up --build backend-test
```

Frontend rodando em: http://localhost:5173
Backend rodando em: http://localhost:8000
Swagger disponível em: http://localhost:8000/docs

### Testes Unitários

- O backend possui testes unitários escritos com pytest e pytest-asyncio.
- Os testes validam regras críticas do negócio, como criação de pauta, abertura de sessão, fluxo de voto, prevenção de votos duplicados e cálculo de resultado.
- A base de testes usa um banco de dados PostgreSQL isolado.
- Ainda há espaço para melhorar a cobertura e os casos de testes, especialmente para erros.

### Docker Compose e Ambiente

- Serviços definidos: frontend, backend, backend-test, db (PostgreSQL).
- Uso de volumes para facilitar desenvolvimento e persistência dos dados.
- Healthcheck configurado para garantir que o banco está pronto antes do backend iniciar.
- Rede docker personalizada para isolamento.
- Variáveis de ambiente definidas para configuração do banco e autenticação.

### Dívidas Técnicas e Próximos Passos

- Melhorias nos testes:
  Aumentar a cobertura, incluir testes de integração, mocks de serviços externos e simulação de concorrência.
- Validação externa de associado:
  Integrar consulta à API externa para validar se o CPF do associado está apto a votar.
- Automação de fechamento de sessões:
  Criar uma tarefa agendada (cron job) para fechar automaticamente as sessões que atingirem o tempo definido, evitando necessidade de ação manual.
- Notificação em tempo real:
  Implementar WebSocket para notificar usuários assim que a sessão de votação fechar, trazendo interação instantânea na UI.

  Durante o desenvolvimento e execução dos testes unitários, encontrei dificuldades relacionadas à execução concorrente das operações assíncronas com o banco de dados PostgreSQL usando SQLAlchemy AsyncSession e asyncpg.

Erros observados:

- sqlalchemy.exc.InterfaceError: cannot perform operation: another operation is in progress

Possível causa:

- Reutilização incorreta da mesma instância de conexão (db) entre múltiplos testes ou múltiplas await chamadas em sequência sem controle

- Sessão AsyncSession mal encerrada ou mal gerenciada nos testes

- Falta de um mock adequado ou isolamento completo do banco para testes

Solução ideal:
A solução ideal envolveria o isolamento completo das sessões e uso de banco dedicado ou in-memory para testes, como sqlite+aiosqlite.

### Estrutura do Banco

### User

Campo Tipo Observações
id Integer Chave primária
name String
cpf String Único e indexado
password_hash String Hash com bcrypt

### Topic

Campo Tipo Observações
id Integer Chave primária
title String Obrigatório
description String Opcional
created_at DateTime Criado automaticamente

### Session

Campo Tipo Observações
id Integer Chave primária
topic_id FK Relacionado ao tópico
start_time DateTime Início da sessão
duration_minutes Integer Default: 1 minuto
finish_time DateTime Fim da sessão

### Vote

Campo Tipo Observações
id Integer Chave primária
session_id FK Sessão correspondente
topic_id FK Redundância para facilitar queries
user_id FK Usuário que votou
vote String "Sim" ou "Não"

### Observações Importantes

O arquivo .env foi comitado no repositório apenas para facilitar os testes e a avaliação
Testei também fazer a consulta para a API externa, mas estava retornando erro 404 Not Found - [text](https://user-info.herokuapp.com/users/{cpf})
