# 🆓 Learning Companion - FREE Hybrid Setup Guide

**Cost: $0 (completely free)**

---

## 🎯 What You'll Use

| Component | Service | Cost | Limit |
|-----------|---------|------|-------|
| **AI - Option 1** | Google Gemini API | FREE | 60 calls/min |
| **AI - Option 2** | Ollama (Local) | FREE | Unlimited (local) |
| **Database** | Firestore | FREE | 50K reads/20K writes/day |
| **Hosting** | Google Cloud Run | FREE | 2M requests/month |
| **Frontend** | Firebase Hosting | FREE | 1GB/month |

---

## 📋 Step-by-Step Setup

### **Step 1: Get Free Google Gemini API Key (5 minutes)**

This is the EASIEST option. No credit card needed!

```bash
# 1. Go to: https://aistudio.google.com/app/apikeys

# 2. Click "Create API Key"

# 3. Copy the key

# 4. Save to .env file
echo "GOOGLE_API_KEY=paste_your_key_here" > .env
echo "USE_GEMINI=true" >> .env
echo "GCP_PROJECT_ID=your-project-id" >> .env
```

**That's it!** You now have free AI.

---

### **Step 2: Set Up Firestore (Free Tier)**

```bash
# 1. Go to: https://console.firebase.google.com

# 2. Create new project (free)

# 3. Create Firestore database
#    - Region: nearest to you
#    - Mode: Start in production

# 4. Get your project ID from settings

# 5. Update .env
echo "GCP_PROJECT_ID=your-project-id" >> .env
```

**Free tier includes:**
- 50,000 read operations/day
- 20,000 write operations/day
- 1GB storage
- **More than enough for testing!**

---

### **Step 3: Install Backend Locally**

```bash
# Create project
mkdir learning-companion-free
cd learning-companion-free

# Initialize Node.js
npm init -y

# Install dependencies
npm install express @google/generative-ai firebase-admin dotenv node-fetch

# Create .env file (all free)
cat > .env << EOF
GOOGLE_API_KEY=your_free_api_key_here
USE_GEMINI=true
USE_OLLAMA=false
GCP_PROJECT_ID=your-firebase-project-id
PORT=3000
EOF

# Download service account key
# 1. Go to Firebase Console
# 2. Settings → Service Accounts
# 3. Download JSON key
# 4. Save as: service-account-key.json
# 5. Update .env:
echo "GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json" >> .env
```

---

### **Step 4: Run Backend**

```bash
# Copy the free backend code to file
# File: learning-companion-free-backend.js

# Start the server
node learning-companion-free-backend.js

# Output should show:
# ✅ Google Gemini (free tier)
# ✅ Fallback Templates (always available)
# 💾 Database: Firebase Firestore (free tier)
```

---

### **Step 5: Test Locally**

```bash
# In another terminal, test the API

# 1. Sign up a user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "skillLevel": "beginner",
    "learningStyle": "visual"
  }'

# Copy the userId from response

# 2. Generate a lesson (uses FREE Gemini)
curl -X POST http://localhost:3000/api/lessons/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "topic": "Python Functions"
  }'

# 3. Check health
curl http://localhost:3000/api/health

# You should see:
# ✅ Gemini: configured
# ✅ Firestore: connected
# ✅ Fallback: available
```

---

## 🚀 Deploy to Cloud (FREE)

### **Option A: Deploy to Cloud Run (FREE tier)**

```bash
# 1. Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Enable services
gcloud services enable \
  run.googleapis.com \
  firestore.googleapis.com

# 5. Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["node", "learning-companion-free-backend.js"]
EOF

# 6. Deploy to Cloud Run
gcloud run deploy learning-companion \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GOOGLE_API_KEY=your-key,GCP_PROJECT_ID=your-project"

# 7. Get your URL
gcloud run services describe learning-companion --region us-central1 --format='value(status.url)'

# Save this URL - it's your live API!
```

**You now have a live, free backend! 🎉**

---

### **Option B: Deploy Frontend (FREE)**

```bash
# 1. Create React app
npx create-react-app learning-companion-web
cd learning-companion-web

# 2. Install dependencies
npm install axios react-router-dom

# 3. Create .env.local
echo "REACT_APP_API_URL=https://your-cloud-run-url" > .env.local

# 4. Copy React components (from REACT_COMPONENTS.jsx)

# 5. Build
npm run build

# 6. Deploy to Firebase (free hosting)
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 💻 Alternative: Local Ollama (Optional)

If you want **completely offline, unlimited AI**:

```bash
# 1. Download Ollama (free)
# https://ollama.ai

# 2. Install and run
ollama serve

# 3. In another terminal, pull a model (once, ~5GB)
ollama pull llama2

# 4. Update .env
cat >> .env << EOF
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
EOF

# 5. Restart backend
# It will now use Ollama (completely free, offline)
node learning-companion-free-backend.js
```

**Pros:**
- ✅ Completely offline
- ✅ No rate limits
- ✅ Data stays local
- ✅ Completely free

**Cons:**
- ⚠️ Needs ~8GB RAM
- ⚠️ Slower (5-30 seconds per response)
- ⚠️ Less sophisticated AI

---

## 🎯 Your Architecture (ALL FREE)

```
┌─────────────────────────┐
│   React App             │
│  Firebase Hosting       │
│  (FREE: 1GB)           │
└────────────┬────────────┘
             │ REST API
┌────────────▼────────────┐
│   Node.js Backend       │
│  Cloud Run              │
│  (FREE: 2M req/month)   │
└──┬──────────────────┬───┘
   │                  │
   │ API Calls        │ Read/Write
   │                  │
┌──▼──────┐    ┌──────────▼──────────┐
│Google   │    │  Firestore          │
│Gemini   │    │  (FREE: 50K reads)  │
│(FREE)   │    │                     │
└─────────┘    └─────────────────────┘

(Optional: Replace Gemini with local Ollama)
```

---

## 📊 Free Tier Limits

### **Google Gemini**
- 60 API calls per minute (generous for testing)
- Free forever (no credit card needed)
- If you hit limit, falls back to Ollama/templates

### **Firestore**
- 50,000 read operations/day
- 20,000 write operations/day
- 1GB storage
- **For 100 users, you have 500+ operations per user/day**

### **Cloud Run**
- 2 million requests/month free
- After that: $0.00002400 per request
- **For 100 users, you have 20K requests per user/month**

### **Firebase Hosting**
- 1GB storage free
- 10GB bandwidth free
- Generous limits

---

## ⚠️ When API Limits Are Hit

The system **automatically falls back**:
```
Google Gemini (Rate Limited)
        ↓
Ollama Local (if available)
        ↓
Fallback Templates (always works)
```

So your app **never breaks**, just uses smarter fallbacks.

---

## 🧪 Testing Scenarios

### Test 1: Local Development
```bash
node learning-companion-free-backend.js

# Use Gemini (free, 60 calls/min)
# Works great for development
```

### Test 2: Heavy Load (Multiple Users)
```bash
# If you hit Gemini rate limit:
# System falls back to Ollama or templates
# No errors, just graceful degradation
```

### Test 3: Production on Cloud Run
```bash
# Everything same as local
# But on cloud, publicly accessible
# Still completely free!
```

---

## 📈 Scaling Up (When Ready)

If your app grows and you need more capacity:

| Current | Upgrade To | Cost |
|---------|-----------|------|
| Gemini (60 calls/min) | Premium Gemini | $10-50/month |
| Firestore (50K reads) | Firestore Pro | Auto-scaling |
| Cloud Run (2M req) | Cloud Run | Pay-per-use |

**You can start free and upgrade only when needed!**

---

## 🆘 Troubleshooting

### "Google Gemini API key not working"
```bash
# Check the key is correct
curl https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY

# Should return list of models
```

### "Firestore connection failed"
```bash
# Make sure you have service account key
# Download from: Firebase Console → Settings → Service Accounts

# Check file path in .env
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### "Cloud Run deployment fails"
```bash
# Check Docker locally first
docker build -t test .
docker run -p 3000:3000 test

# Then deploy
gcloud run deploy ...
```

### "Getting empty responses"
```bash
# Check which AI service is active
# Add logging to see which service is being used
curl http://localhost:3000/api/health

# Should show which services are configured
```

---

## 🎓 Project Structure

```
learning-companion-free/
├── learning-companion-free-backend.js  (API server)
├── package.json                         (dependencies)
├── .env                                 (free API keys)
├── service-account-key.json             (Firebase credentials)
└── Dockerfile                           (for Cloud Run)

learning-companion-web/                 (Frontend)
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── LessonViewer.jsx
│   │   ├── ProgressDashboard.jsx
│   │   └── TopicSelector.jsx
│   └── index.jsx
└── .env.local
```

---

## 🚀 Quick Start Commands (Copy/Paste)

```bash
# 1. Get Gemini key from: https://aistudio.google.com/app/apikeys

# 2. Setup
npm init -y
npm install express @google/generative-ai firebase-admin dotenv node-fetch

# 3. Create .env with your free key
cat > .env << EOF
GOOGLE_API_KEY=your_free_key
USE_GEMINI=true
GCP_PROJECT_ID=your-project
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
EOF

# 4. Get service account key (from Firebase Console)
# Download and save as service-account-key.json

# 5. Run!
node learning-companion-free-backend.js

# 6. Test
curl http://localhost:3000/api/health
```

---

## 💡 What Makes This "Free Hybrid"?

1. **Google Gemini** - Free tier AI (60 calls/min)
2. **Ollama Fallback** - Local LLM (unlimited, offline)
3. **Template Fallback** - Zero API calls
4. **Firestore** - Free database tier
5. **Cloud Run** - Free tier hosting

**Any API fails → system falls back → always works!**

---

## 📞 Support

- **Gemini Issues:** https://aistudio.google.com
- **Firestore Issues:** https://console.firebase.google.com
- **Ollama:** https://ollama.ai
- **Google Cloud:** https://cloud.google.com/docs

---

**You're all set with ZERO API costs! 🎉**

Start with Step 1 and follow the guide. You'll have a live learning companion in 1-2 hours!
