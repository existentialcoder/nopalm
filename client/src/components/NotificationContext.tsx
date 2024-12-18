import { createContext, useContext, ReactNode } from 'react';

import { notification } from 'antd';

// Define the type of notifications
type NotificationType = 'success' | 'info' | 'warning' | 'error';

// Define the shape of the context
interface NotificationContextType {
  notify: (message: string, description: string, type: NotificationType) => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | null>(null);

// Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  // Define the notify method
  const notify = (message: string, description: string, type: NotificationType) => {
    api[type]({
      message,
      description,
    });
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder} {/* Required for Ant Design's notification */}
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for accessing the context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
