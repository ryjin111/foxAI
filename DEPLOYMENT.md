# 🚀 Vercel Deployment Guide

## Quick Deploy

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Deploy to Production
```bash
vercel --prod
```

## 🔧 Troubleshooting

### **Issue: Build Fails**
**Solution:**
1. Check if all dependencies are installed:
   ```bash
   npm install
   ```

2. Test build locally:
   ```bash
   npm run build
   ```

3. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### **Issue: API Routes Not Working**
**Solution:**
1. Test health check endpoint:
   ```
   https://your-app.vercel.app/api/health
   ```

2. Check API route structure:
   - `/api/health` - Health check
   - `/api/elizaos/status` - ElizaOS status
   - `/api/elizaos/actions` - ElizaOS actions

### **Issue: Dashboard Not Loading**
**Solution:**
1. Check browser console for errors
2. Verify all API endpoints are responding
3. Check network tab for failed requests

### **Issue: Environment Variables**
**Solution:**
1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add any required variables

## 🧪 Testing

### **Local Testing**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/elizaos/status
```

### **Production Testing**
```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test ElizaOS status
curl https://your-app.vercel.app/api/elizaos/status

# Test ElizaOS actions
curl -X POST https://your-app.vercel.app/api/elizaos/actions \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

## 📊 Monitoring

### **Vercel Dashboard**
- Check deployment logs
- Monitor function execution
- View error logs

### **API Endpoints**
- `/api/health` - System health
- `/api/elizaos/status` - ElizaOS status
- `/api/elizaos/actions` - ElizaOS actions

## 🆘 Common Issues

### **1. Build Timeout**
- Reduce bundle size
- Optimize dependencies
- Use dynamic imports

### **2. Function Timeout**
- API routes timeout after 10 seconds
- Optimize database queries
- Use caching

### **3. Memory Issues**
- Reduce function memory usage
- Optimize data processing
- Use streaming responses

## 📞 Support

If you're still having issues:

1. **Check Vercel logs** in the dashboard
2. **Test locally** first
3. **Verify API endpoints** are working
4. **Check environment variables** are set correctly

## 🎯 Success Checklist

- [ ] Build completes successfully
- [ ] Health endpoint responds
- [ ] Dashboard loads without errors
- [ ] ElizaOS status API works
- [ ] ElizaOS actions API works
- [ ] Chat functionality works
- [ ] All UI components render correctly 