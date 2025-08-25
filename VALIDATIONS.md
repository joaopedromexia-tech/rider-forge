# Sistema de Validações Automáticas - Rider Forge

## Visão Geral

O sistema de validações automáticas do Rider Forge monitora continuamente os dados do rider e fornece alertas discretos para ajudar a identificar possíveis problemas ou melhorias.

## Validações Implementadas

### 1. Phantom Power em Microfone Dinâmico
- **Tipo**: Aviso
- **Descrição**: Alerta quando phantom power está ligado em microfone dinâmico
- **Mensagem**: "Phantom power está ligado no microfone dinâmico [modelo]. Considere desligar para evitar danos."
- **Indicador Visual**: Tooltip amarelo no checkbox phantom quando ativo

### 2. Sugestão de DI
- **Tipo**: Informação
- **Descrição**: Sugere o uso de DI para fontes específicas
- **Fontes Detectadas**: teclado, teclados, acústica, acústicas, track, tracks, playback
- **Mensagem**: "Considere usar DI para '[fonte]'. Fontes como teclados, acústicas e tracks geralmente precisam de DI."
- **Indicador Visual**: Tooltip azul no campo fonte quando detectado

### 3. Capacidade da Stagebox
- **Tipo**: Erro
- **Descrição**: Alerta quando o número de inputs excede a capacidade da stagebox
- **Consoles Suportados**:
  - Midas Pro Series: 48 inputs
  - Midas HD96: 96 inputs
  - Yamaha CL5: 72 inputs
  - Yamaha DM7: 128 inputs
  - Allen & Heath dLive: 128 inputs
  - Digico SD12: 96 inputs
  - Digico SD7: 96 inputs
  - Digico SD9: 48 inputs
  - Digico SD11: 48 inputs
  - Digico SD8: 48 inputs
  - Digico SD5: 96 inputs
  - Digico SD10: 96 inputs
- **Mensagem**: "Número de inputs (X) excede a capacidade da stagebox [console] (Y inputs)."

### 4. IEM sem Mix Atribuído
- **Tipo**: Aviso
- **Descrição**: Alerta quando IEMs estão configurados mas não há mixes de monitor criados
- **Mensagem**: "X IEM(s) configurado(s) mas nenhum mix de IEM foi criado. Crie mixes de monitor para os IEMs."
- **Indicador Visual**: Tooltip amarelo no campo quantidade de IEMs

## Interface de Usuário

### Painel de Validações
- **Localização**: Canto inferior direito da tela
- **Estados**:
  - **Compacto**: Mostra apenas contador de validações por tipo
  - **Expandido**: Lista detalhada de todas as validações
- **Cores**:
  - 🔴 **Erro**: Vermelho (problemas críticos)
  - 🟡 **Aviso**: Amarelo (problemas potenciais)
  - 🔵 **Informação**: Azul (sugestões)

### Tooltips Discretos
- Aparecem ao passar o mouse sobre campos específicos
- Não bloqueiam a edição
- Fornecem contexto imediato

## Como Usar

1. **Edite normalmente**: As validações aparecem automaticamente
2. **Monitore o painel**: Verifique o canto inferior direito para alertas
3. **Clique para expandir**: Veja detalhes completos das validações
4. **Dispense alertas**: Clique no X para remover validações específicas
5. **Corrija problemas**: As validações desaparecem automaticamente quando resolvidas

## Arquitetura Técnica

### Hook useValidations
- **Arquivo**: `src/hooks/useValidations.js`
- **Função**: Gerencia todas as validações
- **Entrada**: Dados do formulário
- **Saída**: Lista de validações ativas

### Componente ValidationAlerts
- **Arquivo**: `src/components/ValidationAlerts.jsx`
- **Função**: Exibe as validações na interface
- **Características**: Responsivo, discreto, não intrusivo

### Integração
- **RiderForm**: Integra o sistema de validações
- **Tabs**: Cada aba pode ter validações específicas
- **Tempo Real**: Validações atualizam automaticamente

## Extensibilidade

### Adicionar Nova Validação
1. Crie função de validação no hook `useValidations`
2. Adicione lógica de detecção
3. Use `addValidation()` para criar alerta
4. Use `removeValidation()` para limpar quando resolvido

### Exemplo de Nova Validação
```javascript
const validateNewRule = () => {
  if (condition) {
    addValidation(
      'new_rule',
      'Mensagem de validação',
      'warning', // ou 'error', 'info'
      { additionalData: 'value' }
    )
  } else {
    removeValidation('new_rule')
  }
}
```

## Benefícios

- **Prevenção de Erros**: Identifica problemas antes que causem danos
- **Melhoria da Qualidade**: Sugere boas práticas
- **Experiência Não Intrusiva**: Não bloqueia o trabalho
- **Feedback Imediato**: Resposta em tempo real
- **Educativo**: Ensina boas práticas de áudio

