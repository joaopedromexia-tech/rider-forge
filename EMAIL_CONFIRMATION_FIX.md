# 🔧 Fix for Email Confirmation 404 Error

## Problem
When users create a new account, they receive an email confirmation, but clicking the link shows:
```
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
ID: cdg1::42fbc-1757179346482-d4af9f1e2187
```

## Root Cause
The issue occurs because Supabase is trying to redirect to a URL that doesn't exist or isn't properly configured. This happens when:

1. The redirect URL in Supabase doesn't match your actual deployed domain
2. The `emailRedirectTo` parameter in the signup process is incorrect
3. The Site URL in Supabase settings is not properly configured

## Solution

### Step 1: Update Your Vercel Environment Variables

Add this new environment variable to your Vercel project:

1. Go to your Vercel Dashboard
2. Navigate to your project → Settings → Environment Variables
3. Add a new variable:
   - **Name**: `VITE_AUTH_REDIRECT_URL`
   - **Value**: `https://your-actual-domain.vercel.app` (replace with your actual domain)
   - **Environment**: Production (and Preview if needed)

### Step 2: Update Supabase Settings

1. Go to your Supabase Dashboard
2. Navigate to **Authentication → Settings**
3. Update the following settings:

   **Site URL**:
   ```
   https://your-actual-domain.vercel.app
   ```

   **Redirect URLs** (add these):
   ```
   https://your-actual-domain.vercel.app
   https://your-actual-domain.vercel.app/**
   ```

### Step 3: Redeploy Your Application

After updating the environment variables:

1. Go to your Vercel Dashboard
2. Navigate to your project → Deployments
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger a new deployment

### Step 4: Test the Fix

1. Try creating a new account
2. Check the email confirmation link
3. The link should now redirect properly to your application

## Code Changes Made

The following changes were made to fix the issue:

### 1. Updated `src/config/supabase.js`

- Added a `getRedirectUrl()` function that:
  - First checks for the `VITE_AUTH_REDIRECT_URL` environment variable
  - Falls back to the current origin in production
  - Uses localhost in development
- Updated all authentication functions to use `getRedirectUrl()` instead of hardcoded values
- Added console logging for debugging

### 2. Updated Environment Files

- Added `VITE_AUTH_REDIRECT_URL` to `env.example`
- Updated `VERCEL_ENV_VARS.md` with the new variable

## Debugging

If you still have issues, check the browser console for these log messages:
- `🔗 Using environment redirect URL: [URL]`
- `🔗 Using current origin as redirect URL: [URL]`
- `🔗 Using localhost redirect URL: http://localhost:5173`

## Alternative Solutions

If the above doesn't work, try these alternatives:

### Option 1: Hardcode the URL (Temporary Fix)

In `src/config/supabase.js`, replace the `getRedirectUrl()` function with:

```javascript
const getRedirectUrl = () => {
  return 'https://your-actual-domain.vercel.app'
}
```

### Option 2: Check Supabase Project Settings

1. Verify your Supabase project URL is correct
2. Check that the anon key is valid
3. Ensure the project is not paused or has issues

### Option 3: Test with a Different Email

Sometimes the issue is specific to certain email providers. Try with:
- Gmail
- Outlook
- A different email address

## Prevention

To prevent this issue in the future:

1. Always set the `VITE_AUTH_REDIRECT_URL` environment variable in production
2. Keep your Supabase Site URL and Redirect URLs up to date
3. Test email confirmations after each deployment
4. Monitor your application logs for authentication errors

## Support

If you continue to have issues:

1. Check the Vercel deployment logs
2. Check the Supabase authentication logs
3. Verify all environment variables are set correctly
4. Test the authentication flow in development first

---

**Note**: This fix ensures that email confirmation links always redirect to the correct domain, preventing the 404 DEPLOYMENT_NOT_FOUND error.
