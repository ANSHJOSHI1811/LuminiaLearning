# LuminiaLearning - Minimal Setup Guide

## Architecture Changed ✅
- **Backend:** Express server (port 5000) handles Gemini API calls securely
- **Frontend:** React app (port 3000) calls backend APIs instead of Gemini directly
- **API Key:** Now protected on backend, not exposed in browser

## Setup Complete

### Files Created:
- `src/server.ts` - Express backend with 3 API endpoints
- Updated `src/services/gemini.ts` - Now calls backend instead of Gemini directly
- Updated `package.json` - Added server scripts

### API Endpoints Ready:
- `POST /api/explain` - Explain a concept
- `POST /api/roadmap` - Generate learning roadmap  
- `POST /api/quiz` - Generate quiz questions

## Run the App

### Option 1: Run Both (Recommended)
```bash
npm run dev:all
```
This runs:
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000

### Option 2: Run Separately
Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## Test the Setup
1. Start both servers using `npm run dev:all`
2. Open http://localhost:3000
3. Enter a learning goal (e.g., "Learn React Hooks")
4. Check the browser console for any errors

## Next Steps
- Test the learning flow end-to-end
- Add more features based on feedback
- Improve error handling as needed
