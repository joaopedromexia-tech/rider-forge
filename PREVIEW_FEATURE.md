# Funcionalidade de Preview do PDF

## Descrição
A funcionalidade de preview do PDF permite visualizar o rider técnico antes de fazer o download, evitando a necessidade de descarregar múltiplos ficheiros durante o processo de teste e ajuste.

## Como usar

### 1. Aceder ao Preview
1. Preencha os dados do rider técnico
2. Clique no botão "Exportar PDF" 
3. No modal de exportação, clique no botão "Preview" (com ícone de olho)

### 2. Funcionalidades do Preview
- **Visualização em tempo real**: O PDF é gerado e mostrado num iframe
- **Informações do ficheiro**: Mostra o tamanho, número estimado de páginas e hora de geração
- **Botão "Abrir"**: Abre o PDF numa nova aba do navegador
- **Botão "Regenerar"**: Regenera o preview quando as opções mudam
- **Indicador de regeneração**: Mostra quando o PDF está a ser regenerado

### 3. Opções disponíveis no Preview
- **Incluir Stage Plot**: Adiciona o stage plot ao PDF (se existir)
- **Rodapé personalizado**: Permite adicionar texto personalizado no rodapé
- **Temas de cores**: Diferentes temas visuais (alguns requerem versão Pro)

### 4. Fluxo de trabalho recomendado
1. Preencha os dados básicos do rider
2. Use o preview para verificar o resultado
3. Ajuste as opções de exportação conforme necessário
4. Use o botão "Regenerar" para ver as mudanças
5. Quando estiver satisfeito, clique em "Exportar PDF"

## Vantagens
- **Economia de tempo**: Não precisa descarregar ficheiros para testar
- **Feedback imediato**: Vê as mudanças instantaneamente
- **Melhor experiência**: Interface mais fluida e responsiva
- **Menos desperdício**: Evita ficheiros desnecessários no computador

## Notas técnicas
- O preview usa a mesma engine de geração do PDF final
- Os temas Pro são permitidos no preview mesmo sem subscrição
- O preview é regenerado automaticamente quando as opções mudam
- O ficheiro é limpo da memória quando o modal é fechado

## Compatibilidade
- Funciona em todos os navegadores modernos
- Requer JavaScript habilitado
- Otimizado para ecrãs de diferentes tamanhos
