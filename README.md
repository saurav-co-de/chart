# 📍 Location-Based Ephemeral Chat App

A full-stack real-time chat application that connects users based on their GPS location. Messages automatically delete after 2 hours, creating a truly ephemeral communication experience similar to Snapchat or Yik Yak.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Location-Based**: Automatically detects GPS location and finds nearby users within 5km
- **Real-Time Chat**: Instant messaging using Socket.IO
- **Ephemeral Messages**: Messages auto-delete after 2 hours using MongoDB TTL indexes
- **Location Rooms**: Automatic room assignment based on geographic grid
- **Typing Indicators**: See when others are typing
- **Modern UI**: Beautiful, responsive React interface
- **Mobile Friendly**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** - Database with GeoJSON location support
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI framework
- **Socket.IO Client** - Real-time connection
- **Axios** - HTTP requests
- **React Toastify** - Beautiful notifications
- **CSS3** - Modern styling with animations

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (free tier works perfectly)

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
# If you have the zip file, extract it
unzip location-chat-app.zip
cd location-chat-app
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy your connection string

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file and add your MongoDB connection string
# Update these values:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a **NEW terminal window** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults are set)
cp .env.example .env

# Start the React app
npm start
```

The frontend will automatically open at `http://localhost:3000`

## 🎮 How to Use

### First Time Setup

1. **Allow Location Access**: The browser will ask for location permission - click "Allow"
2. **Create Account**: Click "Sign Up" and create your account
3. **Start Chatting**: You'll automatically join a room with nearby users

### Features

- **Send Messages**: Type in the input box and press Enter or click Send
- **See Typing Indicators**: Watch when others are typing
- **Auto-Delete**: All messages disappear after 2 hours
- **Nearby Users**: Only connects with users within 5km radius
- **Location Rooms**: Automatically joins appropriate room based on your location

## 📁 Project Structure

```
location-chat-app/
│
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas (User, Message)
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── socket/          # Socket.IO handlers
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API & Socket services
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main App component
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🧪 Testing the App

### Test Scenario 1: Single User
1. Open the app and create an account
2. Allow location access
3. Send a message to yourself
4. Watch it appear in real-time

### Test Scenario 2: Multiple Users (Same Computer)
1. Open app in regular browser window
2. Open app in incognito/private window
3. Create different accounts in each
4. Both users will join the same room (same location)
5. Send messages between them

### Test Scenario 3: Message Expiry
1. Send a message
2. Note the countdown timer (shows time until deletion)
3. Messages automatically delete after 2 hours

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Protected)

### Location
- `PUT /api/location/update` - Update user location (Protected)
- `GET /api/location/nearby` - Get nearby users (Protected)
- `GET /api/location/room` - Get room ID for current location (Protected)

### Messages
- `GET /api/messages/:roomId` - Get room messages (Protected)
- `POST /api/messages` - Create message (Protected)
- `DELETE /api/messages/:id` - Delete message (Protected)

### Socket.IO Events
- `join_room` - Join a chat room
- `send_message` - Send a message
- `new_message` - Receive new message
- `typing` - User typing indicator
- `user_joined` - User joined notification
- `user_left` - User left notification

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure port 5000 is not in use
- Verify all environment variables are set

### Frontend won't connect
- Check if backend is running on port 5000
- Verify CORS settings in backend
- Check browser console for errors

### Location not working
- Ensure HTTPS (required for geolocation)
- Check browser location permissions
- Try in different browser

### Messages not appearing
- Check Socket.IO connection in browser console
- Verify JWT token is valid
- Check backend logs for errors

## 📱 Mobile Testing

The app works on mobile browsers. To test:

1. Ensure your computer and phone are on the same network
2. Find your computer's local IP address
3. Update frontend .env with your IP:
   ```
   REACT_APP_API_URL=http://YOUR_LOCAL_IP:5000/api
   REACT_APP_SOCKET_URL=http://YOUR_LOCAL_IP:5000
   ```
4. Access from phone: `http://YOUR_LOCAL_IP:3000`

## 🚢 Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect to Railway or Render
3. Add environment variables
4. Deploy!

### Frontend Deployment (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Update environment variables with production URLs

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Verify all environment variables
4. Ensure MongoDB Atlas is properly configured

## 🎉 Features Coming Soon

- User profiles
- Image sharing
- Chat rooms discovery
- Message reactions
- Private messaging
- Push notifications

---

**Built with ❤️ using Node.js, React, and MongoDB**
