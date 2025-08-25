# 🚀 Guia de Deploy RiderForge

Este guia irá ajudá-lo a fazer deploy do RiderForge usando Vercel, Supabase e Stripe.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Conta no [Stripe](https://stripe.com)
- Git instalado no seu computador

## 🗄️ 1. Configuração do Supabase

### 1.1 Criar projeto no Supabase

1. Aceda a [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Guarde o **Project URL** e **anon public key**

### 1.2 Configurar a base de dados

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute o script `supabase-setup.sql` que está na raiz do projeto
3. Este script irá criar:
   - Tabela `profiles` para perfis de utilizador
   - Tabela `riders` para os riders técnicos
   - Tabela `subscriptions` para subscrições Pro
   - Políticas de segurança (RLS)
   - Storage bucket para PDFs

### 1.3 Configurar autenticação OAuth

1. No dashboard do Supabase, vá para **Authentication > Settings**
2. Configure os providers OAuth:
   - **Google**: Adicione Client ID e Client Secret
   - **GitHub**: Adicione Client ID e Client Secret

### 1.4 Obter chaves de API

1. Vá para **Settings > API**
2. Copie:
   - **Project URL**
   - **anon public key**
   - **service_role key** (para as API routes)

## 💳 2. Configuração do Stripe

### 2.1 Criar conta no Stripe

1. Aceda a [stripe.com](https://stripe.com) e crie uma conta
2. Complete a configuração da conta

### 2.2 Criar produtos e preços

1. No dashboard do Stripe, vá para **Products**
2. Crie um produto:
   - **Rider Forge Pro** (€3.99/ano)
3. Guarde o **Price ID** do produto

### 2.3 Configurar webhooks

1. No dashboard do Stripe, vá para **Developers > Webhooks**
2. Crie um novo webhook endpoint:
   - **URL**: `https://your-domain.vercel.app/api/webhook-stripe`
   - **Events**: Selecione todos os eventos relacionados a subscrições
3. Guarde o **Webhook Secret**

### 2.4 Obter chaves de API

1. Vá para **Developers > API keys**
2. Copie:
   - **Publishable key**
   - **Secret key** (para as API routes)

## 🌐 3. Deploy no Vercel

### 3.1 Preparar o projeto

1. Certifique-se de que todas as dependências estão instaladas:
   ```bash
   npm install
   ```

2. Teste o build localmente:
   ```bash
   npm run build
   ```

### 3.2 Fazer deploy

1. Aceda a [vercel.com](https://vercel.com) e crie uma conta
2. Conecte o seu repositório GitHub/GitLab
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Configurar variáveis de ambiente

No dashboard do Vercel, vá para **Settings > Environment Variables** e adicione:

#### Variáveis do cliente (VITE_*):
```
VITE_SUPABASE_URL=sua_supabase_project_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=sua_stripe_publishable_key
VITE_STRIPE_PRO_ANNUAL_PRICE_ID=price_seu_annual_price_id
```

#### Variáveis do servidor:
```
STRIPE_SECRET_KEY=sk_test_sua_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
SUPABASE_URL=sua_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=sua_supabase_service_role_key
```

### 3.4 Configurar domínio personalizado (opcional)

1. No dashboard do Vercel, vá para **Settings > Domains**
2. Adicione o seu domínio personalizado
3. Configure os registos DNS conforme indicado

## 🔧 4. Configurações finais

### 4.1 Atualizar URLs de callback

1. No Supabase, vá para **Authentication > Settings**
2. Atualize as **Site URLs** com o seu domínio Vercel
3. Adicione as URLs de callback:
   - `https://your-domain.vercel.app/dashboard`
   - `https://your-domain.vercel.app/auth/callback`

### 4.2 Testar a aplicação

1. Aceda à sua aplicação no Vercel
2. Teste:
   - Registar/entrar com OAuth
   - Criar um rider
   - Fazer upgrade para Pro
   - Exportar PDF

## 🚨 5. Troubleshooting

### Problemas comuns:

#### Erro de CORS
- Verifique se as URLs estão corretas no Supabase
- Certifique-se de que o domínio está na lista de sites permitidos

#### Erro de autenticação
- Verifique se as chaves do Supabase estão corretas
- Confirme se o OAuth está configurado corretamente

#### Erro de pagamento
- Verifique se as chaves do Stripe estão corretas
- Confirme se os webhooks estão configurados
- Teste com cartões de teste do Stripe

#### Erro de build
- Verifique se todas as dependências estão instaladas
- Confirme se o Node.js versão é compatível (18+)

## 📊 6. Monitorização

### 6.1 Vercel Analytics
- Ative o Vercel Analytics para monitorizar performance
- Configure alertas para erros

### 6.2 Supabase Dashboard
- Monitore a base de dados no dashboard do Supabase
- Configure alertas para uso de recursos

### 6.3 Stripe Dashboard
- Monitore pagamentos e subscrições
- Configure alertas para falhas de pagamento

## 🔒 7. Segurança

### 7.1 Variáveis de ambiente
- Nunca commite chaves secretas no Git
- Use sempre variáveis de ambiente
- Rotacione chaves regularmente

### 7.2 Row Level Security
- O Supabase já está configurado com RLS
- Verifique se as políticas estão corretas

### 7.3 HTTPS
- O Vercel fornece HTTPS automaticamente
- Configure HSTS se necessário

## 📈 8. Escalabilidade

### 8.1 Performance
- O Vercel oferece CDN global
- O Supabase escala automaticamente
- Configure cache quando necessário

### 8.2 Custos
- Vercel: Gratuito para projetos pessoais
- Supabase: Gratuito até 500MB de base de dados
- Stripe: 2.9% + €0.30 por transação (apenas €0.12 por subscrição anual)

## 🎉 9. Próximos passos

1. **Marketing**: Configure Google Analytics e SEO
2. **Suporte**: Configure um sistema de tickets
3. **Backup**: Configure backups automáticos da base de dados
4. **Monitorização**: Configure alertas e logs
5. **Testes**: Implemente testes automatizados

---

## 📞 Suporte

Se encontrar problemas durante o deploy:

1. Verifique os logs no Vercel
2. Consulte a documentação do Supabase e Stripe
3. Abra uma issue no GitHub do projeto

**Boa sorte com o seu deploy! 🚀**
