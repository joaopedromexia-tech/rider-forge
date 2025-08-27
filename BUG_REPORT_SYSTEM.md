# 🐛 Sistema de Reporte de Bugs - Rider Forge

## Visão Geral

O sistema de reporte de bugs foi implementado de forma integrada com o Supabase, permitindo aos utilizadores reportarem problemas de forma fácil e eficiente. O sistema captura automaticamente informações do browser e contexto da aplicação.

## Funcionalidades

### ✅ **Reporte Manual de Bugs**
- Modal intuitivo para reporte de bugs
- Campos para título, descrição e severidade
- Captura automática de informações do browser
- Suporte a utilizadores logados e anónimos

### ✅ **Reporte Automático de Erros**
- ErrorBoundary integrado que captura erros automaticamente
- Envio automático de reportes para bugs críticos
- Informações detalhadas sobre o contexto do erro

### ✅ **Interface Flexível**
- Botão flutuante configurável
- Suporte a múltiplas posições (bottom-right, bottom-left, etc.)
- Design responsivo e acessível

## Estrutura da Base de Dados

### Tabela `bug_reports`

```sql
CREATE TABLE bug_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  browser_info JSONB,
  app_version TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Campos Capturados Automaticamente

- **browser_info**: Informações detalhadas do browser
- **app_version**: Versão da aplicação
- **page_url**: URL onde o erro ocorreu
- **user_agent**: User agent do browser
- **user_id**: ID do utilizador (se logado)

## Componentes Principais

### 1. `BugReportModal.jsx`
Modal principal para reporte de bugs com:
- Formulário completo
- Validação de campos
- Feedback visual
- Integração com Supabase

### 2. `BugReportButton.jsx`
Botão flutuante configurável:
- Posições: bottom-right, bottom-left, top-right, top-left
- Variantes: floating, inline
- Opção de mostrar/esconder label

### 3. `useBugReport.js`
Hook personalizado para:
- Submissão programática de bugs
- Reporte automático de erros
- Gestão de estado de submissão

## Como Usar

### 1. **Botão Flutuante (Recomendado)**
```jsx
import BugReportButton from './components/BugReportButton'

// No seu componente principal
<BugReportButton 
  position="bottom-right"
  showLabel={false}
/>
```

### 2. **Hook Personalizado**
```jsx
import { useBugReport } from './hooks/useBugReport'

function MyComponent() {
  const { submitBugReport, submitErrorReport, isSubmitting } = useBugReport()

  const handleError = async (error) => {
    try {
      await submitErrorReport(error, { component: 'MyComponent' })
    } catch (err) {
      console.error('Erro ao reportar bug:', err)
    }
  }

  const handleManualReport = async () => {
    try {
      await submitBugReport({
        title: 'Problema específico',
        description: 'Descrição detalhada...',
        severity: 'medium'
      })
    } catch (err) {
      console.error('Erro ao reportar bug:', err)
    }
  }
}
```

### 3. **ErrorBoundary Integrado**
O ErrorBoundary já está configurado para capturar erros automaticamente. Apenas certifique-se de que está a envolver a sua aplicação:

```jsx
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      {/* Sua aplicação */}
    </ErrorBoundary>
  )
}
```

## Traduções

O sistema suporta português e inglês. As traduções estão em:
- `src/locales/pt.json`
- `src/locales/en.json`

### Chaves de Tradução
```json
{
  "bugReport.title": "Reportar Bug",
  "bugReport.titleLabel": "Título",
  "bugReport.descriptionLabel": "Descrição",
  "bugReport.severityLabel": "Severidade",
  "bugReport.submit": "Enviar Reporte",
  "bugReport.success": "Bug reportado com sucesso!",
  "bugReport.error": "Erro ao enviar reporte."
}
```

## Configuração

### 1. **Executar SQL no Supabase**
Execute o script `supabase-setup.sql` no SQL Editor do Supabase para criar a tabela e políticas de segurança.

### 2. **Variáveis de Ambiente**
Certifique-se de que as variáveis do Supabase estão configuradas:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. **Políticas de Segurança**
O sistema já inclui políticas RLS configuradas:
- Qualquer pessoa pode criar bug reports
- Utilizadores logados podem ver os seus próprios reports
- Utilizadores logados podem atualizar os seus próprios reports

## Monitorização

### Dashboard do Supabase
Aceda ao dashboard do Supabase para ver os bug reports:
1. Vá para o seu projeto no Supabase
2. Navegue para "Table Editor"
3. Selecione a tabela `bug_reports`
4. Veja os reports em tempo real

### Filtros Úteis
```sql
-- Ver apenas reports críticos
SELECT * FROM bug_reports WHERE severity = 'critical' ORDER BY created_at DESC;

-- Ver reports de um utilizador específico
SELECT * FROM bug_reports WHERE user_id = 'user_uuid' ORDER BY created_at DESC;

-- Ver reports dos últimos 7 dias
SELECT * FROM bug_reports WHERE created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC;
```

## Personalização

### Estilo do Botão
```jsx
<BugReportButton 
  position="bottom-left"
  showLabel={true}
  className="custom-class"
  variant="inline"
/>
```

### Versão da App
Modifique a função `getAppVersion()` em `useBugReport.js` para usar a versão real da sua aplicação:

```js
const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}
```

## Troubleshooting

### Problema: Erro ao enviar reporte
**Solução**: Verifique se:
1. As variáveis do Supabase estão configuradas
2. A tabela `bug_reports` foi criada
3. As políticas RLS estão ativas

### Problema: Botão não aparece
**Solução**: Verifique se:
1. O componente está importado corretamente
2. Não há conflitos de z-index
3. O componente está renderizado no DOM

### Problema: Traduções não funcionam
**Solução**: Verifique se:
1. As chaves de tradução estão nos arquivos de idioma
2. O contexto de i18n está configurado
3. O idioma está definido corretamente

## Próximos Passos

### Funcionalidades Futuras
- [ ] Dashboard de administração para gestão de bugs
- [ ] Notificações por email para bugs críticos
- [ ] Integração com GitHub Issues
- [ ] Sistema de priorização automática
- [ ] Relatórios e analytics

### Melhorias Sugeridas
- [ ] Screenshots automáticos
- [ ] Captura de console logs
- [ ] Integração com Sentry
- [ ] Sistema de feedback para utilizadores
- [ ] Categorização automática de bugs

## Suporte

Para questões sobre o sistema de reporte de bugs, consulte:
1. Esta documentação
2. Logs do console do browser
3. Dashboard do Supabase
4. Código fonte dos componentes
