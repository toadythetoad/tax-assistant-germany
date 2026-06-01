import { AppProvider, LanguageProvider, useApp } from './store/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Interview from './pages/Interview';
import PayslipUpload from './pages/PayslipUpload';
import Documents from './pages/Documents';
import Preview from './pages/Preview';
import Calculation from './pages/Calculation';
import Settings from './pages/Settings';
import Help from './pages/Help';

function Router() {
  const { app } = useApp();

  switch (app.page) {
    case 'welcome': return <Welcome />;
    case 'dashboard': return <Dashboard />;
    case 'profile': return <Profile />;
    case 'interview': return <Interview />;
    case 'payslipUpload': return <PayslipUpload />;
    case 'documents': return <Documents />;
    case 'preview': return <Preview />;
    case 'calculation': return <Calculation />;
    case 'settings': return <Settings />;
    case 'help': return <Help />;
    default: return <Welcome />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <Router />
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
