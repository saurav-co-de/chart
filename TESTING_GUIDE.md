# 🧪 Testing Guide - Location Chat App

This guide will help you test all features of the Location-Based Ephemeral Chat App.

## 🎯 Test Checklist

Use this checklist to ensure everything works:

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] User registration works
- [ ] User login works
- [ ] Location detection works
- [ ] Room assignment works
- [ ] Sending messages works
- [ ] Receiving messages works
- [ ] Typing indicators work
- [ ] Message countdown timer visible
- [ ] Real-time updates work
- [ ] Multiple users can chat
- [ ] Logout works

---

## Test 1: Backend Verification

### Start Backend
```bash
cd backend
npm start
```

### Expected Output:
```
🚀 Server running on port 5000
📡 Socket.IO server ready
🌍 Environment: development
MongoDB Connected: cluster0...
✅ Ready to accept connections!
```

### Quick Test:
Open browser and visit: `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Location Chat Server is running",
  "timestamp": "2024-..."
}
```

✅ **Pass**: Backend is running
❌ **Fail**: Check MongoDB connection and environment variables

---

## Test 2: Frontend Verification

### Start Frontend
```bash
cd frontend
npm start
```

### Expected Behavior:
- Browser opens automatically at `http://localhost:3000`
- Login page displays with gradient background
- No console errors (press F12 to check)

✅ **Pass**: Frontend loads successfully
❌ **Fail**: Check if backend is running, check console errors

---

## Test 3: User Registration

### Steps:
1. Click "Sign Up"
2. Fill in:
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"

### Expected Behavior:
- Success toast appears: "Account created successfully!"
- Redirected to chat interface
- Browser asks for location permission

### Verification:
- User should be logged in
- Header shows username: "👤 testuser1"

✅ **Pass**: User registered and logged in
❌ **Fail**: Check backend logs, verify MongoDB connection

---

## Test 4: Location Detection

### Steps:
1. When browser asks for location permission, click "Allow"
2. Wait for location to be detected

### Expected Behavior:
- Loading spinner shows "Setting up your location..."
- Success toast: "Location updated!"
- Success toast: "Connected to nearby chat!"
- Chat interface loads

### Verification:
- Header shows coordinates (e.g., "📍 37.7749, -122.4194")
- Room ID displayed (e.g., "Room: room_37.77_-122.41")
- Connection status shows green dot

✅ **Pass**: Location detected and room assigned
❌ **Fail**: Check browser location settings, try different browser

---

## Test 5: Send Message

### Steps:
1. Type in message input: "Hello, this is my first test message!"
2. Press Enter or click Send button

### Expected Behavior:
- Message appears in chat immediately
- Message shows on the right side (your message)
- Username not shown (it's your message)
- Timestamp displayed
- Countdown timer shows (e.g., "⏱️ 2h 0m")

### Verification:
- Message visible in chat
- Timer counting down
- Input clears after sending

✅ **Pass**: Message sent successfully
❌ **Fail**: Check Socket.IO connection in browser console

---

## Test 6: Multiple Users (Same Room)

### Method A: Same Computer

#### Steps:
1. **Browser 1**: Keep your current session open
2. **Browser 2**: Open Incognito/Private window
3. Go to `http://localhost:3000`
4. Sign up with different credentials:
   - Username: `testuser2`
   - Email: `test2@example.com`
   - Password: `password123`
5. Allow location (should be same as Browser 1)

### Expected Behavior:
- Both users see the same Room ID
- Browser 1 shows toast: "testuser2 joined the chat"
- Both users in same room

#### Test Messaging:
1. **Browser 1**: Send message "Hi from user 1"
2. **Browser 2**: Should see message appear on left side
3. **Browser 2**: Reply "Hi from user 2"
4. **Browser 1**: Should see reply appear

### Verification:
- Messages appear in real-time in both browsers
- Own messages on right (blue), other messages on left (white)
- Usernames shown on other users' messages

✅ **Pass**: Real-time chat works between users
❌ **Fail**: Check if both users have same Room ID

---

## Test 7: Typing Indicators

### Steps:
1. Have two users in same room (from Test 6)
2. **Browser 1**: Start typing (don't send)
3. **Browser 2**: Watch for typing indicator

### Expected Behavior:
- **Browser 2** shows: Animated dots + "testuser1 is typing..."
- Indicator disappears when user stops typing

### Verification:
- Typing indicator appears and disappears correctly
- Multiple users typing shows all usernames

✅ **Pass**: Typing indicators work
❌ **Fail**: Check Socket.IO events in browser console

---

## Test 8: Message Expiry Countdown

### Steps:
1. Send a message
2. Look at the message footer

### Expected Behavior:
- Timer shows "⏱️ 2h 0m" (or slightly less)
- Timer counts down every minute
- After 2 hours, message automatically deleted by MongoDB

### Verification (Quick Test):
Since 2 hours is long, you can verify in MongoDB:
1. Go to MongoDB Atlas
2. Browse Collections → messages
3. Check `expiresAt` field matches 2 hours from `createdAt`

✅ **Pass**: Expiry timer visible and accurate
❌ **Fail**: Check Message model TTL index

---

## Test 9: Nearby Users Feature

### Steps:
1. With user logged in and location set
2. Open browser DevTools (F12)
3. Go to Network tab
4. Look for API call to `/api/location/nearby`

### Expected Behavior:
- API returns list of nearby users within 5km
- Users within radius shown

### Manual Test with Different Locations:
Unfortunately, testing different locations requires:
- Two devices in different physical locations, OR
- Mocking location in browser DevTools (advanced)

✅ **Pass**: Nearby users endpoint works
❌ **Fail**: Check backend location controller

---

## Test 10: Logout

### Steps:
1. Click "Logout" button in header
2. Observe behavior

### Expected Behavior:
- Redirected to login page
- Token removed from localStorage
- Socket.IO disconnected
- Can't access chat without logging in again

### Verification:
1. Press F12 → Application → Local Storage
2. Verify `token` is removed
3. Try to refresh page - should stay on login

✅ **Pass**: Logout works correctly
❌ **Fail**: Check App.js logout handler

---

## Test 11: Room Assignment Logic

### Understanding Rooms:
- Rooms are based on geographic grid
- Each grid square is ~1km
- Coordinates rounded to 2 decimal places
- Example: 37.7749, -122.4194 → `room_37.77_-122.41`

### Test:
1. User at coordinates 37.7749, -122.4194
2. User at coordinates 37.7750, -122.4195
3. Both should be in same room: `room_37.77_-122.41`

### Verification:
- Check Room ID in header
- Both users see same Room ID
- Messages visible to both

✅ **Pass**: Room assignment correct
❌ **Fail**: Check locationController getRoomId function

---

## Test 12: Error Handling

### Test Invalid Login:
1. Try logging in with wrong password
2. **Expected**: Toast error: "Invalid credentials"

### Test Duplicate Username:
1. Try signing up with existing username
2. **Expected**: Toast error: "Username already taken"

### Test Without Location:
1. Deny location permission
2. **Expected**: Error message about location

### Test Network Issues:
1. Stop backend server
2. Try sending message
3. **Expected**: Error toast appears

✅ **Pass**: Error handling works
❌ **Fail**: Check error handling in components

---

## Performance Tests

### Load Test (Optional):
1. Open 5+ browser tabs with different users
2. Send messages rapidly
3. Verify:
   - All messages delivered
   - No lag or delay
   - Server remains stable

### Memory Test:
1. Leave app running for 10+ minutes
2. Send messages periodically
3. Check browser memory (DevTools → Performance)
4. Verify: No memory leaks

---

## Database Verification

### Check MongoDB Atlas:

1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Verify collections exist:

#### Users Collection:
```json
{
  "_id": "...",
  "username": "testuser1",
  "email": "test1@example.com",
  "location": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  },
  "isOnline": true,
  "lastSeen": "2024-..."
}
```

#### Messages Collection:
```json
{
  "_id": "...",
  "user": "...",
  "username": "testuser1",
  "message": "Hello world!",
  "roomId": "room_37.77_-122.41",
  "location": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  },
  "expiresAt": "2024-...", // 2 hours in future
  "createdAt": "2024-..."
}
```

✅ **Pass**: Data correctly stored in MongoDB
❌ **Fail**: Check models and controllers

---

## Browser Console Checks

### No Errors Expected

Open DevTools (F12) and check:

#### Console Tab:
- Should see: "Socket connected: [socket-id]"
- No red error messages
- WebSocket connection established

#### Network Tab:
- API calls to `/api/auth/login` succeed (200)
- API calls to `/api/location/update` succeed (200)
- WebSocket connection established
- No failed requests (except expected 401 if not logged in)

#### Application Tab:
- localStorage contains `token`
- localStorage contains `user` (with username and email)

---

## Mobile Testing

### Test on Mobile Device:

1. Connect phone to same WiFi as computer
2. Find computer's IP address
3. Update frontend .env with IP
4. Access from phone: `http://[YOUR-IP]:3000`

### Expected Behavior:
- App loads on mobile
- Responsive design adapts
- Touch controls work
- Location permission requested
- Can send/receive messages

✅ **Pass**: Mobile experience works
❌ **Fail**: Check responsive CSS

---

## Automated Test Script

### Backend Health Check:
```bash
cd backend
node test-setup.js
```

This script verifies:
- Environment variables set
- All modules installed
- MongoDB connection works

---

## Common Test Failures & Solutions

### Messages not appearing in real-time
**Solution**: 
- Check Socket.IO connection in console
- Verify both users in same room
- Check backend socket logs

### Location not detected
**Solution**:
- Use Chrome or Firefox
- Check browser location settings
- Try different browser
- Ensure HTTPS (if deployed)

### Different rooms for nearby users
**Solution**:
- Check coordinate rounding logic
- Verify location API response
- Both users should have very close coordinates

### Database connection fails
**Solution**:
- Verify MongoDB URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure database user created

---

## Test Results Template

Use this to document your testing:

```
## Test Results - [Date]

✅ Backend starts: PASS
✅ Frontend starts: PASS  
✅ User registration: PASS
✅ User login: PASS
✅ Location detection: PASS
✅ Send message: PASS
✅ Receive message: PASS
✅ Multiple users: PASS
✅ Typing indicator: PASS
✅ Message expiry: PASS
✅ Logout: PASS

Notes:
- All features working as expected
- No console errors
- Response times good (<100ms)
- Database verified

Tested by: [Your Name]
Environment: Development
Browser: Chrome 120
OS: Windows 11
```

---

## 🎉 All Tests Passing?

Congratulations! Your Location-Based Chat App is fully functional!

**Next Steps:**
1. Customize the UI/UX
2. Add new features
3. Optimize performance
4. Deploy to production
5. Share with friends!

---

**Happy Testing! 🚀**
