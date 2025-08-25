# 🚀 Guia Visual - Enviar RiderForge para GitHub

## 📋 Pré-requisitos

- Conta no GitHub
- Git instalado no computador
- Projeto RiderForge pronto

## 🔧 Passo 1: Criar Repositório no GitHub

### 1.1 Aceder ao GitHub
1. Abra [github.com](https://github.com) no browser
2. Faça login na sua conta

### 1.2 Criar Novo Repositório
1. Clique no botão **"+"** no canto superior direito
2. Selecione **"New repository"**

### 1.3 Configurar Repositório
```
Repository name: rider-forge
Description: Criador de riders técnicos profissionais com interface moderna
Visibility: Public (ou Private)
```

**⚠️ IMPORTANTE:**
- ❌ NÃO marque "Add a README file"
- ❌ NÃO marque "Add .gitignore"
- ❌ NÃO marque "Choose a license"

### 1.4 Criar Repositório
1. Clique em **"Create repository"**
2. Guarde a URL do repositório (ex: `https://github.com/SEU_USUARIO/rider-forge`)

## 🔗 Passo 2: Configurar Git Local

### 2.1 Usar o Script Automático (Recomendado)
```bash
# Execute o script com o seu nome de usuário do GitHub
./setup-github.sh SEU_USUARIO_GITHUB

# Exemplo:
./setup-github.sh joaosilva
```

### 2.2 Ou Configurar Manualmente
```bash
# Adicionar remote origin
git remote add origin https://github.com/SEU_USUARIO/rider-forge.git

# Verificar se foi adicionado
git remote -v
```

## 📤 Passo 3: Enviar para GitHub

### 3.1 Fazer Push
```bash
# Enviar código para GitHub
git push -u origin main
```

### 3.2 Verificar no GitHub
1. Aceda ao seu repositório no GitHub
2. Confirme que todos os ficheiros estão lá

## 🔄 Passo 4: Atualizações Futuras

Para enviar atualizações futuras:
```bash
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push
```

## 🚨 Troubleshooting

### Erro: "Repository not found"
- Verifique se o nome de usuário está correto
- Confirme que o repositório foi criado no GitHub

### Erro: "Authentication failed"
- Configure autenticação GitHub:
  ```bash
  # Usar Personal Access Token
  git remote set-url origin https://SEU_TOKEN@github.com/SEU_USUARIO/rider-forge.git
  ```

### Erro: "Permission denied"
- Verifique se tem permissões no repositório
- Confirme que está logado no GitHub

## 📝 Comandos Úteis

```bash
# Verificar status
git status

# Verificar remotes
git remote -v

# Verificar branch atual
git branch

# Verificar configuração Git
git config --list
```

## 🎯 Próximos Passos

Após enviar para GitHub:

1. **Configurar Vercel**:
   - Conectar repositório GitHub ao Vercel
   - Configurar variáveis de ambiente

2. **Configurar Supabase**:
   - Executar script SQL
   - Configurar OAuth

3. **Configurar Stripe**:
   - Criar produto Pro (€3.99/ano)
   - Configurar webhooks

## 📞 Ajuda

Se encontrar problemas:
1. Verifique se o repositório existe no GitHub
2. Confirme que o nome de usuário está correto
3. Verifique se o Git está configurado
4. Consulte a documentação do GitHub

**Boa sorte! 🚀**
