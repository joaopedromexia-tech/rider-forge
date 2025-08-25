# Guia de Importação de PDFs - RiderForge

## Visão Geral

O RiderForge agora suporta a importação de riders técnicos a partir de arquivos PDF. Esta funcionalidade permite extrair automaticamente informações de riders existentes e convertê-las em formato editável dentro da aplicação.

## Formatos Suportados

### 1. Arquivos JSON (Exportados do RiderForge)
- **Formato**: `.json`
- **Funcionamento**: Importação direta e imediata
- **Uso**: Ideal para partilhar riders entre utilizadores do RiderForge

### 2. Arquivos PDF (Riders Técnicos)
- **Formato**: `.pdf`
- **Funcionamento**: Processamento automático com preview
- **Uso**: Ideal para digitalizar riders existentes em papel ou formato PDF

## Como Importar PDFs

### Passo 1: Aceder à Importação
1. Navegue para a página "Os Meus Riders"
2. Clique no botão "Importar" no canto superior direito

### Passo 2: Selecionar Arquivo
1. Clique em "Selecionar arquivo JSON ou PDF"
2. Escolha um arquivo PDF com o seu rider técnico
3. O sistema irá automaticamente processar o PDF

### Passo 3: Preview e Confirmação
1. **Carregamento**: Aguarde o processamento do PDF
2. **Preview**: Visualize os dados extraídos organizados por seções:
   - Dados Gerais (Artista, Local, Data, Hora)
   - Sistema PA
   - Consolas
   - Sistemas de Escuta
   - Equipamento Auxiliar
   - Lista de Inputs
   - Monitor Mixes
   - Observações Finais

3. **Editar Nome**: Modifique o nome do rider se necessário
4. **Confirmar**: Clique em "Importar Rider" para finalizar

## Estrutura de Dados Reconhecida

O sistema reconhece automaticamente as seguintes seções em PDFs:

### Dados Gerais
- **Artista/Banda**: Nome do artista ou banda
- **Local/Venue**: Local do evento
- **Data**: Data do evento
- **Hora**: Horário do evento

### Sistema PA
- Sistemas de som principais
- Configurações de PA

### Consolas
- Mesas de mistura
- Consolas digitais/analógicas

### Sistemas de Escuta
- Monitores de palco
- Sistemas IEM (In-Ear Monitor)
- Monitores de retorno

### Equipamento Auxiliar
- Equipamentos adicionais
- Acessórios técnicos

### Lista de Inputs
- Número do input
- Instrumento
- Microfone
- Notas específicas

### Monitor Mixes
- Número do mix
- Instrumento
- Configurações (EQ, Comp, etc.)

### Observações Finais
- Notas gerais
- Comentários técnicos
- Observações importantes

## Limitações e Considerações

### Formatos de PDF Suportados
- ✅ PDFs com texto extraível
- ✅ PDFs digitalizados com OCR
- ❌ PDFs apenas com imagens (sem OCR)
- ❌ PDFs protegidos com senha

### Qualidade da Extração
- **Melhor resultado**: PDFs criados digitalmente
- **Resultado médio**: PDFs digitalizados com boa qualidade
- **Resultado limitado**: PDFs com baixa qualidade ou formatação complexa

### Seções Não Reconhecidas
- Seções com nomes muito específicos ou únicos
- Formatações muito complexas ou não padrão
- Tabelas muito complexas

## Dicas para Melhor Extração

### 1. Estrutura do PDF
- Use títulos de seção claros (ex: "Dados Gerais", "PA", "Consolas")
- Mantenha uma formatação consistente
- Use dois pontos (:) ou igual (=) para separar campos e valores

### 2. Nomenclatura
- Use termos padrão da indústria
- Evite abreviações muito específicas
- Mantenha consistência na nomenclatura

### 3. Formatação
- Use listas numeradas para inputs e mixes
- Separe claramente as diferentes seções
- Mantenha o texto legível e bem estruturado

## Processo de Importação

### Para PDFs:
1. **Upload** → Seleção do arquivo
2. **Processamento** → Extração de texto e análise
3. **Preview** → Visualização dos dados extraídos
4. **Edição** → Ajuste do nome (opcional)
5. **Importação** → Criação do rider editável

### Para JSONs:
1. **Upload** → Seleção do arquivo
2. **Importação** → Criação imediata do rider

## Resolução de Problemas

### Erro: "Formato de ficheiro não suportado"
- Verifique se o arquivo é um PDF válido
- Certifique-se de que o arquivo não está corrompido

### Erro: "Erro ao processar PDF"
- O PDF pode estar protegido ou corrompido
- Tente com um PDF diferente
- Verifique se o PDF tem texto extraível

### Dados extraídos incorretamente
- Verifique a formatação do PDF original
- Certifique-se de que as seções têm títulos claros
- Edite manualmente os dados após a importação

### Preview não mostra dados
- O PDF pode não ter dados estruturados reconhecíveis
- O rider será importado como documento vazio
- Adicione os dados manualmente após a importação

## Suporte

Se encontrar problemas com a importação de PDFs:

1. Verifique se o PDF está num formato suportado
2. Teste com um PDF mais simples primeiro
3. Verifique a formatação do PDF original
4. Contacte o suporte se o problema persistir

---

**Nota**: A funcionalidade de importação de PDFs está disponível em todas as versões do RiderForge, mas está sujeita aos limites da versão Free (máximo de riders e armazenamento).
