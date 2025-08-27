# 🐛 Bug Reporting System - Rider Forge

## Overview

The bug reporting system has been implemented with Supabase integration, allowing users to report issues easily and efficiently. The system automatically captures browser information and application context.

## Features

### ✅ **Manual Bug Reporting**
- Intuitive modal for bug reporting
- Fields for title, description, and severity
- Automatic browser information capture
- Support for logged-in and anonymous users

### ✅ **Automatic Error Reporting**
- Integrated ErrorBoundary that captures errors automatically
- Automatic submission of reports for critical bugs
- Detailed information about error context

### ✅ **Flexible Interface**
- Configurable floating button
- Support for multiple positions (bottom-right, bottom-left, etc.)
- Responsive and accessible design

## Database Structure

### `bug_reports` Table

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

### Automatically Captured Fields

- **browser_info**: Detailed browser information
- **app_version**: Application version
- **page_url**: URL where the error occurred
- **user_agent**: Browser user agent
- **user_id**: User ID (if logged in)

## Main Components

### 1. `BugReportModal.jsx`
Main modal for bug reporting with:
- Complete form
- Field validation
- Visual feedback
- Supabase integration

### 2. `BugReportButton.jsx`
Configurable floating button:
- Positions: bottom-right, bottom-left, top-right, top-left
- Variants: floating, inline
- Option to show/hide label

### 3. `useBugReport.js`
Custom hook for:
- Programmatic bug submission
- Automatic error reporting
- Submission state management

## How to Use

### 1. **Floating Button (Recommended)**
```jsx
import BugReportButton from './components/BugReportButton'

// In your main component
<BugReportButton 
  position="bottom-right"
  showLabel={false}
/>
```

### 2. **Custom Hook**
```jsx
import { useBugReport } from './hooks/useBugReport'

function MyComponent() {
  const { submitBugReport, submitErrorReport, isSubmitting } = useBugReport()

  const handleError = async (error) => {
    try {
      await submitErrorReport(error, { component: 'MyComponent' })
    } catch (err) {
      console.error('Error reporting bug:', err)
    }
  }

  const handleManualReport = async () => {
    try {
      await submitBugReport({
        title: 'Specific problem',
        description: 'Detailed description...',
        severity: 'medium'
      })
    } catch (err) {
      console.error('Error reporting bug:', err)
    }
  }
}
```

### 3. **Integrated ErrorBoundary**
The ErrorBoundary is already configured to capture errors automatically. Just make sure it wraps your application:

```jsx
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      {/* Your application */}
    </ErrorBoundary>
  )
}
```

## Translations

The system supports Portuguese and English. Translations are in:
- `src/locales/pt.json`
- `src/locales/en.json`

### Translation Keys
```json
{
  "bugReport.title": "Report Bug",
  "bugReport.titleLabel": "Title",
  "bugReport.descriptionLabel": "Description",
  "bugReport.severityLabel": "Severity",
  "bugReport.submit": "Submit Report",
  "bugReport.success": "Bug reported successfully!",
  "bugReport.error": "Error sending report."
}
```

## Configuration

### 1. **Run SQL in Supabase**
Execute the `supabase-setup.sql` script in the Supabase SQL Editor to create the table and security policies.

### 2. **Environment Variables**
Make sure Supabase variables are configured:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. **Security Policies**
The system already includes configured RLS policies:
- Anyone can create bug reports
- Logged-in users can view their own reports
- Logged-in users can update their own reports

## Monitoring

### Supabase Dashboard
Access the Supabase dashboard to view bug reports:
1. Go to your Supabase project
2. Navigate to "Table Editor"
3. Select the `bug_reports` table
4. View reports in real-time

### Useful Filters
```sql
-- View only critical reports
SELECT * FROM bug_reports WHERE severity = 'critical' ORDER BY created_at DESC;

-- View reports from a specific user
SELECT * FROM bug_reports WHERE user_id = 'user_uuid' ORDER BY created_at DESC;

-- View reports from the last 7 days
SELECT * FROM bug_reports WHERE created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC;
```

## Customization

### Button Styling
```jsx
<BugReportButton 
  position="bottom-left"
  showLabel={true}
  className="custom-class"
  variant="inline"
/>
```

### App Version
Modify the `getAppVersion()` function in `useBugReport.js` to use your application's real version:

```js
const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}
```

## Troubleshooting

### Problem: Error sending report
**Solution**: Check if:
1. Supabase variables are configured
2. The `bug_reports` table was created
3. RLS policies are active

### Problem: Button doesn't appear
**Solution**: Check if:
1. Component is imported correctly
2. There are no z-index conflicts
3. Component is rendered in the DOM

### Problem: Translations don't work
**Solution**: Check if:
1. Translation keys are in the language files
2. i18n context is configured
3. Language is set correctly

## Next Steps

### Future Features
- [ ] Administration dashboard for bug management
- [ ] Email notifications for critical bugs
- [ ] GitHub Issues integration
- [ ] Automatic prioritization system
- [ ] Reports and analytics

### Suggested Improvements
- [ ] Automatic screenshots
- [ ] Console logs capture
- [ ] Sentry integration
- [ ] User feedback system
- [ ] Automatic bug categorization

## Support

For questions about the bug reporting system, consult:
1. This documentation
2. Browser console logs
3. Supabase dashboard
4. Component source code
