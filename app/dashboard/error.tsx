"use client"

import { DashboardErrorFallback } from "./dashboard-error-fallback"

export default function DashboardError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <DashboardErrorFallback error={props.error} reset={props.reset} />
}
