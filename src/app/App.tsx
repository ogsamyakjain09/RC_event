import { useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { EventProvider, useEvents } from '../context/EventContext';
import { AppDataProvider } from '../context/AppDataContext';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { ApprovalBoardPage } from '../pages/ApprovalBoardPage';
import { VendorBoardPage } from '../pages/VendorBoardPage';
import { BudgetPage } from '../pages/BudgetPage';
import { ContactsPage } from '../pages/ContactsPage';
import { ChatPage } from '../pages/ChatPage';
import { AlertsPage } from '../pages/AlertsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { Layout } from '../components/Layout';
import type { Event, Task } from '../types';
import { CreateEventPage } from '../pages/CreateEventPage';
import { CreateTaskPage } from '../pages/CreateTaskPage';
import { CreateVendorAssignmentPage } from '../pages/CreateVendorAssignmentPage';
import { CreateBudgetItemPage } from '../pages/CreateBudgetItemPage';
import { CreateApprovalPage } from '../pages/CreateApprovalPage';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const { activeEvent } = useEvents();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<string>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const currentEvent = activeEvent;

  const navigateTo = (page: string) => {
    setView(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setView(tab === 'dashboard' ? 'dashboard' : tab === 'alerts' ? 'alerts' : tab === 'contacts' ? 'contacts' : tab === 'chat' ? 'chat' : tab === 'settings' ? 'settings' : tab);
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView('task-detail');
  };

  const handleEventSelect = (event: Event) => {
    setView('event-details');
  };
  const handleCreateEvent = () => setView('create-event');
  const handleCreateTask = () => setView('create-task');
  const handleCreateVendor = () => setView('create-vendor');
  const handleCreateBudget = () => setView('create-budget');
  const handleCreateApproval = () => setView('create-approval');
  const alertBadge = 3;

  const getPageTitle = () => {
    switch (view) {
      case 'dashboard': return { title: 'RC Events', subtitle: 'Event Operations Dashboard' };
      case 'event-details': return { title: currentEvent?.event_name || 'Event Details', subtitle: 'Overview & Metrics' };
      case 'tasks': return { title: 'Tasks', subtitle: currentEvent ? `${currentEvent.event_name}` : '' };
      case 'task-detail': return { title: selectedTask?.title || 'Task Details', subtitle: '' };
      case 'approvals': return { title: 'Approvals', subtitle: currentEvent ? `${currentEvent.event_name}` : '' };
      case 'vendors': return { title: 'Vendors', subtitle: currentEvent ? `${currentEvent.event_name}` : '' };
      case 'budget': return { title: 'Budget', subtitle: currentEvent ? `${currentEvent.event_name}` : '' };
      case 'create-event': return { title: 'Create Event', subtitle: 'Add new wedding event' };
      case 'create-task': return { title: 'Create Task', subtitle: 'Add new task' };
      case 'create-vendor': return { title: 'Add Vendor', subtitle: 'Assign vendor to event' };
      case 'create-budget': return { title: 'Add Budget Item', subtitle: 'Track event expenses' };
      case 'create-approval': return { title: 'Create Approval', subtitle: 'Request approval' };
      case 'chat': return { title: 'AI Chat', subtitle: 'Event Operations Copilot' };
      case 'contacts': return { title: 'Contacts', subtitle: 'Event Contacts & Vendors' };
      case 'alerts': return { title: 'Alerts', subtitle: 'Notifications & Risks' };
      case 'settings': return { title: 'Settings', subtitle: 'Profile & Preferences' };
      default: return { title: 'RC Events', subtitle: '' };
    }
  };

  const pageTitle = getPageTitle();
  const showBack = !['dashboard', 'chat', 'contacts', 'alerts', 'settings'].includes(view);
  

  const handleBack = () => {
    if (view === 'event-details' || view === 'task-detail') {
      setView(view === 'event-details' ? 'dashboard' : 'tasks');
      setSelectedTask(null);
    } else {
      setView('dashboard');
    }
  };

  const renderContent = () => {
    const eventId = currentEvent?.id || '';

    switch (view) {
      case 'create-event':
         return <CreateEventPage onBack={() => setView('dashboard')} />;
         case 'create-task':
  return <CreateTaskPage eventId={eventId} onBack={() => setView('tasks')} />;
      case 'dashboard':
        return <DashboardPage onSelectEvent={handleEventSelect} onCreateEvent={handleCreateEvent} />;
      case 'event-details':
        return currentEvent ? (
          <EventDetailsPage event={currentEvent} onNavigate={navigateTo} onBack={handleBack} />
        ) : (
          <DashboardPage onSelectEvent={handleEventSelect} />
        );
      case 'tasks':
        case 'tasks':
  return <TaskListPage eventId={eventId} onTaskClick={handleTaskClick} onCreateTask={handleCreateTask} />;
      case 'task-detail':
        return selectedTask ? (
          <TaskDetailPage task={selectedTask} onBack={handleBack} />
        ) : (
          <TaskListPage eventId={eventId} onTaskClick={handleTaskClick} />
        );
      case 'approvals':
  return <ApprovalBoardPage eventId={eventId} onCreateApproval={handleCreateApproval} />;
case 'create-approval':
  return <CreateApprovalPage eventId={eventId} onBack={() => setView('approvals')} />;
      case 'vendors':
  return <VendorBoardPage eventId={eventId} onAddVendor={handleCreateVendor} />;
case 'create-vendor':
  return <CreateVendorAssignmentPage eventId={eventId} onBack={() => setView('vendors')} />;
      case 'budget':
  return <BudgetPage eventId={eventId} onAddBudget={handleCreateBudget} />;
case 'create-budget':
  return <CreateBudgetItemPage eventId={eventId} onBack={() => setView('budget')} />;
      case 'chat':
        return <ChatPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onSelectEvent={handleEventSelect} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      alertBadge={alertBadge}
      title={pageTitle.title}
      subtitle={pageTitle.subtitle}
      onBack={showBack ? handleBack : undefined}
    >
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppDataProvider>
          <MainApp />
        </AppDataProvider>
      </EventProvider>
    </AuthProvider>
  );
}
