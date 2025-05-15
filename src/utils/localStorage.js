
const mockUsers = [
  {
    id: 'u1',
    email: 'admin@entnt.in',
    password: 'admin123',
    role: 'Admin',
    name: 'Admin User',
  },
  {
    id: 'u2',
    email: 'inspector@entnt.in',
    password: 'inspect123',
    role: 'Inspector',
    name: 'Inspector User',
  },
  {
    id: 'u3',
    email: 'engineer@entnt.in',
    password: 'engine123',
    role: 'Engineer',
    name: 'Engineer User',
  },
];


const mockShips = [
  {
    id: 's1',
    name: 'Evergreen',
    imoNumber: 'IMO1234567',
    flag: 'Panama',
    status: 'Active',
    components: [
      {
        id: 'c1',
        shipId: 's1',
        name: 'Main Engine',
        serialNumber: 'ENG-001',
        installationDate: '2023-01-01',
        lastMaintenanceDate: '2023-06-01',
        status: 'Active',
      },
      {
        id: 'c2',
        shipId: 's1',
        name: 'Generator',
        serialNumber: 'GEN-002',
        installationDate: '2023-02-01',
        lastMaintenanceDate: '2023-07-01',
        status: 'Active',
      },
    ],
    maintenanceHistory: [],
  },
  {
    id: 's2',
    name: 'Maersk Alabama',
    imoNumber: 'IMO7654321',
    flag: 'Liberia',
    status: 'Maintenance',
    components: [
      {
        id: 'c3',
        shipId: 's2',
        name: 'Auxiliary Pump',
        serialNumber: 'PUMP-003',
        installationDate: '2023-03-01',
        lastMaintenanceDate: '2023-08-01',
        status: 'Maintenance',
      }
    ],
    maintenanceHistory: [],
  },
  {
    id: 's3',
    name: 'Atlantic Explorer',
    imoNumber: 'IMO2468135',
    flag: 'Singapore',
    status: 'Active',
    components: [
      {
        id: 'c7',
        name: 'Auxiliary Engine',
        serialNumber: 'AUX-007',
        installationDate: '2022-12-01',
        lastMaintenanceDate: '2023-11-01',
        status: 'Active',
      },
      {
        id: 'c8',
        name: 'Ballast System',
        serialNumber: 'BAL-008',
        installationDate: '2023-01-20',
        lastMaintenanceDate: '2023-10-20',
        status: 'Maintenance',
      },
      {
        id: 'c9',
        name: 'Fire Suppression',
        serialNumber: 'FIRE-009',
        installationDate: '2023-02-15',
        lastMaintenanceDate: '2023-09-15',
        status: 'Active',
      },
    ],
    maintenanceHistory: [],
  },
];


const mockJobs = [
  {
    id: 'j1',
    shipId: 's1',
    componentId: 'c1',
    type: 'Routine Maintenance',
    priority: 'Medium',
    status: 'Scheduled',
    assignedTo: 'u3',
    scheduledDate: '2024-01-15',
    description: 'Regular maintenance check',
  },
  {
    id: 'j2',
    shipId: 's2',
    componentId: 'c3',
    type: 'Emergency Repair',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'u3',
    scheduledDate: '2023-12-15',
    description: 'Engine malfunction repair',
  },
];


export const initializeLocalStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('ships')) {
    localStorage.setItem('ships', JSON.stringify(mockShips));
  }
  if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify(mockJobs));
  }
};


export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find((user) => user.email === email);
};

export const setAuthUser = (user) => {
  localStorage.setItem('authUser', JSON.stringify(user));
};

export const getAuthUser = () => {
  const user = localStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
};

export const clearAuthUser = () => {
  localStorage.removeItem('authUser');
};


export const getShips = () => {
  const ships = localStorage.getItem('ships');
  return ships ? JSON.parse(ships) : [];
};

export const setShips = (ships) => {
  localStorage.setItem('ships', JSON.stringify(ships));
};

export const getShip = (id) => {
  const ships = getShips();
  return ships.find((ship) => ship.id === id);
};

export const addShip = (ship) => {
  const ships = getShips();
  ships.push(ship);
  localStorage.setItem('ships', JSON.stringify(ships));
};

export const updateShip = (updatedShip) => {
  const ships = getShips();
  const index = ships.findIndex((ship) => ship.id === updatedShip.id);
  if (index !== -1) {
    ships[index] = updatedShip;
    localStorage.setItem('ships', JSON.stringify(ships));
  }
};

export const deleteShip = (id) => {
  const ships = getShips();
  const updatedShips = ships.filter((ship) => ship.id !== id);
  localStorage.setItem('ships', JSON.stringify(updatedShips));
};

export const getComponents = (shipId) => {
  const ships = JSON.parse(localStorage.getItem('ships') || '[]');
  const ship = ships.find(s => s.id === shipId);
  return ship ? ship.components : [];
};

export const setComponents = (shipId, components) => {
  const ships = JSON.parse(localStorage.getItem('ships') || '[]');
  const shipIndex = ships.findIndex(s => s.id === shipId);
  if (shipIndex !== -1) {
    ships[shipIndex].components = components;
    localStorage.setItem('ships', JSON.stringify(ships));
  }
};

export const addComponent = (shipId, component) => {
  const ships = JSON.parse(localStorage.getItem('ships') || '[]');
  const shipIndex = ships.findIndex(s => s.id === shipId);
  if (shipIndex !== -1) {
    ships[shipIndex].components.push(component);
    localStorage.setItem('ships', JSON.stringify(ships));
  }
};

export const updateComponent = (shipId, component) => {
  const ships = JSON.parse(localStorage.getItem('ships') || '[]');
  const shipIndex = ships.findIndex(s => s.id === shipId);
  if (shipIndex !== -1) {
    const componentIndex = ships[shipIndex].components.findIndex(c => c.id === component.id);
    if (componentIndex !== -1) {
      ships[shipIndex].components[componentIndex] = component;
      localStorage.setItem('ships', JSON.stringify(ships));
    }
  }
};

export const deleteComponent = (shipId, componentId) => {
  const ships = JSON.parse(localStorage.getItem('ships') || '[]');
  const shipIndex = ships.findIndex(s => s.id === shipId);
  if (shipIndex !== -1) {
    ships[shipIndex].components = ships[shipIndex].components.filter(c => c.id !== componentId);
    localStorage.setItem('ships', JSON.stringify(ships));
  }
};


export const getMaintenanceHistory = (shipId) => {
  const ships = getShips();
  const ship = ships.find((s) => s.id === shipId);
  return ship ? ship.maintenanceHistory : [];
};

export const addMaintenanceRecord = (shipId, record) => {
  const ships = getShips();
  const shipIndex = ships.findIndex((ship) => ship.id === shipId);
  if (shipIndex !== -1) {
    ships[shipIndex].maintenanceHistory.push(record);
    localStorage.setItem('ships', JSON.stringify(ships));
  }
};

export const getJobs = () => {
  const jobs = localStorage.getItem('jobs');
  return jobs ? JSON.parse(jobs) : [];
};

export const setJobs = (jobs) => {
  localStorage.setItem('jobs', JSON.stringify(jobs));
};

export const getJob = (id) => {
  const jobs = getJobs();
  return jobs.find((job) => job.id === id);
};

export const addJob = (job) => {
  const jobs = getJobs();
  jobs.push(job);
  localStorage.setItem('jobs', JSON.stringify(jobs));
};

export const updateJob = (updatedJob) => {
  const jobs = getJobs();
  const index = jobs.findIndex((job) => job.id === updatedJob.id);
  if (index !== -1) {
    jobs[index] = updatedJob;
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }
};

export const deleteJob = (id) => {
  const jobs = getJobs();
  const updatedJobs = jobs.filter((job) => job.id !== id);
  localStorage.setItem('jobs', JSON.stringify(updatedJobs));
}; 