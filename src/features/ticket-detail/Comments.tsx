import { useComments } from '../../api/comments'
import { useUserMap } from '../../api/users'
import { Avatar } from '../../components/Avatar'
import { Spinner } from '../../components/Spinner'
import { formatDateTime } from '../../utils/date'
import { RichText } from '../../utils/RichText'
import { CommentForm } from './CommentForm'

export function Comments({ ticketId }: { ticketId: string }) {
  const { data: comments, isPending, isError } = useComments(ticketId)
  const users = useUserMap()

  return (
    <section className="mt-8 border-t border-slate-200 pt-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Comments {comments && <span className="font-normal text-slate-400">{comments.length}</span>}
      </h3>

      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-sm text-red-600">Could not load comments.</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((comment) => {
            const author = users.get(comment.authorId)
            return (
              <li key={comment.id} className="flex gap-3">
                <Avatar user={author} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm">
                    <span className="font-medium text-slate-900">{author?.name ?? 'Unknown user'}</span>{' '}
                    <span className="text-xs text-slate-400">{formatDateTime(comment.createdAt)}</span>
                  </p>
                  <RichText text={comment.body} />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <CommentForm key={ticketId} ticketId={ticketId} />
    </section>
  )
}
