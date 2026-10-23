import { useMutation } from '@tanstack/react-query'

interface MutationWrapperOptions<TData, TVariables> {
  fn: (variables: TVariables) => Promise<TData>
  beforeFn?: (variables: TVariables) => void
}

/**
 * Reusable wrapper around useMutation so we can easily swap the implementation later.
 */
export function useMutationWrapper<TData, TVariables>({ fn, beforeFn }: MutationWrapperOptions<TData, TVariables>) {
  return useMutation({
    mutationFn: fn,
    onMutate: beforeFn,
  })
}
