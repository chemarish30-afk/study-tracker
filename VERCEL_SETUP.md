# Vercel Setup Guide

This guide will help you set up Vercel deployment for your Study Tracker project.

## 🚀 Quick Setup

### Step 1: Create Vercel Account & Project

1. **Sign up at [vercel.com](https://vercel.com)**
2. **Import your GitHub repository:**
   - Click "New Project"
   - Select your `study-tracker` repository
   - Set **Root Directory** to `web`
   - Click "Deploy"

### Step 2: Get Vercel Credentials

#### A. Get Vercel Token
1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Set scope to "Full Account" (or appropriate scope)
5. Copy the token (starts with `vercel_`)

#### B. Get Organization ID
1. Go to [Vercel Dashboard](https://vercel.com/account)
2. In the URL or settings, you'll see your team ID
3. For personal accounts, it's usually your username
4. For teams, it's the team slug

#### C. Get Project ID
1. Go to your project in Vercel Dashboard
2. Go to **Settings** → **General**
3. Copy the **Project ID** (looks like `prj_xxxxxxxxxx`)

### Step 3: Add GitHub Secrets

1. **Go to your GitHub repository**
2. **Navigate to Settings** → **Secrets and variables** → **Actions**
3. **Add these secrets:**

```env
VERCEL_TOKEN=vercel_your_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=prj_your_project_id_here
```

## 🔧 Alternative: Manual Vercel CLI Setup

If you prefer to set up Vercel manually:

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Link Project
```bash
cd web
vercel link
```

### Deploy
```bash
vercel --prod
```

## 📋 Environment Variables for Vercel

In your Vercel project settings, add these environment variables:

```env
# Strapi Backend
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_optional_read_token
REVALIDATE_SECRET=your_revalidate_secret

# Email Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@domain.com
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Token is not valid" Error
- **Solution:** Generate a new token in Vercel dashboard
- **Check:** Token has correct permissions
- **Verify:** Token is copied correctly (no extra spaces)

#### 2. "Organization not found" Error
- **Solution:** Check your Vercel organization ID
- **For personal accounts:** Use your username
- **For teams:** Use the team slug

#### 3. "Project not found" Error
- **Solution:** Verify project ID in Vercel dashboard
- **Check:** Project exists and you have access
- **Format:** Should start with `prj_`

#### 4. Build Failures
- **Check:** Environment variables are set correctly
- **Verify:** Strapi backend is accessible
- **Review:** Build logs in Vercel dashboard

### Debug Steps

1. **Check GitHub Actions logs** for specific error messages
2. **Verify secrets** are set correctly in GitHub
3. **Test Vercel CLI locally** to ensure credentials work
4. **Check Vercel dashboard** for deployment status

## 🔄 Workflow Behavior

The GitHub Actions workflow will:

- ✅ **Always run** linting and building
- ✅ **Deploy to Vercel** if all secrets are configured
- ⚠️ **Skip Vercel deployment** if secrets are missing (with helpful message)
- 📝 **Show clear instructions** for setting up missing secrets

## 📞 Support

If you encounter issues:

1. **Check the GitHub Actions logs** for detailed error messages
2. **Review this guide** for common solutions
3. **Check Vercel documentation** at [vercel.com/docs](https://vercel.com/docs)
4. **Verify your Vercel account** has the necessary permissions

## 🎯 Next Steps

Once Vercel is set up:

1. **Your app will deploy automatically** on every push to main
2. **You'll get a Vercel URL** for your deployed app
3. **You can set up a custom domain** in Vercel settings
4. **Monitor deployments** in both GitHub Actions and Vercel dashboard
