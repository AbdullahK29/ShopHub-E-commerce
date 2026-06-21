// src/store/Providers.tsx
// Next.js App Router runs on the server by default.
// Redux needs the browser — so we isolate it here with 'use client'
// and wrap our entire app in it from layout.tsx

'use client'

import { Provider } from 'react-redux'
import { store } from './index'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}