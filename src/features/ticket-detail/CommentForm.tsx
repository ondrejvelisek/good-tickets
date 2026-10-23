import { useState, type FormEvent } from 'react'
import { useAddComment } from '../../api/comments'

export function CommentForm({ ticketId }: { ticketId: string }) {
  const [body, setBody] = useState('')
  const addComment = useAddComment(ticketId)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!body.trim()) return
    addComment.mutate(body, { onSuccess: () => setBody('') })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Add a comment…"
        rows={3}
        className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <div className="mt-2 flex items-center justify-end gap-3">
        {addComment.isError && <p className="text-sm text-red-600">Could not post the comment.</p>}
        <button
          type="submit"
          disabled={!body.trim() || addComment.isPending}
          className="h-8 rounded-md bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addComment.isPending ? 'Sending…' : 'Comment'}
        </button>
      </div>
    </form>
  )
}
