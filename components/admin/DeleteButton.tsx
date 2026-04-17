'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface Props {
  id: string
  endpoint: string
  label: string
  redirectTo?: string
}

export default function DeleteButton({ id, endpoint, label, redirectTo }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        if (redirectTo) router.push(redirectTo)
        router.refresh()
      }
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete ${label}`}
      className="text-gray-300 hover:text-red-500 transition-colors"
    >
      <Trash2 size={14} />
    </button>
  )
}
