# GitHub and Vercel Deployment Commands

## After creating GitHub repository, run these commands:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/eternalgy-system-report.git
git branch -M main
git push -u origin main
```

## Vercel Deployment Steps:

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your eternalgy-system-report repository
5. Set environment variables:
   - Variable Name: `API_TOKEN`
   - Value: `your-secret-token` (or choose a secure token)
6. Click "Deploy"

## After deployment:
- Your app will be live at: `https://eternalgy-system-report-your-username.vercel.app`
- Update your ERP system to use the new URL for API calls
- Test the API endpoints with your production URL

## Environment Variables for Production:
- `API_TOKEN`: Set this to a secure token for your production API
