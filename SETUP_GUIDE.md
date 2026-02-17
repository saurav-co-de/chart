# 🚀 Complete Setup Guide - Location Chat App

This guide will walk you through setting up the Location-Based Ephemeral Chat App from scratch.

## ⏱️ Setup Time: 10-15 minutes

## 📋 What You'll Need

1. **Node.js** installed on your computer
2. **A code editor** (VS Code recommended)
3. **A MongoDB Atlas account** (free)
4. **A modern web browser** (Chrome, Firefox, Safari, Edge)

---

## Step 1: Install Node.js (If Not Already Installed)

### Check if Node.js is installed:
```bash
node --version
npm --version
```

If you see version numbers, you're good to go! If not:

### Install Node.js:
1. Go to https://nodejs.org
2. Download the LTS (Long Term Support) version
3. Install with default options
4. Restart your terminal/command prompt
5. Verify installation with commands above

---

## Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Complete the registration

### 2.2 Create Cluster
1. Choose **FREE** M0 cluster
2. Select a cloud provider (AWS recommended)
3. Choose region closest to you
4. Name your cluster (e.g., "LocationChat")
5. Click "Create Cluster" (takes 1-3 minutes)

### 2.3 Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `chatuser` (or any name you prefer)
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 2.4 Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 2.5 Get Connection String
1. Go back to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Click "Connect your application"
4. Copy the connection string
5. It looks like: `mongodb+srv://chatuser:<password>@cluster0...`
6. **IMPORTANT**: Replace `<password>` with the actual password you saved

---

## Step 3: Extract and Open the Project

```bash
# Extract the zip file
unzip location-chat-app.zip

# Navigate to the project
cd location-chat-app

# Open in VS Code (or your preferred editor)
code .
```

---

## Step 4: Backend Setup

### 4.1 Navigate to Backend
```bash
cd backend
```

### 4.2 Install Dependencies
```bash
npm install
```

This will install all required packages. It may take 1-2 minutes.

### 4.3 Configure Environment Variables

1. Copy the example environment file:
```bash
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

2. Open `.env` file in your editor

3. Update with your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://chatuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/location-chat?retryWrites=true&w=majority
JWT_SECRET=mysupersecretkey123!@#
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**IMPORTANT**: 
- Replace `YOUR_PASSWORD` with your MongoDB password
- Replace the entire MONGODB_URI if your connection string is different
- Change JWT_SECRET to any random string

### 4.4 Start Backend Server

```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
📡 Socket.IO server ready
🌍 Environment: development
✅ Ready to accept connections!
```

**Leave this terminal window open!**

---

## Step 5: Frontend Setup

### 5.1 Open NEW Terminal

Open a **new terminal window/tab** (don't close the backend terminal)

### 5.2 Navigate to Frontend
```bash
cd frontend
```

### 5.3 Install Dependencies
```bash
npm install
```

This will install React and other frontend packages. Takes 1-2 minutes.

### 5.4 Configure Environment (Optional)

The frontend has default values that work with local development. If needed:

```bash
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

Default values (usually no changes needed):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 5.5 Start Frontend

```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

---

## Step 6: Test the Application

### 6.1 First User Test

1. **Allow Location Access**: Browser will ask - click "Allow"
2. **Sign Up**: 
   - Username: `testuser1`
   - Email: `test1@test.com`
   - Password: `password123`
3. **You're In!** You should see the chat interface

### 6.2 Test Messaging

1. Type a message: "Hello, this is my first message!"
2. Press Enter or click Send
3. Message appears in the chat
4. Notice the countdown timer (2 hours)

### 6.3 Test Multiple Users

**Option A: Same Computer**
1. Open a new Incognito/Private browser window
2. Go to `http://localhost:3000`
3. Sign up with different credentials:
   - Username: `testuser2`
   - Email: `test2@test.com`
   - Password: `password123`
4. Both users should see the same room
5. Send messages between them!

**Option B: Two Devices**
1. Find your computer's local IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   
   # Mac/Linux
   ifconfig
   # Look for inet address
   ```
2. On your phone, open browser and go to: `http://YOUR_IP:3000`
3. Create account and start chatting!

---

## 🎯 Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connection successful (check backend console)
- [ ] Can sign up new users
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Location permission granted
- [ ] Message countdown timer visible

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start

**Error: "MongoDB connection failed"**
- Check your connection string in `.env`
- Verify password is correct (no < > brackets)
- Ensure Network Access is set to "0.0.0.0/0"
- Check if cluster is fully deployed

**Error: "Port 5000 already in use"**
```bash
# Find and kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: Frontend won't connect to backend

**Check:**
1. Backend is running (`npm start` in backend folder)
2. No errors in backend console
3. Backend shows: "Server running on port 5000"
4. Browser console (F12) shows no CORS errors

### Issue: Location not working

**Solutions:**
1. Use Chrome or Firefox (best support)
2. Allow location when browser asks
3. Check browser location settings
4. Try refreshing the page

### Issue: Messages not appearing

**Check:**
1. Socket.IO connection (browser console should show: "Socket connected")
2. Both users are in the same room (check room ID in header)
3. No errors in backend console
4. Network requests in browser DevTools

---

## 📊 Database Verification

To verify data is being saved:

1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select your database (`location-chat`)
4. Check collections:
   - `users` - Should have your registered users
   - `messages` - Should have sent messages

---

## 🔄 Restart Instructions

If you need to restart:

### Stop Servers:
- Press `Ctrl+C` in both terminal windows

### Start Again:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 🚀 Production Deployment

Ready to deploy to the internet?

### Backend Options:
1. **Railway.app** (Easiest)
   - Connect GitHub repo
   - Add environment variables
   - Deploy!

2. **Render.com**
   - Free tier available
   - Auto-deploy from Git

### Frontend Options:
1. **Vercel** (Recommended)
   ```bash
   npm run build
   # Then deploy build folder
   ```

2. **Netlify**
   - Drag & drop build folder
   - Or connect GitHub

---

## 📱 Mobile Access (Local Network)

To access from phone on same WiFi:

1. Find your computer's IP:
   ```bash
   # Windows: ipconfig
   # Mac/Linux: ifconfig
   ```

2. Update frontend `.env`:
   ```env
   REACT_APP_API_URL=http://192.168.1.100:5000/api
   REACT_APP_SOCKET_URL=http://192.168.1.100:5000
   ```

3. Restart frontend

4. On phone, visit: `http://192.168.1.100:3000`

---

## 🎓 Learning Resources

Want to understand the code better?

- **Node.js**: https://nodejs.org/en/docs/
- **Express**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **React**: https://react.dev/
- **Socket.IO**: https://socket.io/docs/

---

## ✅ You're All Set!

Your Location-Based Chat App is now running! 

**Next Steps:**
- Invite friends to test
- Customize the UI
- Add new features
- Deploy to production

**Need Help?**
- Check backend console for errors
- Check browser console (F12) for frontend errors
- Review this guide again
- Verify all environment variables

---

**Happy Coding! 🎉**
