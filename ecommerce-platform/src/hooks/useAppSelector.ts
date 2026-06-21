// src/hooks/useAppSelector.ts
// Typed version of useSelector — knows the shape of our entire state tree

import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { RootState } from '@/store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector