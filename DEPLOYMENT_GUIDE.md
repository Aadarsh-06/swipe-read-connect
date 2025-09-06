# Deployment Guide - Email Authentication Fix

## Quick Deploy Steps

### 1. Deploy to Lovable
1. Go to your [Lovable Project](https://lovable.dev/projects/714f6e6b-5a67-4cac-80ef-937c0d5c91d6)
2. Click **Share → Publish** to deploy the app
3. Note the deployed URL (will be something like `https://your-app.lovableproject.com`)

### 2. Configure Supabase for Production
Once deployed, you need to update your Supabase settings:

#### In Supabase Dashboard → Authentication → Settings:

1. **Site URL**: Set to your deployed Lovable URL
   ```
   https://your-app.lovableproject.com
   ```

2. **Additional Redirect URLs**: Add both URLs
   ```
   https://your-app.lovableproject.com/auth/callback
   http://localhost:8080/auth/callback
   ```

3. **Email Templates** → Confirm signup:
   Update the confirmation URL template to:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup
   ```

### 3. Test Email Authentication
1. Go to your deployed app
2. Sign up with a new email
3. Check email for confirmation link
4. Click the link → should redirect to your deployed app's success page
5. Get automatically redirected to home page

## For Local Development (Optional)

If you want to test email authentication locally, you can use ngrok:

1. **Install ngrok**: Download from [ngrok.com](https://ngrok.com)
2. **Start your dev server**: `npm run dev`
3. **Expose to internet**: `ngrok http 8080`
4. **Update Supabase**: Add the ngrok URL to redirect URLs
5. **Set environment variable**:
   ```bash
   VITE_AUTH_REDIRECT_URL=https://your-ngrok-id.ngrok.io
   ```

## Custom Domain (Optional)

To use a custom domain:
1. In Lovable: Go to Project > Settings > Domains
2. Click "Connect Domain" and follow instructions
3. Update Supabase Site URL to your custom domain
4. Update redirect URLs to use custom domain

## Troubleshooting

### Issue: Still getting localhost:3000 in email links
**Solution**: The Site URL in Supabase dashboard is still set to localhost:3000. Update it to your deployed URL.

### Issue: "Invalid redirect URL" after clicking email link
**Solution**: Add your deployed callback URL to the "Additional Redirect URLs" list in Supabase.

### Issue: Email not being sent
**Solution**: Check Supabase email configuration and quotas.

## Environment Variables for Production

The app will automatically use the correct URLs in production. No additional environment variables are needed for basic deployment.

For advanced setups, you can set:
- `VITE_AUTH_REDIRECT_URL` - Override the auth redirect URL
- `VITE_SUPABASE_URL` - Override Supabase URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Override Supabase key
