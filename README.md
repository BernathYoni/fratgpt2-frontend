# FratGPT 2.0 Frontend

Next.js web application for FratGPT 2.0.

## Features

- Marketing landing page with pricing
- User authentication (login/register)
- Dashboard with usage stats and plan management
- Stripe checkout integration
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Payment**: Stripe

## Local Development

### Prerequisites

- Node.js 20+
- Running backend API

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start dev server
npm run dev
```

The app will run on `http://localhost:3001`.

## Railway Deployment

### 1. Create Railway Project

1. Go to [Railway](https://railway.app)
2. Create new project
3. Deploy this GitHub repo

### 2. Set Environment Variables

In Railway dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

### 3. Deploy

Railway auto-detects Next.js and runs:
- **Build**: `npm run build`
- **Start**: `npm start`

## Pages

- `/` - Landing page with pricing
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard (protected)

## License

MIT
