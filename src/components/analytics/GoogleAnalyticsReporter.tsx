import { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'

// fires a GA pageview every time the route changes
export default function GoogleAnalyticsReporter({ location: { pathname, search } }: RouteComponentProps): null {
  useEffect(() => {
    // ReactGA.pageview(`${pathname}${search}`)
    //remove GA 
    //TODO: integrate with woodpecker
  }, [pathname, search])
  return null
}
