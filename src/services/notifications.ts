/**
 * Browser Notification Service
 * Handles permission requests and showing notifications for trade events
 */

export type NotificationPermission = 'granted' | 'denied' | 'default'

/**
 * Check if browser supports notifications
 */
export function supportsNotifications(): boolean {
  return 'Notification' in window
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!supportsNotifications()) return 'denied'
  return Notification.permission as NotificationPermission
}

/**
 * Request permission for notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!supportsNotifications()) return 'denied'

  try {
    const permission = await Notification.requestPermission()
    return permission as NotificationPermission
  } catch {
    return 'denied'
  }
}

/**
 * Show a browser notification
 */
export function showNotification(
  title: string,
  options?: NotificationOptions & { onClick?: () => void }
): void {
  if (!supportsNotifications() || Notification.permission !== 'granted') return

  const { onClick, ...notificationOptions } = options || {}

  const notification = new Notification(title, {
    icon: '/icon-192.svg',
    badge: '/favicon.svg',
    ...notificationOptions
  })

  if (onClick) {
    notification.onclick = () => {
      onClick()
      notification.close()
      window.focus()
    }
  }

  // Auto close after 5 seconds
  setTimeout(() => notification.close(), 5000)
}

/**
 * Show notification for new trade proposal
 */
export function showTradeNotification(
  rockName: string,
  offeredRockName: string,
  onNavigate?: () => void
): void {
  showNotification('New Trade Proposal!', {
    body: `Someone wants to trade "${offeredRockName}" for your "${rockName}"`,
    tag: 'trade-proposal',
    requireInteraction: true,
    onClick: onNavigate
  })
}

/**
 * Show notification for trade response
 */
export function showTradeResponseNotification(
  accepted: boolean,
  rockName: string,
  onNavigate?: () => void
): void {
  const title = accepted ? 'Trade Accepted!' : 'Trade Declined'
  const body = accepted
    ? `Your trade proposal for "${rockName}" was accepted! Complete the exchange.`
    : `Your trade proposal for "${rockName}" was declined.`

  showNotification(title, {
    body,
    tag: 'trade-response',
    onClick: onNavigate
  })
}

/**
 * Show notification for trade completed
 */
export function showTradeCompletedNotification(
  rockName: string,
  onNavigate?: () => void
): void {
  showNotification('Trade Completed!', {
    body: `You've successfully acquired "${rockName}". Check your collection!`,
    tag: 'trade-completed',
    onClick: onNavigate
  })
}
