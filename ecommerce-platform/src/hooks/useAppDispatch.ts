// src/hooks/useAppDispatch.ts
// Typed version of useDispatch — knows about our specific action types

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()