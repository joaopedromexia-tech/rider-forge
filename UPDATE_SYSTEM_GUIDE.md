# Update Notice System - Quick Guide

## How to Show New Updates to Users

### 1. Update the Version Number
Edit `src/config/updateConfig.js` and change the `currentVersion`:

```javascript
export const UPDATE_CONFIG = {
  currentVersion: '1.1.0', // Change this number
  // ... rest of config
}
```

### 2. Update the Summary
Change the quick summary in the same file:

```javascript
quickSummary: {
  en: 'New features and bug fixes',
  pt: 'Novas funcionalidades e correções'
},
```

### 3. Update the Main Features
Modify the `mainUpdates` array to highlight the most important changes:

```javascript
mainUpdates: [
  {
    type: 'feature', // 'feature', 'improvement', or 'fix'
    title: {
      en: 'New Feature Name',
      pt: 'Nome da Nova Funcionalidade'
    },
    description: {
      en: 'Brief description',
      pt: 'Descrição breve'
    }
  }
  // Add more updates as needed (keep to 3-4 max)
]
```

## How It Works

- **One-Time Display**: Each user sees the update notice only once per version
- **Automatic Detection**: The system automatically detects when the version changes
- **User-Friendly**: Shows a concise summary of the most important changes
- **Dismissible**: Users can dismiss the notice and won't see it again for that version
- **Persistent**: Uses localStorage to remember what users have seen
- **New Updates Only**: Only appears when there are actually new changes deployed

## Best Practices

1. **Keep it Concise**: Limit to 3-4 main updates maximum
2. **Use Clear Titles**: Make feature names easy to understand
3. **Brief Descriptions**: Keep descriptions short and to the point
4. **Update Regularly**: Show updates when you add significant features or improvements

## Example Update

```javascript
// Before: Version 1.0.0
currentVersion: '1.0.0'

// After: Version 1.1.0 with new features
currentVersion: '1.1.0'
quickSummary: {
  en: 'New features and improvements',
  pt: 'Novas funcionalidades e melhorias'
}
mainUpdates: [
  {
    type: 'feature',
    title: { en: 'Dark Mode', pt: 'Modo Escuro' },
    description: { en: 'Toggle between light and dark themes', pt: 'Alternar entre temas claro e escuro' }
  },
  {
    type: 'improvement',
    title: { en: 'Faster Loading', pt: 'Carregamento Mais Rápido' },
    description: { en: 'Improved performance', pt: 'Performance melhorada' }
  }
]
```

That's it! The update notice will automatically appear for users who haven't seen this version yet.

## Important Notes

- **One Time Only**: Each user will see the update notice only once per version
- **Version-Based**: When you change the version number, users who haven't seen that version will see the notice
- **Persistent**: Once a user sees or dismisses the notice, they won't see it again until you release a new version
- **Automatic**: No manual intervention needed - just change the version number and deploy
