import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
    >
      {message}
    </div>
  )
}
