# Deployment Guide for Vercel

This guide walks you through deploying your QR Code Generator application to Vercel.

## Quick Deployment (Recommended)

### Option 1: GitHub Integration

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Initial commit: QR Code Generator"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project
   - Click "Deploy"

### Option 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `qrcode-generator`
   - In which directory is your code located? `./`

## Project Configuration

The project is already configured for Vercel with:

- ✅ `vercel.json` - Handles API routes and SPA routing
- ✅ `api/generate-qr.js` - Serverless function for QR generation
- ✅ Vite configuration optimized for production
- ✅ Build scripts properly set up

## Environment Variables

No environment variables are required for basic functionality.

## Build Settings

Vercel will automatically detect these settings, but you can verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## API Routes

The application includes a serverless API endpoint:
- `/api/generate-qr` - Handles QR code generation

This will be automatically deployed as a Vercel serverless function.

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring

Vercel provides built-in monitoring:
- **Analytics**: View performance metrics
- **Functions**: Monitor API endpoint usage
- **Logs**: Debug any issues

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Test locally first
   npm run build
   npm run preview
   ```

2. **API Not Working**:
   - Check the `api/generate-qr.js` file exists
   - Verify it's properly exported as default function
   - Check Vercel function logs

3. **CSS Not Loading**:
   - Ensure Tailwind is properly configured
   - Check the build output includes CSS files

### Build Locally Before Deploying:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Checklist

Before deploying to production:

- [ ] Test all functionality locally
- [ ] Run `npm run build` successfully
- [ ] Test the preview build with `npm run preview`
- [ ] Verify API endpoints work correctly
- [ ] Check responsive design on mobile devices
- [ ] Test QR code generation with various inputs

## Post-Deployment

After successful deployment:

1. **Test the live application**
2. **Verify API endpoints work**
3. **Test QR code generation**
4. **Check mobile responsiveness**
5. **Monitor performance and errors**

Your QR Code Generator is now live and ready to use! 🎉 