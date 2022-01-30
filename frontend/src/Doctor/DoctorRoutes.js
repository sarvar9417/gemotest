import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Adoption } from './DoctorPages/Adoption'
import { AuthPage } from './DoctorPages/DoctorAuth'
import { Home } from './DoctorPages/Home'
import { Sayt } from '../Sayt/sayt'
import { EditAdoption } from './DoctorPages/EditAdoption'
import { ClientAllHistory } from './DoctorPages/ClientAllHistory'
import { Templates } from './DoctorPages/templates/Templates'
import { CreateTemplate } from './DoctorPages/templates/CreateTemplate'
import { EditTemplate } from './DoctorPages/templates/EditTemplate'
import { TableSection } from './DoctorPages/tableSection/TableSection'

export const DoctorRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/doctor" exact >
                        <Home />
                    </Route>
                    <Route path="/doctor/adoption/:clientid/:connectorid" >
                        <Adoption />
                    </Route>
                    <Route path="/doctor/edit/:id" >
                        <EditAdoption />
                    </Route>
                    <Route path="/doctor/clientallhistory/:id" >
                        <ClientAllHistory />
                    </Route>
                    <Route path="/doctor/templates" >
                        <Templates />
                    </Route>
                    <Route path="/doctor/tables" >
                        <TableSection />
                    </Route>
                    <Route path="/doctor/createtemplate" >
                        <CreateTemplate />
                    </Route>
                    <Route path="/doctor/edittemplate/:headsectionid/:directionid" >
                        <EditTemplate />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>
                    <Redirect to="/doctor" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/doctor" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/doctor" />
        </Switch>
    )
}