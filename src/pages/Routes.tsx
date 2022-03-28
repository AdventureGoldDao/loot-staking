import { Redirect, Route, Switch } from 'react-router-dom'
import { Staking } from './staking'
import ComingSoon from './ComingSoon'


export const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/staking" />} />
            <Route exact path="/staking" render={Staking} />
            <Route exact path="/comingsoon" render={ComingSoon} />
        </Switch>
    )
}
