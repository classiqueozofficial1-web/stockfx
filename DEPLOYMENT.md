# StockFX Website Deployment Guide

## Overview
Deploy your StockFX website to **Render** (free, all-in-one platform):
- **Frontend**: Static React website
- **Backend**: Node.js API server for authentication

---

## Step 1: Deploy Frontend to Vercel

### 1.1 Sign up & Connect GitHub
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. When prompted, authorize Vercel to access your repositories

### 1.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your `stockfx` repository
3. **Root Directory**: Leave empty (default)
4. **Build & Output settings should auto-detect**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 1.3 Environment Variables
Add in Vercel dashboard under **Settings → Environment Variables**:

```
VITE_API_URL = https://your-render-backend-url.onrender.com
```

**Important**: Replace with your actual Render backend URL (you'll get this in Step 2)

### 1.4 Deploy
Click **"Deploy"**. Your frontend will be live at:
```
https://your-project-name.vercel.app
```

---

## Step 2: Deploy Backend to Render

### 2.1 Sign up & Create Web Service
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click **"New +"** → **"Web Service"**

### 2.2 Connect Repository
1. Select **"Connect your GitHub account"**
2. Authorize Render to access your repositories
3. Find and select your `stockfx` repository
4. Click **"Connect"**

### 2.3 Configure Service
In the deployment form, set:

| Field | Value |
|-------|-------|
| **Name** | stockfx-backend |
| **Environment** | Node |
| **Region** | Pick closest to your users |
| **Branch** | main |
| **Build Command** | `cd auth-backend && npm install` |
| **Start Command** | `cd auth-backend && node src/server-enhanced.js` |
| **Plan** | Free |

### 2.4 Add Environment Variables
Scroll down to **Environment Variables** section and add:

```
NODE_ENV = production
PORT = 4000
JWT_SECRET = your-super-secret-key-min-32-chars
EMAIL_SERVICE = gmail
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-specific-password
```

**Email Setup** (Gmail):
- Use your Gmail address for `EMAIL_USER`
- Create an [App Password](https://myaccount.google.com/apppasswords):
  1. Enable 2-Factor Authentication on your Gmail
  2. Go to App Passwords
  3. Select Mail + Windows Computer
  4. Copy the generated password
  5. Paste into `EMAIL_PASSWORD` in Render

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Render will build and deploy (takes ~2-3 minutes)
3. Once deployed, you'll see a live URL like:
   ```
   https://stockfx-backend.onrender.com
   ```

⚠️ **Important**: The free tier spins down after 15 minutes of inactivity. To wake it up:
- Visit the URL once, and it will restart
- Requests from your frontend will also wake it up

### 2.6 Update Vercel Environment Variable
1. Go back to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   ```
   https://stockfx-backend.onrender.com
   ```
4. Click **"Save"** and redeploy frontend (Vercel will auto-redeploy on changes)

---

## Step 3: Update CORS Configuration (Backend)

Add to `auth-backend/src/server-enhanced.js` (around line 12):

```javascript
const allowedOrigins = [
  'https://your-vercel-frontend.vercel.app',
  'http://localhost:5173', // for local testing
];

app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

---

## Step 4: Testing the Deployment

### Test Backend Health
```
curl https://your-render-backend.onrender.com/api/health
```

### Test Frontend
```
https://your-vercel-frontend.vercel.app
```

### Test Registration Flow
1. Go to frontend URL
2. Click "Register"
3. Fill in details and submit
4. Check email for OTP
5. Verify account

---

## Step 5: Database Migration (Optional)

Currently using **JSON file storage** (suitable for small projects).

When ready to use **MongoDB Atlas**:
1. Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to Railway environment:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/stockfx
   ```
5. Update backend to use MongoDB

---

## Troubleshooting

### "Cannot POST /api/auth/register"
- Check CORS settings
- Verify `VITE_API_URL` in Vercel matches Render URL

### "Email not sending"
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct

### "502 Bad Gateway" on Render
- Check **Logs** tab in Render dashboard
- Verify `NODE_ENV` and `PORT` are set
- Ensure Start Command is correct: `cd auth-backend && node src/server-enhanced.js`
- Check that all environment variables are set

### Updated after deployment?
- Vercel auto-deploys on push to main
- Render auto-deploys on push to main
- Wait 2-3 minutes for deployment to complete

---

## Production Checklist

- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Render (Free Tier)
- ✅ Environment variables configured
- ✅ CORS enabled for frontend domain
- ✅ Email credentials set up

## Important Notes on Render Free Tier

**Free Tier Limitations:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30 seconds (cold start)
- Suitable for low-traffic applications

**To Avoid Spin-Down:**
- Send a request to your backend every 15 minutes
- Use a monitoring service like Uptime Robot (free)

**Paid Tier:**
- If you need always-on service, upgrade to $7/month plan
- No cold starts, better performance
- ✅ JWT_SECRET changed to secure value
- ✅ Tested registration & OTP flow
- ✅ Monitored logs for errors

---

## URLs After Deployment

Replace with your actual URLs:

| Component | URL |
|-----------|-----|
| Frontend | https://your-app-name.vercel.app |
| Backend API | https://your-app-name.railway.app |
| GitHub Repo | https://github.com/classiqueozofficial1-web/stockfx |

---

Need help? Check logs in Railway and Vercel dashboards!
