# Deployment Guide

This guide covers deploying the Study Tracker application to production.

## 🚀 Netlify Deployment (Frontend)

### Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **GitHub Secrets**: Configure required secrets in your repository

### Setup Steps

#### 1. Configure GitHub Secrets

Add these secrets to your GitHub repository settings (Settings → Secrets and variables → Actions):

```env
# Netlify Configuration
NETLIFY_SITE_ID=599c5e9f-1822-49d1-80bf-d7088863107a
NETLIFY_AUTH_TOKEN=nfp_EuELJgJG96dPxmDqCDDfQCYGCjkMoMrk70bc

# Application Environment Variables
NEXT_PUBLIC_STRAPI_URL=https://truthful-gift-3408f45803.strapiapp.com
```

#### 2. How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `NETLIFY_SITE_ID` | `599c5e9f-1822-49d1-80bf-d7088863107a` | Your Netlify site ID |
| `NETLIFY_AUTH_TOKEN` | `nfp_EuELJgJG96dPxmDqCDDfQCYGCjkMoMrk70bc` | Your Netlify auth token |
| `NEXT_PUBLIC_STRAPI_URL` | `https://truthful-gift-3408f45803.strapiapp.com` | Your Strapi backend URL |

#### 3. Deploy

The deployment happens automatically when you:

1. Push to the `main` branch
2. The GitHub Actions workflow will:
   - Install dependencies
   - Build the Next.js application
   - Deploy to Netlify
   - Create preview deployments for pull requests

### Manual Deployment

You can also deploy manually using Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to web directory
cd web

# Build the application
npm run build

# Deploy
netlify deploy --prod --dir=out
```

## 🗄️ Strapi Cloud Deployment (Backend)

### Current Setup

Your Strapi CMS is already deployed on Strapi Cloud:
- **URL**: `https://truthful-gift-3408f45803.strapiapp.com`
- **Auto-deployment**: Enabled on push to main branch
- **Base Directory**: `/cms`

### Environment Variables

Your Strapi Cloud instance is configured with:
```env
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_random_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@domain.com
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your_resend_api_key
```

## 🔧 Environment Variables Reference

### Frontend (Netlify)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi backend URL | Yes | `https://truthful-gift-3408f45803.strapiapp.com` |

### Backend (Strapi Cloud)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `APP_KEYS` | Strapi app keys | Yes | `key1,key2,key3,key4` |
| `API_TOKEN_SALT` | API token salt | Yes | `random_salt_string` |
| `ADMIN_JWT_SECRET` | Admin JWT secret | Yes | `admin_jwt_secret` |
| `JWT_SECRET` | User JWT secret | Yes | `user_jwt_secret` |
| `TRANSFER_TOKEN_SALT` | Transfer token salt | Yes | `transfer_salt` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgres://user:pass@host:5432/db` |
| `RESEND_API_KEY` | Resend API key | Yes | `re_123456789` |
| `RESEND_FROM_EMAIL` | Verified sender email | Yes | `noreply@yourdomain.com` |
| `SMTP_HOST` | SMTP host | Yes | `smtp.resend.com` |
| `SMTP_PORT` | SMTP port | Yes | `587` |
| `SMTP_USER` | SMTP username | Yes | `resend` |
| `SMTP_PASSWORD` | SMTP password | Yes | `your_resend_api_key` |

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_STRAPI_URL` is correct
   - Check CORS settings in Strapi
   - Ensure Strapi is deployed and accessible

3. **Authentication Issues**:
   - Verify JWT secrets are set correctly
   - Check cookie settings for production
   - Ensure HTTPS is enabled in production

### Debugging

1. **Check Netlify Function Logs**:
   - Go to Netlify Dashboard → Functions tab
   - View logs for any errors

2. **Check Strapi Logs**:
   - Go to Strapi Cloud Dashboard
   - View application logs

3. **Test API Endpoints**:
   - Use tools like Postman or curl
   - Test both public and authenticated endpoints

## 📈 Performance Optimization

### Frontend (Netlify)

- **Static Export**: Next.js static export for optimal performance
- **CDN**: Global CDN for static assets
- **Caching**: Optimized caching headers
- **Image Optimization**: Unoptimized images for static export

### Backend (Strapi Cloud)

- **Database Indexing**: Optimize database queries
- **Caching**: Enable Strapi caching features
- **Image Optimization**: Use Strapi's image optimization
- **API Rate Limiting**: Configure appropriate rate limits

## 🔒 Security Considerations

1. **Environment Variables**: Never commit secrets to repository
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: Validate all user inputs
6. **Authentication**: Use secure JWT tokens with proper expiration

## 📊 Monitoring

### Netlify Analytics

- Enable Netlify Analytics for performance monitoring
- Monitor Core Web Vitals
- Track user engagement

### Strapi Monitoring

- Monitor API response times
- Track database performance
- Set up error alerting

## 🔄 CI/CD Pipeline

The GitHub Actions workflow provides:

1. **Automated Testing**: Linting and build verification
2. **Automatic Deployment**: Deploy on successful builds
3. **Environment Management**: Proper environment variable handling
4. **Preview Deployments**: Automatic preview deployments for pull requests
5. **Rollback Capability**: Easy rollback through Netlify dashboard

## 📝 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure SSL certificates** (automatic with Netlify)
3. **Set up monitoring and alerting**
4. **Configure backup strategies**
5. **Set up staging environment** for testing