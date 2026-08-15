import { useState, useEffect, useCallback } from 'react';
import {
  NotificationPermissionState,
  isNotificationSupported,
  getNotificationPermissionState,
  requestNotificationPermission,
  sendDesktopNotification,
  DesktopNotificationOptions,
} from '../utils/notifications';

export interface UseNotificationReturn {
  /** Whether the current browser / environment supports the Notification API */
  isSupported: boolean;
  /** Current permission status ('granted' | 'denied' | 'default' | 'unsupported') */
  permission: NotificationPermissionState;
  /** Convenient boolean flag indicating if notifications are granted */
  isGranted: boolean;
  /** Prompts the user for desktop notification permissions safely */
  requestPermission: () => Promise<NotificationPermissionState>;
  /** Triggers a system-level desktop alert with optional body, icon, badge, tag, and click callback */
  sendNotification: (title: string, options?: DesktopNotificationOptions) => boolean;
  /** Quick trigger helper with title and body string */
  triggerAlert: (title: string, body?: string, options?: DesktopNotificationOptions) => boolean;
}

/**
 * Custom hook `useNotification` for managing the browser's Notification API.
 * Safely checks for support, handles permission requests, and triggers system-level desktop alerts.
 */
export const useNotification = (): UseNotificationReturn => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermissionState>('default');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = isNotificationSupported();
      setIsSupported(supported);
      if (supported) {
        setPermission(getNotificationPermissionState());
      } else {
        setPermission('unsupported');
      }
    }
  }, []);

  const handleRequestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (!isNotificationSupported()) {
      setPermission('unsupported');
      return 'unsupported';
    }

    try {
      const nextPermission = await requestNotificationPermission();
      setPermission(nextPermission);
      return nextPermission;
    } catch (err) {
      console.warn('[useNotification] Failed to request notification permission:', err);
      setPermission('denied');
      return 'denied';
    }
  }, []);

  const handleSendNotification = useCallback(
    (title: string, options?: DesktopNotificationOptions): boolean => {
      if (!isNotificationSupported()) {
        return false;
      }
      return sendDesktopNotification(title, options);
    },
    []
  );

  const handleTriggerAlert = useCallback(
    (title: string, body?: string, options?: DesktopNotificationOptions): boolean => {
      return handleSendNotification(title, {
        ...options,
        body: body ?? options?.body,
      });
    },
    [handleSendNotification]
  );

  return {
    isSupported,
    permission,
    isGranted: permission === 'granted',
    requestPermission: handleRequestPermission,
    sendNotification: handleSendNotification,
    triggerAlert: handleTriggerAlert,
  };
};

export default useNotification;
