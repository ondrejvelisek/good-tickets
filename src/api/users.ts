import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'
import { queryKeys } from './queryKeys'
import type { User } from './types'

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiFetch<User>('/me'),
    staleTime: Infinity,
  })
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiFetch<User[]>('/users'),
    staleTime: 5 * 60_000,
  })
}

export function useUserMap() {
  const { data: users = [] } = useUsers()
  return new Map(users.map((user) => [user.id, user]))
}
