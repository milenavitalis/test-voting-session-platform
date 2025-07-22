# Plataforma Digital de Sessões de Votação Cooperativista

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

### Observações Importantes

O arquivo .env foi comitado no repositório apenas para facilitar os testes e a avaliação
