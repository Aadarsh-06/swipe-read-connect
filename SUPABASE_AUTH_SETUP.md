# Supabase Authentication Setup Guide

## Required Supabase Dashboard Settings

To fix the email authentication issues, you need to configure the following settings in your Supabase dashboard:

### 1. Authentication Settings

Go to **Authentication > Settings** in your Supabase dashboard and configure:

#### Site URL
- Set to your development URL: `http://localhost:8080`
- For production, set to your production domain

#### Additional Redirect URLs
Add these URLs to allow redirects after email confirmation:
```
http://localhost:8080/auth/callback
https://your-production-domain.com/auth/callback
```

#### Email Confirmation
- **Enable email confirmations**: ON
- **Confirm email change**: ON (optional)
- **Enable signup**: ON

### 2. Email Templates

Go to **Authentication > Email Templates**:

#### Confirm signup template
The confirmation URL should be:
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup
```

#### Email change confirmation template (if using)
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email_change
```

### 3. Auth URL Configuration

The auth URLs should be configured as:
- **Site URL**: `http://localhost:8080` (development) or your production URL
- **Redirect URLs**: 
  - `http://localhost:8080/auth/callback`
  - Your production callback URL

### 4. Email Provider Configuration

Ensure you have configured an email provider:
- Go to **Authentication > Settings > SMTP Settings**
- Configure your SMTP provider (or use Supabase's built-in service for development)

## Testing the Fix

1. **Sign up with a new email**
2. **Check your email** for the confirmation link
3. **Click the confirmation link** - should redirect to `/auth/callback`
4. **See the success page** instead of an error
5. **Get automatically redirected** to the home page after 3 seconds

## Common Issues

### Issue: "Invalid login credentials" error
**Solution**: Make sure email confirmations are enabled and the user clicked the confirmation link

### Issue: "Invalid redirect URL" error  
**Solution**: Add your callback URL to the "Additional Redirect URLs" list

### Issue: Email not being sent
**Solution**: Check your SMTP configuration in Authentication > Settings

### Issue: Callback page shows error
**Solution**: Check the browser developer console for detailed error messages

## Environment Variables

Make sure these are set in your `.env` file:
```
VITE_SUPABASE_URL="https://yyupyzapcugtgjzubvie.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

## Debugging

To debug auth issues, check the browser console on the `/auth/callback` page. The improved AuthCallback component now logs detailed error information.
