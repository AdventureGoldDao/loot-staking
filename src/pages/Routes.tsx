import { Route, Switch } from 'react-router-dom'
import { Staking } from './staking'
import ComingSoon from './ComingSoon'

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Staking} />
      <Route exact path="/staking" component={Staking} />
      <Route exact path="/comingsoon" component={ComingSoon} />
    </Switch>
  )
}
