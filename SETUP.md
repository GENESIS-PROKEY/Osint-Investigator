# OSINT Investigator - Setup & Run Guide

## What's Been Implemented ✅

### Backend
- ✅ FastAPI with SQLite database
- ✅ Email/password authentication (OAuth removed)
- ✅ JWT token-based auth with bcrypt password hashing
- ✅ Protected routes with database sessions
- ✅ Search API with Elasticsearch integration
- ✅ Admin endpoints with role-based access
- ✅ User management and search logging
- ✅ Rate limiting preparation (slowapi)
- ✅ Search limit enforcement per plan

### Frontend
- ✅ React with cyberpunk UI theme
- ✅ Login and Register pages connected to API
- ✅ Protected routes for authenticated pages
- ✅ Dashboard with real user data
- ✅ Search interface connected to backend
- ✅ Error handling and loading states
- ✅ Responsive design with Tailwind CSS

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ Admin role checks
- ✅ Search limit checks

## How to Run

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies (already done if you ran pip install)
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload
```

Backend will run on http://localhost:8000

### Step 2: Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies (already done if you ran npm install)
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

### Step 3: Test the Application

1. **Register**: Visit http://localhost:5173 and create an account
2. **Login**: Test login functionality
3. **Dashboard**: View your user data and remaining searches
4. **Search**: Try searching (may not return results without Elasticsearch data)

## API Testing

### Using Swagger UI
Visit http://localhost:8000/docs for interactive API documentation

### Using curl

**Register:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Search (with token):**
```bash
curl -X GET "http://localhost:8000/api/search?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database

The SQLite database file is created automatically at `backend/osint.db`

**Tables created:**
- users: User accounts with authentication
- teams: Enterprise teams (if used)
- search_logs: Search history and analytics

**Make a user admin:**
```sql
UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';
```

## Elasticsearch (Optional)

If you want to test search functionality:

1. Install Elasticsearch using Docker:
```bash
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:8.11.0
```

2. Add sample data using the import script:
```bash
python backend/scripts/import_data.py --file sample_data.xlsx
```

## What Still Needs to be Done

### High Priority
- [ ] Add sample Excel data for testing
- [ ] Implement admin file upload
- [ ] Add Stripe payment integration
- [ ] Add email verification flow
- [ ] Implement search history on dashboard

### Medium Priority
- [ ] Add rate limiting to APIs
- [ ] Implement reset search limits (monthly/daily)
- [ ] Add team management for enterprises
- [ ] Build analytics dashboard for admin

### Nice to Have
- [ ] Mini-game UI components (fingerprint, password, circuit)
- [ ] Advanced search filters
- [ ] Export search results
- [ ] Email notifications

## File Structure

```
OSINT/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + routes
│   │   ├── config.py            # Settings
│   │   ├── database.py          # Database connection
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── auth.py              # Authentication & JWT
│   │   ├── search.py            # Search API
│   │   ├── admin.py             # Admin endpoints
│   │   └── elasticsearch_client.py
│   ├── scripts/
│   │   └── import_data.py       # Excel import
│   ├── requirements.txt
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # All pages
│   │   ├── components/          # Reusable components
│   │   ├── utils/
│   │   │   └── api.js           # API client
│   │   └── App.jsx              # Main app
│   └── package.json
│
└── docs/
    └── QUICKSTART.md            # This file
```

## Troubleshooting

**Error: "Module not found"**
→ Make sure virtual environment is activated and dependencies installed

**Error: "Database locked"**
→ Close any SQLite browsers or tools accessing the database

**Error: "Port already in use"**
→ Stop other services using ports 8000 (backend) or 5173 (frontend)

**Search returns empty results**
→ Elasticsearch may not be running or no data imported yet

**CORS errors in browser**
→ Make sure backend is running and CORS settings are correct in `main.py`

## Next Steps

1. **Test all features** with the current implementation
2. **Add sample data** to Elasticsearch for testing
3. **Implement missing features** as needed
4. **Customize styling** to match your branding
5. **Add more security layers** if needed

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- Network tab in browser DevTools
- API documentation at http://localhost:8000/docs
