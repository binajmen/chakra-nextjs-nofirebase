import { createTypedHooks } from 'easy-peasy'

import type { StoreType } from './index'

const typedHooks = createTypedHooks<StoreType>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState