// add to api/dashboard.ts
import { mockNotifications } from '../data/data';
import type { NotificationItem } from '../types/index';

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export async function fetchNotifications(): Promise<NotificationItem[]> {
  await wait();
  return [...mockNotifications];
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  await wait(150);
  const notif = mockNotifications.find((n) => n.id === id);
  if (!notif) throw new Error(`Notification ${id} not found`);
  notif.isRead = true;
  return notif;
}

export async function markAllNotificationsRead(): Promise<void> {
  await wait(150);
  mockNotifications.forEach((n) => (n.isRead = true));
}