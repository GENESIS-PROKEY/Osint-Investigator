# Quick Start Guide

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ installed
- Elasticsearch 8.x (optional for MVP - can add data later)

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# Or on Linux/Mac: source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp env.example .env
```

5. Update `.env` with a secret key:
```
SECRET_KEY=your-random-secret-key-here
```

6. Start the server:
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000
Swagger docs at http://localhost:8000/docs

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## First User

1. Visit http://localhost:5173
2. Click "Register"
3. Create an account with email/password
4. You'll be automatically logged in
5. Go to Dashboard to see your search count

## Testing Search

1. Start Elasticsearch (optional):
```bash
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:8.11.0
```

2. Add test data to Elasticsearch:
- Use the `/admin/upload-data` endpoint
- Or import Excel using `python scripts/import_data.py --file data.xlsx`

## Admin Access

To make a user admin:
1. The database file is at `backend/osint.db`
2. Use SQLite browser or run SQL to set `is_admin = 1`

## Troubleshooting

- **Backend won't start**: Check if port 8000 is free
- **Frontend won't start**: Check if port 5173 is free, run `npm install` again
- **Database errors**: Delete `backend/osint.db` and restart the backend
- **Elasticsearch errors**: The app will work without it, but search won't return results
