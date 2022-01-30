import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './LabaratoriyaPages/LabaratoriyaAuth'
import { Home } from './LabaratoriyaPages/Home'
import { Sayt } from '../Sayt/sayt'

export const LabaratoriyaRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/labaratoriya" exact >
                        <Home />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>

                    <Redirect to="/labaratoriya" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/labaratoriya" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/labaratoriya" />
        </Switch>
    )
}
