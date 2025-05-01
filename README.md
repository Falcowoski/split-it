# DivideAí (SplitIt)

Um aplicativo para gestão financeira familiar, permitindo dividir despesas entre membros da família. 
Baseado no SplitWise, mas focado no cenário familiar.

## Sobre o Projeto

Este é um MVP (Minimum Viable Product) de um aplicativo para gestão de despesas compartilhadas. 
O DivideAí permite registrar despesas em grupos e acompanhar quem pagou o quê.

## Tecnologias Utilizadas

- React Native (com Expo SDK 53)
- TypeScript
- Supabase (PostgreSQL)
- UI Kitten (Componentes UI)
- React Navigation

## Instalação e Uso

### Pré-requisitos

- Node.js
- npm ou yarn
- Expo CLI
- Conta no Supabase

### Configuração do Banco de Dados

1. Crie um projeto no Supabase
2. Execute o script SQL fornecido no arquivo `database.sql`

### Configuração do Aplicativo

1. Clone o repositório
2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
    SUPABASE_URL=sua_url_do_supabase
    SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
    ```
3. Instale as dependências com `npm install`
4. Inicie o aplicativo com `npx expo start`

### Geração de APK

Para gerar um APK:

```bash
expo build -t apk
```

## Funcionalidades

- Cadastro de usuários
- Cadastro de formas de pagamento
- Criação de grupos de despesas
- Registro de despesas dentro de grupos
- Visualização de despesas por grupo

## Estrutura do Projeto

- `/src`: Código fonte do aplicativo
  - `/components`: Componentes reutilizáveis
  - `/screens`: Telas do aplicativo
  - `/navigation`: Configuração de navegação
  - `/services`: Serviços para API/Supabase
  - `/types`: Tipos TypeScript
  - `/utils`: Funções utilitárias

## Próximos Passos

- Implementação de autenticação
- Divisão de despesas entre usuários
- Histórico de pagamentos
- Gráficos e estatísticas
- Notificações