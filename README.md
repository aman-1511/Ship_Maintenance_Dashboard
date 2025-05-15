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
1. Login Page
   ![1]( https://github.com/user-attachments/assets/9e1b952b-5a2a-4df3-a63b-5d4bece64d54)

2. Login Page (Inspector) ![2](https://github.com/user-attachments/assets/a5f10a78-c97e-4c8c-81ee-d6a924b3ed2d)
3.Dashboard
![3](https://github.com/user-attachments/assets/7433c690-93bd-48d7-8d7b-e0f7406ebd6e)



## Technical Decisions

1. **State Management**: Redux Toolkit was chosen for its simplicity and built-in best practices
2. **UI Framework**: Material-UI for consistent design and responsive components
3. **Data Visualization**: Recharts for lightweight and customizable charts
4. **Routing**: React Router for declarative routing
5. **Date Handling**: date-fns for consistent date manipulation


