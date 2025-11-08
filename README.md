# OSINT Investigator Web Platform

A full-stack OSINT (Open-Source Intelligence) investigation platform with a cyberpunk-themed UI, featuring high-speed search across massive datasets using Elasticsearch.

## Features

- **High-Speed Search**: Elasticsearch-powered search across multiple data types (emails, phones, usernames, vehicles, UPI IDs)
- **Cyberpunk UI**: Futuristic, hacking-themed interface with mini-game loading screens
- **Freemium Model**: Free tier with paid subscription options (₹0, ₹2,000, ₹5,000, ₹10,000+)
- **Multi-Factor Authentication**: Email/password + OAuth (Google, GitHub, Apple) with mini-game challenges
- **Admin Panel**: Data upload, user management, analytics, and enterprise team control
- **Step-by-Step Results**: Animated search results display by data type

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Search Engine**: Elasticsearch
- **Database**: PostgreSQL
- **Authentication**: JWT + OAuth 2.0
- **Payments**: Stripe
- **Email**: SendGrid

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Payments**: Stripe.js

## Project Structure

```
osint-investigator/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Configuration
│   │   ├── models.py            # Database models
│   │   ├── auth.py              # Authentication
│   │   ├── search.py            # Search API
│   │   ├── elasticsearch_client.py  # ES client
│   │   ├── stripe_handler.py    # Stripe integration
│   │   └── admin.py             # Admin endpoints
│   ├── scripts/
│   │   └── import_data.py       # Excel import script
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── styles/              # CSS/Tailwind
│   │   ├── utils/               # Utility functions
│   │   └── App.jsx              # Main app
│   ├── package.json
│   └── vite.config.js
└── docs/
    ├── API.md                   # API documentation
    ├── DEPLOYMENT.md            # Deployment guide
    └── ADMIN_GUIDE.md           # Admin panel guide
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL
- Elasticsearch 8.x
- Redis (optional, for caching)

### Backend Setup

1. **Create virtual environment**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Configure environment**:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Run database migrations**:
```bash
# TODO: Add Alembic migrations
```

5. **Start Elasticsearch**:
```bash
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:8.11.0
```

6. **Start the server**:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

## Data Import

### Excel Import

Prepare Excel file with columns: `type`, `value`, `source`, `additional_info`

```bash
python backend/scripts/import_data.py --file data.xlsx
```

### Admin Panel Upload

- Login to admin panel
- Navigate to Data Management
- Upload Excel/CSV file or paste JSON data
- Click "Import Data"

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/challenge/fingerprint` - Get fingerprint challenge
- `GET /auth/challenge/password` - Get password challenge
- `GET /auth/challenge/circuit` - Get circuit challenge

### Search
- `GET /api/search?q=<query>&type=<optional>` - Search data

### Admin (Protected)
- `POST /admin/upload-data` - Upload data files
- `GET /admin/users` - List users
- `GET /admin/teams` - List teams
- `GET /admin/analytics` - Get analytics

## Subscription Plans

| Plan | Price | Searches | Features |
|------|-------|----------|----------|
| Free | ₹0 | 10/month | Basic search |
| Pro | ₹2,000/year | 10/day | All data types, dashboard |
| Investigator | ₹5,000/year | 50/day | Priority search, analytics |
| Enterprise Basic | ₹10,000/year | Team limit | Multi-user, team management |
| Enterprise Unlimited | Custom | Unlimited | Custom allocation, private hosting |

## Environment Variables

See `backend/env.example` for all required environment variables.

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Contact

For enterprise inquiries or support, please contact: admin@osintinvestigator.com
