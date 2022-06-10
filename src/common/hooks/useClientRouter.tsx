import { match } from 'path-to-regexp'
import router, { makePublicRouterInstance, useRouter } from 'next/router'

import type { Router, NextRouter } from 'next/router'
import type { MatchResult } from 'path-to-regexp'
import type { ParsedUrlQuery } from 'querystring'


function fixClientRouter(): NextRouter {
  if (typeof window !== 'undefined') {
    const windowPathname = window.location.pathname
    const input = router.pathname.replaceAll('[', ':').replaceAll(']', '')
    let queries: {} = {}
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.forEach((value, key) => queries[key] = value)

    return {
      ...makePublicRouterInstance(router.router as Router),
      pathname: windowPathname,
      query: { ...(match(input)(window.location.pathname) as MatchResult<ParsedUrlQuery>).params, ...queries }
    }
  } else {
    return { query: {}, pathname: '', route: '', asPath: '', basePath: '' } as NextRouter
  }
}

export function useClientRouter(): NextRouter {
  useRouter()
  return fixClientRouter()
}
