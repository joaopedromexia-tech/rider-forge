# Guia de Diagnóstico - Problemas com PDFs

## Diagnóstico Automático

O sistema agora inclui diagnóstico automático que verifica:

### ✅ Verificações Realizadas
1. **Tipo de arquivo**: Confirma se é um PDF válido
2. **Tamanho**: Verifica se não excede 50MB
3. **Extração de texto**: Testa se o texto pode ser extraído
4. **Número de páginas**: Conta as páginas do PDF
5. **Comprimento do texto**: Verifica se há texto extraível

### 🔍 Informações de Diagnóstico

Quando um PDF falha, o sistema mostra:
- **Nome do arquivo**
- **Tamanho em bytes**
- **Tipo MIME**
- **Número de páginas** (se conseguido)
- **Comprimento do texto extraído** (se conseguido)
- **Lista de problemas encontrados**

## Problemas Comuns e Soluções

### 1. "Tipo de arquivo inválido"
**Sintoma**: Arquivo não é reconhecido como PDF
**Causa**: Arquivo com extensão .pdf mas não é um PDF real
**Solução**:
- Verificar se o arquivo foi corrompido durante download
- Tentar abrir o arquivo num leitor de PDF
- Redownloadar o arquivo

### 2. "Arquivo muito grande (>50MB)"
**Sintoma**: PDF excede o limite de tamanho
**Causa**: PDF com muitas imagens ou páginas
**Solução**:
- Comprimir o PDF usando ferramentas online
- Dividir o PDF em partes menores
- Remover imagens desnecessárias

### 3. "Erro ao extrair texto"
**Sintoma**: PDF válido mas texto não pode ser extraído
**Causa**: PDF protegido, corrompido ou apenas com imagens
**Solução**:
- Verificar se o PDF tem proteção por senha
- Tentar com um PDF diferente
- Usar ferramenta de OCR se for PDF digitalizado

### 4. "O PDF não contém texto extraível"
**Sintoma**: PDF carrega mas não tem texto
**Causa**: PDF apenas com imagens ou digitalizado sem OCR
**Solução**:
- Converter PDF para texto usando ferramentas online
- Usar OCR para PDFs digitalizados
- Criar o rider manualmente

## Estratégias de Fallback Implementadas

### Estratégia 1: Worker Configurado
- Usa worker para processamento paralelo
- Mais rápido para PDFs grandes
- Pode falhar em alguns browsers

### Estratégia 2: Sem Worker
- Processamento síncrono
- Mais compatível
- Pode ser mais lento

### Estratégia 3: Configurações Mínimas
- Configurações mais básicas
- Último recurso
- Máxima compatibilidade

## Logs de Diagnóstico

### Console do Browser
Abra as ferramentas de desenvolvedor (F12) e vá para a aba Console para ver:

```
Testando PDF antes do processamento...
Resultado do teste: {
  name: "rider.pdf",
  size: 1024000,
  type: "application/pdf",
  isValid: true,
  canExtractText: false,
  pages: 0,
  textLength: 0,
  issues: ["Erro ao extrair texto: ..."]
}
```

### Informações Úteis
- **Tentando processar PDF com worker...**
- **Estratégia 1 falhou: [erro]**
- **Tentando processar PDF sem worker...**
- **Estratégia 2 falhou: [erro]**
- **Tentando processar PDF com configurações mínimas...**
- **Estratégia 3 falhou: [erro]**

## Teste Manual de PDF

### Passo 1: Verificar no Browser
1. Abra o PDF no browser
2. Tente selecionar texto (Ctrl+A)
3. Se conseguir copiar texto, o PDF é extraível

### Passo 2: Verificar no Adobe Reader
1. Abra o PDF no Adobe Reader
2. Vá para File > Properties
3. Verifique se há restrições de segurança

### Passo 3: Verificar Tamanho
1. Clique com botão direito no arquivo
2. Vá para Properties
3. Verifique o tamanho (deve ser < 50MB)

## Ferramentas de Conversão

### Online (Gratuitas)
- **Adobe PDF to Text**: https://www.adobe.com/acrobat/online/pdf-to-text.html
- **SmallPDF**: https://smallpdf.com/pdf-to-text
- **ILovePDF**: https://www.ilovepdf.com/pdf_to_text

### Desktop
- **Adobe Acrobat Pro**: Conversão profissional
- **PDF24**: Software gratuito
- **Calibre**: Para conversão em lote

## Estrutura de PDF Recomendada

### ✅ Formato Ideal
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

### ❌ Evitar
- Formatação muito complexa
- Tabelas muito elaboradas
- Imagens sem texto alternativo
- Caracteres especiais não padrão
- PDFs protegidos com senha

## Comandos de Diagnóstico

### Verificar Tipo de Arquivo (Terminal)
```bash
file nome_do_arquivo.pdf
```

### Verificar Tamanho (Terminal)
```bash
ls -lh nome_do_arquivo.pdf
```

### Verificar Integridade (Terminal)
```bash
pdfinfo nome_do_arquivo.pdf
```

## Suporte Técnico

Se continuar a ter problemas:

1. **Capture os logs**: Copie as mensagens do console
2. **Teste com PDF simples**: Use o exemplo fornecido
3. **Verifique o browser**: Teste em Chrome, Firefox, Safari
4. **Desative extensões**: Teste em modo incógnito
5. **Contacte suporte**: Forneça logs e informações do PDF

---

**Nota**: Este guia é atualizado regularmente com base nos problemas encontrados pelos utilizadores.
