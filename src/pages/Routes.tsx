import { Redirect, Route, Switch } from 'react-router-dom'
import { Staking } from './staking'


export const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/staking" />} />
            <Route exact path="/staking" render={Staking} />
        </Switch>
    )
}
