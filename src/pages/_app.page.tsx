import '@/styles/globals.css'
import '@/styles/effects.css'
import '@/styles/components.css'
import type { AppProps } from 'next/app'
import { SupabaseProvider } from '@/modules/supabase'
import { Login } from '@/modules/login'
import { Toaster } from 'react-hot-toast'
import { Metatags } from '@/modules/metatags'
import { ThemeProvider } from '@/modules/theme'
import { Spotlight } from '@/modules/spotlight'


function MyApp({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <SupabaseProvider>
      <Metatags />
      <Toaster toastOptions={{ style: { borderRadius: '20px', background: '#ede7d8', color: 'black' } }} />
      <ThemeProvider>
        <Login>
          <Spotlight>
            {getLayout(<Component {...pageProps} />)}
          </Spotlight>
        </Login>
      </ThemeProvider>
    </SupabaseProvider >
  )
}
export default MyApp
