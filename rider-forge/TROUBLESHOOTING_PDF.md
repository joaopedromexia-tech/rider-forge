# Resolução de Problemas - Importação de PDFs

## Erros Comuns e Soluções

### 1. Erro: "Setting up fake worker failed: Failed to fetch dynamically imported module"

**Causa**: Problema com o carregamento do worker do PDF.js

**Soluções**:
- ✅ **Solução Implementada**: O sistema agora tenta automaticamente processar o PDF sem worker
- ✅ **Verificar**: Certifique-se de que o PDF é válido e contém texto extraível
- ✅ **Alternativa**: Tente com um PDF diferente para testar

### 2. Erro: "Não foi possível extrair texto do PDF"

**Causa**: O PDF não contém texto extraível ou está corrompido

**Soluções**:
- ✅ **Verificar formato**: Certifique-se de que é um PDF válido
- ✅ **Texto extraível**: O PDF deve conter texto, não apenas imagens
- ✅ **Qualidade**: PDFs digitalizados devem ter boa qualidade de OCR
- ✅ **Proteção**: Verifique se o PDF não está protegido com senha

### 3. Erro: "Formato de ficheiro não suportado"

**Causa**: O arquivo não é um PDF válido

**Soluções**:
- ✅ **Verificar extensão**: Certifique-se de que o arquivo tem extensão `.pdf`
- ✅ **Verificar tipo**: O arquivo deve ser do tipo `application/pdf`
- ✅ **Corrupção**: Verifique se o arquivo não está corrompido

### 4. Erro: "PDF não pode ser processado"

**Causa**: Problema geral de processamento

**Soluções**:
- ✅ **Tamanho**: Verifique se o PDF não é muito grande (>50MB)
- ✅ **Complexidade**: PDFs muito complexos podem falhar
- ✅ **Versão**: Tente com uma versão mais simples do PDF

## Dicas para PDFs Bem-Sucedidos

### ✅ PDFs que Funcionam Bem
- PDFs criados digitalmente (Word, Google Docs, etc.)
- PDFs exportados de aplicações de edição
- PDFs digitalizados com OCR de boa qualidade
- PDFs com formatação simples e clara

### ❌ PDFs que Podem Ter Problemas
- PDFs apenas com imagens (sem OCR)
- PDFs protegidos com senha
- PDFs muito grandes (>50MB)
- PDFs com formatação muito complexa
- PDFs corrompidos ou danificados

## Processo de Debug

### 1. Verificar o PDF
```bash
# Verificar se o PDF é válido
file nome_do_arquivo.pdf
```

### 2. Testar com PDF Simples
- Crie um PDF simples com texto básico
- Teste a importação com esse PDF
- Se funcionar, o problema está no PDF original

### 3. Verificar Console do Browser
- Abra as ferramentas de desenvolvedor (F12)
- Vá para a aba Console
- Tente importar o PDF e verifique as mensagens de erro

## Estrutura Recomendada para PDFs

### Formato Ideal
```
DADOS GERAIS
============
Artista: Nome do Artista
Local: Local do Evento
Data: DD/MM/AAAA
Hora: HH:MM

SISTEMA PA
==========
Sistema: Descrição do sistema

CONSOLAS
========
Consola: Descrição da consola

INPUT LIST
==========
1. Instrumento: Microfone
2. Instrumento: Microfone

OBSERVAÇÕES FINAIS
==================
- Observação 1
- Observação 2
```

### Evitar
- Formatação muito complexa
- Tabelas muito elaboradas
- Imagens sem texto alternativo
- Caracteres especiais não padrão

## Limitações Conhecidas

### Técnicas
- PDFs com mais de 50MB podem ser lentos
- PDFs com muitas páginas podem demorar
- Alguns PDFs muito antigos podem não funcionar
- PDFs com fontes muito específicas podem ter problemas

### Funcionais
- O sistema reconhece seções padrão da indústria
- Seções com nomes muito específicos podem não ser reconhecidas
- Formatações muito complexas podem ser perdidas
- Tabelas complexas podem ser simplificadas

## Suporte

Se continuar a ter problemas:

1. **Teste com PDF diferente**: Use um PDF simples para verificar se a funcionalidade funciona
2. **Verifique o formato**: Certifique-se de que o PDF está bem estruturado
3. **Console do browser**: Verifique se há erros específicos no console
4. **Tamanho do arquivo**: Tente com um PDF menor
5. **Qualidade**: Se for um PDF digitalizado, verifique a qualidade do OCR

## Alternativas

Se a importação de PDF não funcionar:

1. **Criar manualmente**: Use a interface do RiderForge para criar o rider
2. **Converter para texto**: Extraia o texto do PDF e cole manualmente
3. **Usar JSON**: Se tiver acesso ao JSON original, use esse formato
4. **Digitalizar melhor**: Se for um PDF digitalizado, tente digitalizar com melhor qualidade

---

**Nota**: A funcionalidade de importação de PDFs está em constante melhoria. Problemas específicos podem ser reportados para futuras atualizações.
