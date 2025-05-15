# Ship Maintenance Dashboard

A comprehensive dashboard for managing ship maintenance operations, built with React and Material-UI.

<h3>🚀 Live Demo</h3>
<a href="https://ship-maintenance-dashboard-mauve.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/View_App-Click_Here-blue?style=for-the-badge" alt="Live Demo" />
</a>

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

2. Login Page (Inspector) ![2](https://github.com/user-attachments/assets/48f1d33b-748f-4e87-9c35-ef8494fd4a9b)
3.Login Page
![3](https://github.com/user-attachments/assets/e7a65a80-95ee-4d8d-ae7c-b03578df5e4f)
![Image 1](https://github.com/user-attachments/assets/0c7c8ecd-e9ed-4b27-8847-1fcce009cdc6)
![Image 2](https://github.com/user-attachments/assets/6095a48e-2e99-48fd-a5dd-9ecfad0d386b)
![Image 3](https://github.com/user-attachments/assets/2a56a81e-9b5b-450c-8401-7f60e4821bef)
![Image 4](https://github.com/user-attachments/assets/e10d2998-494b-49ef-b5d9-f54ef264a8a6)
![Image 5](https://github.com/user-attachments/assets/e8536aa4-9dbb-4c76-86ac-2970a9ad6213)
![Image 6](https://github.com/user-attachments/assets/512ae8a6-84cf-48be-803d-d51c816966aa)
![Image 7](https://github.com/user-attachments/assets/919db93e-5018-42e9-871e-67902bc96a20)
![Image 8](https://github.com/user-attachments/assets/bcc97747-19f9-4b94-a615-f464542410dc)
![Image 9](https://github.com/user-attachments/assets/0d5ae14b-4a3f-456c-9ef8-68baf3b0e5c2)
![Image 10](https://github.com/user-attachments/assets/eff35b33-36a5-408d-9e2d-b13d88243442)
![Image 11](https://github.com/user-attachments/assets/3701df27-451c-4ca6-afb8-b2d29c968117)

## Features and Stack

1. **State Management**: Redux Toolkit was chosen for its simplicity and built-in best practices
2. **UI Framework**: Material-UI for consistent design and responsive components
3. **Data Visualization**: Recharts for lightweight and customizable charts
4. **Routing**: React Router for declarative routing
5. **Date Handling**: date-fns for consistent date manipulation


