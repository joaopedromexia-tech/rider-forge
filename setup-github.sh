#!/bin/bash

echo "🚀 Configuração do GitHub para RiderForge"
echo "=========================================="

# Verificar se o usuário forneceu o nome de usuário
if [ -z "$1" ]; then
    echo "❌ Erro: Por favor, forneça o seu nome de usuário do GitHub"
    echo "Uso: ./setup-github.sh SEU_USUARIO_GITHUB"
    echo "Exemplo: ./setup-github.sh joaosilva"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="rider-forge"

echo "📋 Configurando repositório para: $GITHUB_USERNAME/$REPO_NAME"
echo ""

# Verificar se o git está configurado
if ! git config --get user.name > /dev/null 2>&1; then
    echo "⚠️  Git não está configurado. Configurando..."
    read -p "Digite o seu nome: " USER_NAME
    read -p "Digite o seu email: " USER_EMAIL
    git config --global user.name "$USER_NAME"
    git config --global user.email "$USER_EMAIL"
fi

# Adicionar remote origin
echo "🔗 Adicionando remote origin..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Verificar se o remote foi adicionado corretamente
if git remote -v | grep -q "$GITHUB_USERNAME/$REPO_NAME"; then
    echo "✅ Remote origin configurado com sucesso!"
else
    echo "❌ Erro ao configurar remote origin"
    exit 1
fi

echo ""
echo "📝 Próximos passos:"
echo "1. Crie o repositório no GitHub: https://github.com/new"
echo "2. Nome do repositório: $REPO_NAME"
echo "3. NÃO adicione README, .gitignore ou license (já temos)"
echo "4. Clique em 'Create repository'"
echo ""
echo "5. Depois execute: git push -u origin main"
echo ""
echo "🔗 URL do seu repositório será: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
