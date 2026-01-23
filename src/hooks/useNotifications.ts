import { useState, useEffect, useCallback, useRef } from 'react'
import {
  supportsNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  showTradeNotification,
  showTradeResponseNotification,
  showTradeCompletedNotification,
  type NotificationPermission
} from '@/services/notifications'
import type { TradeProposal } from '@/types'

interface UseNotificationsResult {
  permission: NotificationPermission
  supported: boolean
  requestPermission: () => Promise<void>
  notifyNewTrade: (proposal: TradeProposal) => void
  notifyTradeResponse: (proposal: TradeProposal) => void
  notifyTradeCompleted: (proposal: TradeProposal) => void
}

export function useNotifications(
  onNavigateToTrades?: () => void
): UseNotificationsResult {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const supported = supportsNotifications()

  // Track seen notifications to avoid duplicates
  const seenNotifications = useRef<Set<string>>(new Set())

  useEffect(() => {
    setPermission(getNotificationPermission())
  }, [])

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
  }, [])

  const notifyNewTrade = useCallback((proposal: TradeProposal) => {
    const key = `new-${proposal.id}`
    if (seenNotifications.current.has(key)) return
    seenNotifications.current.add(key)

    showTradeNotification(
      proposal.targetRock.name,
      proposal.offeredRock.name,
      onNavigateToTrades
    )
  }, [onNavigateToTrades])

  const notifyTradeResponse = useCallback((proposal: TradeProposal) => {
    const key = `response-${proposal.id}-${proposal.status}`
    if (seenNotifications.current.has(key)) return
    seenNotifications.current.add(key)

    showTradeResponseNotification(
      proposal.status === 'accepted',
      proposal.targetRock.name,
      onNavigateToTrades
    )
  }, [onNavigateToTrades])

  const notifyTradeCompleted = useCallback((proposal: TradeProposal) => {
    const key = `completed-${proposal.id}`
    if (seenNotifications.current.has(key)) return
    seenNotifications.current.add(key)

    showTradeCompletedNotification(
      proposal.offeredRock.name,
      onNavigateToTrades
    )
  }, [onNavigateToTrades])

  return {
    permission,
    supported,
    requestPermission,
    notifyNewTrade,
    notifyTradeResponse,
    notifyTradeCompleted
  }
}
