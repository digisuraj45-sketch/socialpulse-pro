import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Public views
import { LandingView } from './views/public/LandingView';
import { PublicServicesView } from './views/public/PublicServicesView';
import { PublicApiDocsView } from './views/public/PublicApiDocsView';
import { PublicBlogView } from './views/public/PublicBlogView';
import { PublicContactView } from './views/public/PublicContactView';
import { PublicTermsView } from './views/public/PublicTermsView';

// Auth views
import { LoginView } from './views/auth/LoginView';
import { RegisterView } from './views/auth/RegisterView';

// User views & Layout
import { UserLayout } from './views/user/UserLayout';
import { UserDashboardView } from './views/user/UserDashboardView';
import { UserNewOrderView } from './views/user/UserNewOrderView';
import { UserOrdersView } from './views/user/UserOrdersView';
import { UserRefillsView } from './views/user/UserRefillsView';
import { UserAddFundsView } from './views/user/UserAddFundsView';
import { UserTransactionsView } from './views/user/UserTransactionsView';
import { UserApiKeysView } from './views/user/UserApiKeysView';
import { UserReferralsView } from './views/user/UserReferralsView';
import { UserSupportView } from './views/user/UserSupportView';
import { UserKycView } from './views/user/UserKycView';
import { UserSecurityView } from './views/user/UserSecurityView';
import { UserProfileView } from './views/user/UserProfileView';

// Admin views & Layout
import { AdminLayout } from './views/admin/AdminLayout';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminDepositsView } from './views/admin/AdminDepositsView';
import { AdminOrdersView } from './views/admin/AdminOrdersView';
import { AdminServicesView } from './views/admin/AdminServicesView';
import { AdminProvidersView } from './views/admin/AdminProvidersView';
import { AdminUsersView } from './views/admin/AdminUsersView';
import { AdminCronQueueView } from './views/admin/AdminCronQueueView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';

const AppContent: React.FC = () => {
  const { activeView, currentUser } = useApp();

  // Route router logic
  const renderView = () => {
    switch (activeView) {
      // Public views
      case 'home':
        return (
          <>
            <LandingView />
            <Footer />
          </>
        );
      case 'services':
        return (
          <>
            <PublicServicesView />
            <Footer />
          </>
        );
      case 'api-docs':
        return (
          <>
            <PublicApiDocsView />
            <Footer />
          </>
        );
      case 'blog':
        return (
          <>
            <PublicBlogView />
            <Footer />
          </>
        );
      case 'contact':
        return (
          <>
            <PublicContactView />
            <Footer />
          </>
        );
      case 'terms':
        return (
          <>
            <PublicTermsView />
            <Footer />
          </>
        );

      // Auth views
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;

      // Customer Portal views
      case 'dashboard':
        return <UserLayout><UserDashboardView /></UserLayout>;
      case 'new-order':
        return <UserLayout><UserNewOrderView /></UserLayout>;
      case 'user-services':
        return <UserLayout><PublicServicesView /></UserLayout>;
      case 'orders':
        return <UserLayout><UserOrdersView /></UserLayout>;
      case 'refills':
        return <UserLayout><UserRefillsView /></UserLayout>;
      case 'add-funds':
        return <UserLayout><UserAddFundsView /></UserLayout>;
      case 'transactions':
        return <UserLayout><UserTransactionsView /></UserLayout>;
      case 'api-keys':
        return <UserLayout><UserApiKeysView /></UserLayout>;
      case 'referrals':
        return <UserLayout><UserReferralsView /></UserLayout>;
      case 'support':
        return <UserLayout><UserSupportView /></UserLayout>;
      case 'kyc':
        return <UserLayout><UserKycView /></UserLayout>;
      case 'security':
        return <UserLayout><UserSecurityView /></UserLayout>;
      case 'profile':
        return <UserLayout><UserProfileView /></UserLayout>;

      // Admin Portal views
      case 'admin-dashboard':
        return <AdminLayout><AdminDashboardView /></AdminLayout>;
      case 'admin-deposits':
        return <AdminLayout><AdminDepositsView /></AdminLayout>;
      case 'admin-orders':
        return <AdminLayout><AdminOrdersView /></AdminLayout>;
      case 'admin-services':
        return <AdminLayout><AdminServicesView /></AdminLayout>;
      case 'admin-providers':
        return <AdminLayout><AdminProvidersView /></AdminLayout>;
      case 'admin-users':
        return <AdminLayout><AdminUsersView /></AdminLayout>;
      case 'admin-cron':
        return <AdminLayout><AdminCronQueueView /></AdminLayout>;
      case 'admin-settings':
        return <AdminLayout><AdminSettingsView /></AdminLayout>;

      default:
        return (
          <>
            <LandingView />
            <Footer />
          </>
        );
    }
  };

  // Hide top public navbar on standalone auth views
  const isAuthPage = activeView === 'login' || activeView === 'register';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {!isAuthPage && <Navbar />}
      <div className="flex-1">
        {renderView()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
