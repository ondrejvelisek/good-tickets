import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './client'
import { queryKeys } from './queryKeys'
import type { Comment } from './types'

export function useComments(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.tickets.comments(ticketId),
    queryFn: () => apiFetch<Comment[]>(`/tickets/${encodeURIComponent(ticketId)}/comments`),
  })
}

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: string) =>
      apiFetch<Comment>(`/tickets/${encodeURIComponent(ticketId)}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      }),
    onSuccess: (comment) => {
      queryClient.setQueryData<Comment[]>(queryKeys.tickets.comments(ticketId), (comments = []) => [
        ...comments,
        comment,
      ])
    },
  })
}
