import { useMutationWrapper } from './useMutationWrapper'

interface BulkOperationOptions<TData, TVariables> {
  operation: (variables: TVariables) => Promise<TData>
  onBeforeOperation?: (variables: TVariables) => void
}

/**
 * Generic hook for running an operation on a single item as part of a bulk action.
 */
export function useBulkOperation<TData, TVariables>({
  operation,
  onBeforeOperation,
}: BulkOperationOptions<TData, TVariables>) {
  return useMutationWrapper({
    fn: operation,
    beforeFn: onBeforeOperation,
  })
}
