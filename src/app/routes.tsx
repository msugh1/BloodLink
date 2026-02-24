import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { BloodUnitDetailPage } from './pages/BloodUnitDetailPage';
import { AddUnitPage } from './pages/AddUnitPage';
import { SharingPage } from './pages/SharingPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ForecastPage } from './pages/ForecastPage';

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignUpPage },


  {
    Component: Layout,
    children: [
      { path: '/dashboard', Component: DashboardPage },
      { path: '/inventory', Component: InventoryPage },
      { path: '/inventory/:id', Component: BloodUnitDetailPage },
      { path: '/add-unit', Component: AddUnitPage },
      { path: '/sharing', Component: SharingPage },
      { path: '/alerts', Component: AlertsPage },
      { path: '/forecast', Component: ForecastPage },
      { path: '/reports', Component: ReportsPage },
      { path: '/settings', Component: SettingsPage },
    ],
  },
]);