# Deployment Guide

This guide covers deploying the Study Tracker application to production.

## 🚀 Vercel Deployment (Frontend)

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare all required environment variables

### Setup Steps

#### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `web`
5. Vercel will auto-detect Next.js framework

#### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```env
# Strapi Backend Configuration
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_optional_read_token
REVALIDATE_SECRET=your_revalidate_secret

# Email Configuration (same as CMS)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@domain.com
```

#### 3. GitHub Actions Setup

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-web.yml`) that automatically deploys to Vercel on push to main branch.

**Required GitHub Secrets:**

Add these secrets to your GitHub repository settings:

```env
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Application Environment Variables
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_optional_read_token
REVALIDATE_SECRET=your_revalidate_secret
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@domain.com
```

**How to get Vercel credentials:**

1. **VERCEL_TOKEN**: 
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token with appropriate scope

2. **VERCEL_ORG_ID**:
   - Go to Vercel Dashboard → Settings → General
   - Copy the "Team ID" or "Personal Account ID"

3. **VERCEL_PROJECT_ID**:
   - Go to your project in Vercel Dashboard
   - Copy the "Project ID" from Settings → General

#### 4. Deploy

The deployment happens automatically when you:

1. Push to the `main` branch
2. The workflow will:
   - Install dependencies
   - Run linting
   - Build the application
   - Deploy to Vercel

### Manual Deployment

You can also deploy manually using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to web directory
cd web

# Deploy
vercel --prod
```

## 🗄️ Strapi Cloud Deployment (Backend)

### Prerequisites

1. **Strapi Cloud Account**: Sign up at [cloud.strapi.io](https://cloud.strapi.io)
2. **PostgreSQL Database**: Set up a PostgreSQL database
3. **Resend Account**: For email services

### Setup Steps

1. **Create Strapi Cloud Project**:
   - Connect your GitHub repository
   - Set **Base Directory** to `/cms`

2. **Configure Environment Variables**:
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

3. **Deploy**: Strapi Cloud will automatically deploy on push to main branch

## 🔧 Environment Variables Reference

### Frontend (Vercel)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi backend URL | Yes | `https://your-strapi.vercel.app` |
| `STRAPI_API_TOKEN` | Optional read token | No | `your_api_token` |
| `REVALIDATE_SECRET` | Webhook revalidation secret | Yes | `your_secret_key` |
| `RESEND_API_KEY` | Resend API key for emails | Yes | `re_123456789` |
| `RESEND_FROM_EMAIL` | Verified sender email | Yes | `noreply@yourdomain.com` |

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

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Functions tab
   - View logs for API route errors

2. **Check Strapi Logs**:
   - Go to Strapi Cloud Dashboard
   - View application logs

3. **Test API Endpoints**:
   - Use tools like Postman or curl
   - Test both public and authenticated endpoints

## 📈 Performance Optimization

### Frontend (Vercel)

- **ISR**: Incremental Static Regeneration for content
- **Image Optimization**: Next.js automatic image optimization
- **Edge Functions**: API routes run on edge for better performance
- **CDN**: Global CDN for static assets

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

### Vercel Analytics

- Enable Vercel Analytics for performance monitoring
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
4. **Rollback Capability**: Easy rollback through Vercel dashboard

## 📝 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure SSL certificates** (automatic with Vercel)
3. **Set up monitoring and alerting**
4. **Configure backup strategies**
5. **Set up staging environment** for testing
