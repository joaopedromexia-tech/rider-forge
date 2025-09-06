# 🔧 Variáveis de Ambiente para Vercel

## 📋 Variáveis do Cliente (VITE_*)

Adicione estas variáveis no Vercel Dashboard → Settings → Environment Variables

### Supabase
```
VITE_SUPABASE_URL=sua_supabase_project_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
VITE_AUTH_REDIRECT_URL=https://seu-dominio.vercel.app
```

### Stripe
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_stripe_publishable_key
VITE_STRIPE_PRO_ANNUAL_PRICE_ID=price_seu_annual_price_id
```

## 🔒 Variáveis do Servidor

### Stripe (para API routes)
```
STRIPE_SECRET_KEY=sk_test_sua_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
```

### Supabase (para API routes)
```
SUPABASE_URL=sua_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=sua_supabase_service_role_key
```

## 📝 Como obter estas variáveis:

### Supabase:
1. Vá para [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá para Settings → API
4. Copie:
   - Project URL
   - anon public key
   - service_role key

### Stripe:
1. Vá para [stripe.com](https://stripe.com)
2. Crie uma conta
3. Vá para Developers → API keys
4. Copie:
   - Publishable key
   - Secret key
5. Crie um produto Pro (€3.99/ano)
6. Copie o Price ID

## ⚠️ Importante:
- Use sempre as chaves de **TEST** para desenvolvimento
- Mude para **LIVE** quando estiver em produção
- Nunca commite estas chaves no Git
