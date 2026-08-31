import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogProcessing from './pages/LogProcessing';
import Events from './pages/Events';
import ParserRegistry from './pages/ParserRegistry';
import EventDetailsDrawer from './components/EventDetailsDrawer';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const handleQuickDemo = () => {
    setCurrentPath('/processing');
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case '/':
        return 'Executive Dashboard';
      case '/processing':
        return 'Log Pre-processing Engine';
      case '/events':
        return 'Normalized Events Search';
      case '/parsers':
        return 'Parser Engine Registry';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Layout
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      pageTitle={getPageTitle()}
      onQuickDemo={handleQuickDemo}
    >
      {currentPath === '/' && (
        <Dashboard
          onNavigate={setCurrentPath}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {currentPath === '/processing' && (
        <LogProcessing
          onSelectEvent={handleSelectEvent}
        />
      )}

      {currentPath === '/events' && (
        <Events
          onSelectEvent={handleSelectEvent}
        />
      )}

      {currentPath === '/parsers' && (
        <ParserRegistry />
      )}

      {/* Slide-out Event Detail Drawer */}
      <EventDetailsDrawer
        event={selectedEvent}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Layout>
  );
}
