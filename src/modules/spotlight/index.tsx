import { SpotlightProvider, useSpotlight } from '@mantine/spotlight'
import { useSearch } from '@/modules/supabase/useSearch'
import { Loading } from '@/common/components/loading'
import { useEffect, useState } from 'react'
import { actions } from './actions'
import { useClientRouter } from '@/common/hooks/useClientRouter'

function CustomAction({ action, onTrigger }: any) {
    return (
        <div className='transition hover:bg-base-300/30 p-3 rounded-md text-base-content'>
            <button onClick={onTrigger} className='flex flex-col items-start w-full'>
                <span className='text-lg leading-none '>{action.title}</span>
                <div className='text-sm opacity-70'>{action.description}</div>
            </button>
        </div>
    )
}

function CustomWrapper(props: any) {
    const router = useClientRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const search = useSearch(props.children.props.query)
    const spotlight = useSpotlight()
    useEffect(() => {
        if (props.children.props.query.indexOf('n:') === 0) {
            setSearchTerm(props.children.props.query.substring(2))
        } else {
            setSearchTerm('')
        }
    }, [props.children.props.query])

    return (
        <div className='p-4'>
            {search.isValidating && <Loading loaded={[false]} />}
            <div>{search.loaded && !search.isValidating && search.data?.slice(0, 4).map((el: any) =>
                <div className='transition hover:bg-base-300/30 p-3 rounded-md text-base-content'>
                    <button onClick={() => { spotlight.closeSpotlight(); router.push(`/campaign/${router.query.cid}/notes/${el.id}`) }} className='flex flex-col items-start w-full'>
                        <span className='text-lg leading-none '>{el.name}</span>
                        <div className='text-sm opacity-70'>{el.type}</div>
                    </button>
                </div>
            )}</div>
            {props.children}
        </div>
    )
}

type T = { children: any }
export function Spotlight({ children }: T) {
    return <SpotlightProvider
        classNames={{
            spotlight: 'bg-base-100',
            searchInput: 'bg-base-200 text-base-content font-body placeholder:font-body placeholder:text-base-content/80',
            actions: 'border-0'
        }}
        searchPlaceholder='start typing...'
        actions={actions}
        shortcut="mod + space"
        actionsWrapperComponent={CustomWrapper}
        actionComponent={CustomAction}
        limit={4}>
        {children}
    </SpotlightProvider>
}