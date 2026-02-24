# BloodLink

**Live Demo:** [https://blood-link-chi.vercel.app](https://blood-link-chi.vercel.app)

BloodLink is a comprehensive hospital blood bank management system. It provides real-time inventory tracking, smart alerts for low stock and expiring units, and seamless inter-hospital blood sharing capabilities.

## Features

- **Real-time Inventory Tracking**: Monitor blood unit levels across different blood groups and statuses (Safe, Warning, Critical, Expired).
- **Smart Alerts**: Get notified about expiring units, critical shortages, and pending requests.
- **Inter-Hospital Sharing**: Manage, request, and transfer blood units between peer hospitals.
- **AI Forecasting**: Predictive analytics for estimating future blood bank supply and demand.
- **Reporting & Compliance**: Generate detailed reports on usage, wastage, and inter-hospital transfers.

## Tech Stack

- **Frontend Framework**: React 18, Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS, Radix UI Primitives, Material UI Icons
- **Data Visualization**: Recharts
- **Forms**: React Hook Form

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Run `npm install` to install the dependencies.
3. Run `npm run dev` to start the local development server.

### Building for Production
To create a production build, run:
```bash
npm run build
```

## License
This project utilizes several open-source libraries. Components from `shadcn/ui` are used under the MIT license.