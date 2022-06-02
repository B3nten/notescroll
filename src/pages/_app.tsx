import '@/styles/globals.css'
import '@/styles/effects.css'
import '@/styles/components.css'
import type { AppProps } from 'next/app'
import { SupabaseProvider } from '@/modules/supabase'
import { Login } from '@/modules/login'
import { Toaster } from 'react-hot-toast'
import { Metatags } from '@/modules/metatags'
import { ThemeProvider } from '@/modules/theme'
import { SpotlightProvider, openSpotlight } from '@mantine/spotlight'
import type { SpotlightAction } from '@mantine/spotlight'
import { useSearch } from '@/modules/supabase/useWorseSearch'
import { Loading } from '@/common/components/loading'

const actions: SpotlightAction[] = [
  {
    title: 'Go to notes',
    description: 'View your notes.',
    onTrigger: () => console.log('Home'),
  },
  {
    title: 'Go to timelines',
    description: 'View your timelines.',
    onTrigger: () => console.log('Dashboard'),
  },
  {
    title: 'Dashboard',
    description: 'Go to campaign dashboard',
    onTrigger: () => console.log('Documentation'),
  },
  {
    title: 'Characters',
    description: 'View your characters',
    onTrigger: () => console.log('Documentation'),
  },
  {
    title: 'Items',
    description: 'View your items',
    onTrigger: () => console.log('Documentation'),
  },
  {
    title: 'Locations',
    description: 'View your locations',
    onTrigger: () => console.log('Documentation'),
  },
  {
    title: 'New Character',
    description: 'Create a character',
    onTrigger: () => console.log('Documentation'),
    keywords: ['add character']
  },
  {
    title: 'Settings',
    description: 'Go to settings',
    onTrigger: () => console.log('Documentation'),
  },
]

function CustomWrapper(props: any) {
  const input = props.children.props.query
  const searchTerm = input.indexOf('note:') === 0 ? input.substring(5) : input
  console.log(searchTerm)

  const search = useSearch(searchTerm)

  return (
    <div className='p-4'>
      {search.isValidating && <Loading loaded={[false]} />}
      <div>{search.loaded && !search.isValidating && props.children.props.query.indexOf('note:') === 0 && search.data?.slice(0, 3).map((el: any) =>
        <div className='text-lg'>{el.name}<span className='text-sm opacity-60'> {el.type}</span></div>
      )}</div>
      {props.children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <SupabaseProvider>
      <Metatags />
      <Toaster toastOptions={{ style: { borderRadius: '20px', background: '#ede7d8', color: 'black' } }} />
      <ThemeProvider>
        <Login>
          <SpotlightProvider actions={actions} shortcut="mod + space" actionsWrapperComponent={CustomWrapper} limit={3}>
            {getLayout(<Component {...pageProps} />)}
          </SpotlightProvider>
        </Login>
      </ThemeProvider>
    </SupabaseProvider>
  )
}
export default MyApp
