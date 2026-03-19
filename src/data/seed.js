// ── Buildings ────────────────────────────────────────────
export const BUILDINGS = [
  {
    id: 'b1',
    name: 'Fusion',
    spNumber: 'SP85842',
    address: '12-40 Bonar Street',
    suburb: 'Arncliffe',
    state: 'NSW',
    postcode: '2205',
    totalUnits: 48,
  },
  {
    id: 'b2',
    name: 'The Atrium',
    spNumber: 'SP91023',
    address: '5-15 Park Lane',
    suburb: 'Waterloo',
    state: 'NSW',
    postcode: '2017',
    totalUnits: 32,
  },
];

// ── Apartments ───────────────────────────────────────────
export const APARTMENTS = [
  { id: 'apt-101', buildingId: 'b1', unit: '101', floor: 1, bedrooms: 1, bathrooms: 1, parking: 'B1-01', status: 'tenanted', entitlement: 10 },
  { id: 'apt-102', buildingId: 'b1', unit: '102', floor: 1, bedrooms: 2, bathrooms: 2, parking: 'B1-02', status: 'tenanted', entitlement: 12 },
  { id: 'apt-103', buildingId: 'b1', unit: '103', floor: 1, bedrooms: 1, bathrooms: 1, parking: null,    status: 'owner-occupied', entitlement: 10 },
  { id: 'apt-201', buildingId: 'b1', unit: '201', floor: 2, bedrooms: 2, bathrooms: 2, parking: 'B1-03', status: 'tenanted', entitlement: 12 },
  { id: 'apt-202', buildingId: 'b1', unit: '202', floor: 2, bedrooms: 3, bathrooms: 2, parking: 'B1-04', status: 'tenanted', entitlement: 15 },
  { id: 'apt-203', buildingId: 'b1', unit: '203', floor: 2, bedrooms: 1, bathrooms: 1, parking: 'B1-05', status: 'vacant', entitlement: 10 },
  { id: 'apt-301', buildingId: 'b1', unit: '301', floor: 3, bedrooms: 2, bathrooms: 2, parking: 'B1-06', status: 'tenanted', entitlement: 12 },
  { id: 'apt-302', buildingId: 'b1', unit: '302', floor: 3, bedrooms: 3, bathrooms: 2, parking: 'B1-07', status: 'owner-occupied', entitlement: 15 },
  { id: 'apt-401', buildingId: 'b1', unit: '401', floor: 4, bedrooms: 2, bathrooms: 2, parking: 'B1-08', status: 'tenanted', entitlement: 12 },
  { id: 'apt-402', buildingId: 'b1', unit: '402', floor: 4, bedrooms: 1, bathrooms: 1, parking: null,    status: 'tenanted', entitlement: 10 },
];

// ── Real Estate Agents ───────────────────────────────────
export const AGENTS = [
  { id: 'ag-1', buildingId: 'b1', agencyName: 'Ray White Arncliffe', agentName: 'Sarah Mitchell', phone: '02 9567 8900', email: 'smitchell@raywhite.com', unitsManaged: ['apt-101','apt-201','apt-401'] },
  { id: 'ag-2', buildingId: 'b1', agencyName: 'McGrath St George',   agentName: 'David Nguyen',   phone: '02 9588 4100', email: 'dnguyen@mcgrath.com.au', unitsManaged: ['apt-102','apt-202','apt-301'] },
  { id: 'ag-3', buildingId: 'b1', agencyName: 'LJ Hooker Rockdale',  agentName: 'Emma Patel',     phone: '02 9597 3300', email: 'epatel@ljhooker.com.au', unitsManaged: ['apt-402'] },
];

// ── Owners ───────────────────────────────────────────────
export const OWNERS = [
  { id: 'own-1', buildingId: 'b1', apartmentId: 'apt-101', firstName: 'James',   lastName: 'Hartley',   phone: '0412 345 678', email: 'jhartley@gmail.com',       address: '1/22 Beach Rd, Brighton-Le-Sands NSW 2216', type: 'investment',      agentId: 'ag-1' },
  { id: 'own-2', buildingId: 'b1', apartmentId: 'apt-102', firstName: 'Mei',     lastName: 'Chen',      phone: '0421 890 123', email: 'mei.chen@outlook.com',     address: '45 King St, Sydney NSW 2000',              type: 'investment',      agentId: 'ag-2' },
  { id: 'own-3', buildingId: 'b1', apartmentId: 'apt-103', firstName: 'Robert',  lastName: 'Okafor',    phone: '0433 567 890', email: 'rokafor@hotmail.com',      address: '103/12-40 Bonar St, Arncliffe NSW 2205',   type: 'owner-occupied',  agentId: null   },
  { id: 'own-4', buildingId: 'b1', apartmentId: 'apt-201', firstName: 'Lisa',    lastName: 'Tremblay',  phone: '0445 234 567', email: 'lisa.t@icloud.com',        address: '8 Rose Ave, Kogarah NSW 2217',             type: 'investment',      agentId: 'ag-1' },
  { id: 'own-5', buildingId: 'b1', apartmentId: 'apt-202', firstName: 'Tony',    lastName: 'Ricci',     phone: '0418 901 234', email: 'tony.ricci@gmail.com',     address: '22 Elm St, Hurstville NSW 2220',           type: 'investment',      agentId: 'ag-2' },
  { id: 'own-6', buildingId: 'b1', apartmentId: 'apt-203', firstName: 'Angela',  lastName: 'Svensson',  phone: '0427 678 901', email: 'a.svensson@yahoo.com.au',  address: '3/50 Park St, Sydney NSW 2000',            type: 'investment',      agentId: null   },
  { id: 'own-7', buildingId: 'b1', apartmentId: 'apt-301', firstName: 'Kevin',   lastName: 'Murphy',    phone: '0438 345 678', email: 'kmurphy@gmail.com',        address: '15 Church Rd, Kogarah NSW 2217',           type: 'investment',      agentId: 'ag-2' },
  { id: 'own-8', buildingId: 'b1', apartmentId: 'apt-302', firstName: 'Priya',   lastName: 'Sharma',    phone: '0455 012 345', email: 'priya.sharma@gmail.com',   address: '302/12-40 Bonar St, Arncliffe NSW 2205',   type: 'owner-occupied',  agentId: null   },
  { id: 'own-9', buildingId: 'b1', apartmentId: 'apt-401', firstName: 'Nathan',  lastName: 'Brooks',    phone: '0461 789 012', email: 'nbrooks@outlook.com',      address: '77 Ocean St, Kogarah NSW 2217',            type: 'investment',      agentId: 'ag-1' },
  { id: 'own-10',buildingId: 'b1', apartmentId: 'apt-402', firstName: 'Sophie',  lastName: 'Lambert',   phone: '0474 456 789', email: 'slambert@icloud.com',      address: '2/88 Forest Rd, Hurstville NSW 2220',      type: 'investment',      agentId: 'ag-3' },
];

// ── Tenants ───────────────────────────────────────────────
export const TENANTS = [
  { id: 'ten-1', buildingId: 'b1', apartmentId: 'apt-101', firstName: 'Aiden',   lastName: 'Walsh',      phone: '0481 234 567', email: 'aiden.walsh@gmail.com',    leaseStart: '2023-06-01', leaseEnd: '2025-05-31', rent: 2100, emergencyContact: 'Mary Walsh 0400 111 222', pets: false, moveInDate: '2023-06-01' },
  { id: 'ten-2', buildingId: 'b1', apartmentId: 'apt-102', firstName: 'Chloe',   lastName: 'Dubois',     phone: '0492 345 678', email: 'chloe.d@hotmail.com',      leaseStart: '2024-01-15', leaseEnd: '2025-01-14', rent: 2800, emergencyContact: 'Paul Dubois 0400 222 333', pets: true, moveInDate: '2024-01-15' },
  { id: 'ten-3', buildingId: 'b1', apartmentId: 'apt-201', firstName: 'Marcus',  lastName: 'Williams',   phone: '0403 456 789', email: 'marcus.w@yahoo.com',       leaseStart: '2023-09-01', leaseEnd: '2025-08-31', rent: 2750, emergencyContact: 'Diane Williams 0400 333 444', pets: false, moveInDate: '2023-09-01' },
  { id: 'ten-4', buildingId: 'b1', apartmentId: 'apt-202', firstName: 'Yuki',    lastName: 'Tanaka',     phone: '0415 567 890', email: 'yuki.tanaka@gmail.com',    leaseStart: '2024-03-01', leaseEnd: '2026-02-28', rent: 3400, emergencyContact: 'Kenji Tanaka 0400 444 555', pets: true, moveInDate: '2024-03-01' },
  { id: 'ten-5', buildingId: 'b1', apartmentId: 'apt-301', firstName: 'Isabelle',lastName: 'Moreau',     phone: '0426 678 901', email: 'imoreau@outlook.com',      leaseStart: '2023-11-15', leaseEnd: '2025-11-14', rent: 2900, emergencyContact: 'Claude Moreau 0400 555 666', pets: false, moveInDate: '2023-11-15' },
  { id: 'ten-6', buildingId: 'b1', apartmentId: 'apt-401', firstName: 'Daniel',  lastName: 'Kim',        phone: '0437 789 012', email: 'd.kim@gmail.com',          leaseStart: '2024-05-01', leaseEnd: '2025-04-30', rent: 2850, emergencyContact: 'Susan Kim 0400 666 777', pets: false, moveInDate: '2024-05-01' },
  { id: 'ten-7', buildingId: 'b1', apartmentId: 'apt-402', firstName: 'Fatima',  lastName: 'Al-Hassan',  phone: '0448 890 123', email: 'f.alhassan@icloud.com',    leaseStart: '2023-08-01', leaseEnd: '2025-07-31', rent: 2050, emergencyContact: 'Omar Al-Hassan 0400 777 888', pets: false, moveInDate: '2023-08-01' },
];

// ── Helper: get display name ─────────────────────────────
export const fullName = (p) => `${p.firstName} ${p.lastName}`;

export const initials = (p) =>
  `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase();

export const aptStatusLabel = (s) => ({
  'tenanted':       'Tenanted',
  'owner-occupied': 'Owner-occupied',
  'vacant':         'Vacant',
}[s] ?? s);

export const aptStatusBadge = (s) => ({
  'tenanted':       'badge-green',
  'owner-occupied': 'badge-blue',
  'vacant':         'badge-amber',
}[s] ?? 'badge-gray');
