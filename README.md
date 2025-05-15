# Ship Maintenance Dashboard

A comprehensive dashboard for managing ship maintenance operations, built with React and Material-UI.

## Features

- User Authentication (Simulated)
- Ships Management
- Ship Components Management
- Maintenance Jobs Management
- Maintenance Calendar
- Notification Center
- KPIs Dashboard
- Responsive Design

## Tech Stack

- React 18
- Material-UI
- Redux Toolkit for state management
- React Router for navigation
- LocalStorage for data persistence
- Recharts for data visualization

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── features/          # Feature-specific components and logic
├── layouts/           # Layout components
├── pages/            # Page components
├── services/         # Data and utility services
├── store/            # Redux store configuration
└── utils/            # Helper functions and constants
```

## Authentication

The application uses simulated authentication with the following test accounts:

- Admin: admin@entnt.in / admin123
- Inspector: inspector@entnt.in / inspect123
- Engineer: engineer@entnt.in / engine123

## Data Persistence

All data is persisted using localStorage. The following data structures are maintained:

- Users and authentication state
- Ships and their details
- Components and their maintenance history
- Maintenance jobs and schedules
- Notifications

## Known Limitations

- No real backend integration
- Data is stored locally in the browser

##Preview of the Website 
https://github.com/aman-1511/Ship_Maintenance_Dashboard/issues/1


## Technical Decisions

1. **State Management**: Redux Toolkit was chosen for its simplicity and built-in best practices
2. **UI Framework**: Material-UI for consistent design and responsive components
3. **Data Visualization**: Recharts for lightweight and customizable charts
4. **Routing**: React Router for declarative routing
5. **Date Handling**: date-fns for consistent date manipulation


