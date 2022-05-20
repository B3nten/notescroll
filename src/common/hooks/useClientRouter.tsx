import { match } from 'path-to-regexp'
import router, { makePublicRouterInstance, useRouter } from 'next/router';

import type { Router, NextRouter } from 'next/router';
import type { MatchResult } from 'path-to-regexp';
import type { ParsedUrlQuery } from 'querystring';

function fixClientRouter() {
    if (typeof window !== 'undefined') {
      const windowPathname = window.location.pathname
      const input = router.pathname.replaceAll('[',':').replaceAll(']','')
      return {
        ...makePublicRouterInstance(router.router as Router),
        pathname: windowPathname,
        query: (match(input)(window.location.pathname) as MatchResult<ParsedUrlQuery>).params
      }
    } else {
      return { query: {}, pathname: '', route: '', asPath: '', basePath: '' }
    }
  }
  
  export function useClientRouter(){
    useRouter()
    return fixClientRouter()
  }
