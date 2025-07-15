# Eternalgy System Report

A comprehensive user interaction tracking system for your ERP built with Next.js, TypeScript, and SQLite.

## Features

- **User Interaction Tracking**: Track every user action in your ERP system
- **Real-time Dashboard**: Visualize user activity with interactive charts
- **Department Analytics**: Compare activity across different departments
- **User Productivity Metrics**: Track quotations, reports, and other key metrics
- **Feature Adoption Analysis**: Monitor which features are being used
- **Hourly Activity Patterns**: Understand peak usage times
- **REST API**: Easy integration with your existing ERP system

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <url>
cd eternalgy-system-report
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your API token:
```
API_TOKEN=your-secret-token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The SQLite database will be created automatically when you first run the application. The database file (`eternalgy-system.db`) will be created in the project root.

## API Endpoints

### Track User Interactions
```
POST /api/track
```

### Sync Users from ERP
```
POST /api/sync-users
```

### Get Dashboard Data
```
GET /api/dashboard
```

See [API_HANDBOOK.md](API_HANDBOOK.md) for complete API documentation.

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `API_TOKEN`: Your secret API token
4. Deploy!

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Integration with Bubble.io

1. Add the API Connector plugin to your Bubble.io app
2. Create API calls for tracking user interactions
3. Add API calls to your workflows

Example workflow:
- User clicks "Generate Proposal"
- Trigger API call to `/api/track` with:
  - `user_uid`: Current user's UID
  - `user_department`: Current user's department
  - `system_section`: "sales_system"
  - `system_function`: "generate_proposal"

## Dashboard Features

The dashboard provides:

1. **Overview Summary**: Total interactions, active users, departments
2. **Department Activity**: Compare activity levels across departments
3. **System Section Usage**: See which parts of your system are most used
4. **Hourly Activity**: Understand peak usage times
5. **Function Usage**: Track which specific functions are popular
6. **User Productivity**: Sales-focused metrics (quotations, reports)

## Project Structure

```
eternalgy-system-report/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── track/
│   │   │   ├── sync-users/
│   │   │   └── dashboard/
│   │   ├── dashboard/
│   │   └── page.tsx
│   ├── components/
│   │   └── charts/
│   └── lib/
│       └── database.ts
├── API_HANDBOOK.md
├── README.md
└── vercel.json
```

## Environment Variables

- `API_TOKEN`: Secret token for API authentication
- `DATABASE_URL`: Database connection string (optional for SQLite)

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For technical support or questions, please refer to the API handbook or contact your system administrator.

## License

This project is licensed under the MIT License.
