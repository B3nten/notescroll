import '@/styles/globals.css'
import '@/styles/effects.css'
import '@/styles/components.css'
import type { AppProps } from 'next/app'
import { SupabaseProvider } from '@/modules/supabase'
import { Login } from '@/modules/login'
import { Toaster } from 'react-hot-toast'
import { Metatags } from '@/modules/metatags'
import { Container } from '@/modules/container'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <Metatags />
      <Toaster toastOptions={{ style: { borderRadius: '20px', background: '#ede7d8', color: 'black' } }} />
      <Container>
        <Login>
          <Component {...pageProps} />
        </Login>
      </Container>
    </SupabaseProvider>
  )
}
export default MyApp
