# SyncBoard
SyncBoard is a collaborative planner that connects with Google Calendar to let friends or teams plan together. Users can add notes, create and complete shared actions, receive reminders, and stay organized across web, Android, and browser extension. One calendar, shared by all.


## Technologies Used

- **Node.js & Express**: Backend server, REST API, Google OAuth integration
- **MongoDB & Mongoose**: Database for users, tasks, and relationships
- **React**: Frontend UI, interactive components
- **HTML/CSS**: Layout, styling, dark theme, animations
- **Google Calendar API**: Syncs and displays calendar events
- **Spline**: 3D interactive backgrounds for modern UI
- **dotenv**: Loads environment variables for secrets/config
- **CORS**: Enables cross-origin requests between frontend and backend

## How to Run Locally

### 1. Backend (Node.js/Express)
1. Go to the backend folder:
	```
	cd backend
	```
2. Install dependencies:
	```
	npm install
	```
3. Create a `.env` file (copy from `.env.example`) and fill in your Google and MongoDB credentials.
4. Start the backend server:
	```
	npm run dev
	```
	The backend runs on `http://localhost:5000` by default.

### 2. Frontend (React)
1. Go to the frontend folder:
	```
	cd frontend
	```
2. Install dependencies (if using npm):
	```
	npm install
	```
3. Serve the frontend (for static HTML/JS):
	```
	npx serve .
	```
	Or simply open `index.html` in your browser for instant preview.

### 3. Usage
- Make sure both backend and frontend are running.
- Open the frontend in your browser and interact with the app.
- The frontend communicates with the backend at `http://localhost:5000`.
