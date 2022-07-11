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
import { QueryClientProvider, QueryClient } from 'react-query'
import { toast } from 'react-hot-toast'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
	//@ts-ignore
	const getLayout = Component.getLayout || (page => page)
	return (
		<SupabaseProvider>
			<Metatags />
			<Toaster
				toastOptions={{
					style: {
						borderRadius: '8px',
						background: 'hsl(var(--p))',
						color: 'hsl(var(--pc))',
					},
				}}
			/>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<Login>
						<Spotlight>{getLayout(<Component {...pageProps} />)}</Spotlight>
					</Login>
				</ThemeProvider>
			</QueryClientProvider>
		</SupabaseProvider>
	)
}
export default MyApp
