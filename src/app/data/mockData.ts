export type BloodStatus = 'safe' | 'warning' | 'critical' | 'expired';
export type AlertType = 'low_stock' | 'expiring_soon' | 'critical' | 'expired' | 'info';

export interface BloodUnit {
  id: string;
  type: string;
  quantity: number;
  donorId: string;
  receivedDate: string;
  expiryDate: string;
  status: BloodStatus;
  location: string;
  issuedTo?: string;
  notes?: string;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  bloodType?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  distance: string;
  contact: string;
  availableUnits: SharedUnit[];
}

export interface SharedUnit {
  type: string;
  quantity: number;
  expiryDate: string;
  status: BloodStatus;
}

export interface ActivityItem {
  id: number;
  action: string;
  bloodType: string;
  quantity: number;
  recipient: string;
  time: string;
  date: string;
}

// Today: Feb 20, 2026
export const bloodInventory: BloodUnit[] = [
  {
    id: 'BU-001', type: 'A+', quantity: 15, donorId: 'D-1234',
    receivedDate: '2026-01-15', expiryDate: '2026-03-15', status: 'safe',
    location: 'Blood Bank Main',
  },
  {
    id: 'BU-002', type: 'A-', quantity: 4, donorId: 'D-2345',
    receivedDate: '2026-01-20', expiryDate: '2026-02-25', status: 'warning',
    location: 'Blood Bank Main', notes: 'Monitor closely – 5 days to expiry',
  },
  {
    id: 'BU-003', type: 'B+', quantity: 8, donorId: 'D-3456',
    receivedDate: '2026-02-01', expiryDate: '2026-04-01', status: 'safe',
    location: 'Ward B',
  },
  {
    id: 'BU-004', type: 'B-', quantity: 2, donorId: 'D-4567',
    receivedDate: '2026-01-28', expiryDate: '2026-02-21', status: 'critical',
    location: 'Emergency Ward', notes: 'URGENT: Expires tomorrow',
  },
  {
    id: 'BU-005', type: 'O+', quantity: 20, donorId: 'D-5678',
    receivedDate: '2026-02-10', expiryDate: '2026-04-10', status: 'safe',
    location: 'Blood Bank Main',
  },
  {
    id: 'BU-006', type: 'O-', quantity: 3, donorId: 'D-6789',
    receivedDate: '2026-01-18', expiryDate: '2026-02-22', status: 'critical',
    location: 'ICU', notes: 'Consider transferring to LUTH',
  },
  {
    id: 'BU-007', type: 'AB+', quantity: 6, donorId: 'D-7890',
    receivedDate: '2026-02-05', expiryDate: '2026-04-05', status: 'safe',
    location: 'Blood Bank Main',
  },
  {
    id: 'BU-008', type: 'AB-', quantity: 1, donorId: 'D-8901',
    receivedDate: '2026-01-12', expiryDate: '2026-02-18', status: 'expired',
    location: 'Blood Bank Main', notes: 'Awaiting disposal',
  },
];

export const bloodTypeSummary = [
  { type: 'A+', total: 15, status: 'safe' as BloodStatus },
  { type: 'A-', total: 4, status: 'warning' as BloodStatus },
  { type: 'B+', total: 8, status: 'safe' as BloodStatus },
  { type: 'B-', total: 2, status: 'critical' as BloodStatus },
  { type: 'O+', total: 20, status: 'safe' as BloodStatus },
  { type: 'O-', total: 3, status: 'critical' as BloodStatus },
  { type: 'AB+', total: 6, status: 'safe' as BloodStatus },
  { type: 'AB-', total: 1, status: 'expired' as BloodStatus },
];

export const alertsData: AlertItem[] = [
  {
    id: 'AL-001', type: 'critical',
    title: 'Critical: B- Expiring Tomorrow',
    message: 'Unit BU-004 (B−, 2 bags) expires on Feb 21, 2026. Immediate action required.',
    timestamp: '2026-02-20T08:00:00', read: false, bloodType: 'B-',
  },
  {
    id: 'AL-002', type: 'critical',
    title: 'Critical: O- Expiring in 2 Days',
    message: 'Unit BU-006 (O−, 3 bags) expires on Feb 22, 2026. Consider issuing or transferring.',
    timestamp: '2026-02-20T08:05:00', read: false, bloodType: 'O-',
  },
  {
    id: 'AL-003', type: 'expired',
    title: 'Expired: AB- Unit Needs Disposal',
    message: 'Unit BU-008 (AB−, 1 bag) expired on Feb 18, 2026. Please remove from inventory.',
    timestamp: '2026-02-20T07:00:00', read: false, bloodType: 'AB-',
  },
  {
    id: 'AL-004', type: 'expiring_soon',
    title: 'A- Expiring in 5 Days',
    message: 'Unit BU-002 (A−, 4 bags) expires on Feb 25, 2026. Plan for issuance or transfer.',
    timestamp: '2026-02-19T09:00:00', read: true, bloodType: 'A-',
  },
  {
    id: 'AL-005', type: 'low_stock',
    title: 'Low Stock: AB- Blood Type',
    message: 'AB− is critically low (1 unit remaining). Minimum threshold is 3 units.',
    timestamp: '2026-02-19T14:00:00', read: false, bloodType: 'AB-',
  },
  {
    id: 'AL-006', type: 'low_stock',
    title: 'Low Stock: B- Blood Type',
    message: 'B− is low (2 units remaining). Minimum threshold is 5 units.',
    timestamp: '2026-02-18T10:00:00', read: true, bloodType: 'B-',
  },
  {
    id: 'AL-007', type: 'info',
    title: 'Inventory Sync Completed',
    message: 'Blood inventory successfully synced with Lagos State Health Portal at 06:00 AM.',
    timestamp: '2026-02-20T06:00:00', read: true,
  },
];

export const hospitalsData: Hospital[] = [
  {
    id: 'H-001',
    name: 'Lagos University Teaching Hospital',
    location: 'Idi-Araba, Lagos',
    distance: '3.2 km',
    contact: '+234 801 234 5678',
    availableUnits: [
      { type: 'B-', quantity: 5, expiryDate: '2026-03-20', status: 'safe' },
      { type: 'AB-', quantity: 3, expiryDate: '2026-03-15', status: 'safe' },
      { type: 'O-', quantity: 8, expiryDate: '2026-04-01', status: 'safe' },
    ],
  },
  {
    id: 'H-002',
    name: 'National Orthopedic Hospital',
    location: 'Igbobi, Lagos',
    distance: '5.7 km',
    contact: '+234 802 345 6789',
    availableUnits: [
      { type: 'A-', quantity: 6, expiryDate: '2026-03-10', status: 'safe' },
      { type: 'B-', quantity: 4, expiryDate: '2026-02-28', status: 'warning' },
    ],
  },
  {
    id: 'H-003',
    name: 'Gbagada General Hospital',
    location: 'Gbagada, Lagos',
    distance: '8.1 km',
    contact: '+234 803 456 7890',
    availableUnits: [
      { type: 'AB+', quantity: 10, expiryDate: '2026-04-20', status: 'safe' },
      { type: 'O+', quantity: 15, expiryDate: '2026-04-15', status: 'safe' },
      { type: 'O-', quantity: 4, expiryDate: '2026-02-26', status: 'warning' },
    ],
  },
  {
    id: 'H-004',
    name: 'Isolo General Hospital',
    location: 'Isolo, Lagos',
    distance: '12.4 km',
    contact: '+234 804 567 8901',
    availableUnits: [
      { type: 'A+', quantity: 8, expiryDate: '2026-03-28', status: 'safe' },
      { type: 'B+', quantity: 12, expiryDate: '2026-04-08', status: 'safe' },
    ],
  },
];

export const usageData = [
  { month: 'Sep', used: 45, wasted: 3, received: 60 },
  { month: 'Oct', used: 52, wasted: 5, received: 65 },
  { month: 'Nov', used: 48, wasted: 2, received: 55 },
  { month: 'Dec', used: 61, wasted: 7, received: 70 },
  { month: 'Jan', used: 55, wasted: 4, received: 68 },
  { month: 'Feb', used: 38, wasted: 2, received: 42 },
];

export const bloodTypeUsage = [
  { type: 'A+', used: 18, available: 15 },
  { type: 'A-', used: 12, available: 4 },
  { type: 'B+', used: 22, available: 8 },
  { type: 'B-', used: 8, available: 2 },
  { type: 'O+', used: 35, available: 20 },
  { type: 'O-', used: 15, available: 3 },
  { type: 'AB+', used: 10, available: 6 },
  { type: 'AB-', used: 4, available: 1 },
];

export const recentActivity: ActivityItem[] = [
  { id: 1, action: 'Issued', bloodType: 'O+', quantity: 2, recipient: 'Emergency Ward', time: '09:30 AM', date: 'Today' },
  { id: 2, action: 'Received', bloodType: 'A+', quantity: 5, recipient: 'From: LUTH', time: '08:00 AM', date: 'Today' },
  { id: 3, action: 'Transferred', bloodType: 'B-', quantity: 1, recipient: 'National Ortho', time: '04:45 PM', date: 'Yesterday' },
  { id: 4, action: 'Disposed', bloodType: 'AB-', quantity: 1, recipient: 'Reason: Expired', time: '02:00 PM', date: 'Yesterday' },
  { id: 5, action: 'Issued', bloodType: 'B+', quantity: 3, recipient: 'Surgery Ward', time: '11:15 AM', date: 'Yesterday' },
];

export const transferData = [
  { month: 'Sep', sent: 8, received: 12 },
  { month: 'Oct', sent: 10, received: 8 },
  { month: 'Nov', sent: 6, received: 15 },
  { month: 'Dec', sent: 12, received: 9 },
  { month: 'Jan', sent: 9, received: 11 },
  { month: 'Feb', sent: 5, received: 7 },
];

export const wastageData = [
  { month: 'Sep', expired: 2, contaminated: 1 },
  { month: 'Oct', expired: 4, contaminated: 1 },
  { month: 'Nov', expired: 1, contaminated: 1 },
  { month: 'Dec', expired: 5, contaminated: 2 },
  { month: 'Jan', expired: 3, contaminated: 1 },
  { month: 'Feb', expired: 1, contaminated: 1 },
];

// Utility functions
export function getStatusColors(status: BloodStatus) {
  const map = {
    safe: { bg: '#E8F5E9', text: '#2E7D32', border: '#4CAF50', dot: '#4CAF50', label: 'Safe' },
    warning: { bg: '#FFF8E1', text: '#F57F17', border: '#FFC107', dot: '#FFC107', label: 'Expiring Soon' },
    critical: { bg: '#FFEBEE', text: '#C62828', border: '#F44336', dot: '#F44336', label: 'Critical' },
    expired: { bg: '#F5F5F5', text: '#616161', border: '#9E9E9E', dot: '#9E9E9E', label: 'Expired' },
  };
  return map[status] ?? map.expired;
}

export function getDaysToExpiry(expiryDate: string): number {
  const today = new Date('2026-02-20');
  const expiry = new Date(expiryDate);
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatExpiryLabel(expiryDate: string): string {
  const days = getDaysToExpiry(expiryDate);
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  return `${days} days left`;
}

export function getAlertTypeColors(type: AlertType) {
  const map = {
    critical: { bg: '#FFEBEE', text: '#C62828', border: '#F44336', icon: '#F44336' },
    expired: { bg: '#FAFAFA', text: '#424242', border: '#9E9E9E', icon: '#9E9E9E' },
    expiring_soon: { bg: '#FFF8E1', text: '#F57F17', border: '#FFC107', icon: '#FFC107' },
    low_stock: { bg: '#FFF3E0', text: '#E65100', border: '#FF9800', icon: '#FF9800' },
    info: { bg: '#E3F2FD', text: '#1565C0', border: '#2196F3', icon: '#2196F3' },
  };
  return map[type] ?? map.info;
}
