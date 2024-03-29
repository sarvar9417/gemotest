import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import { CallCenter } from './CallCenter/CallCenter'
import { Cashier } from './Cashier/Cashier'
import { ClientHistory } from './Client/ClientHistory'
import { CounterAgent } from './CounterAgent/CounterAgent'
import { Director } from './Director/Director'
import { Doctor } from './Doctor/Doctor'
import { Fizioterapevt } from './Fizioterapevt/Fizioterapevt'
import { Labaratoriya } from './Labaratoriya/Labaratoriya'
import { Medsestra } from './Medsestra/Medsestra'
import { Reseption } from './Reseption/Reseption'
import { Sayt } from './Sayt/sayt'
import { Turn } from './Turn/Turn'
import { Site } from './WebSite/Site'

export const useRoutes = () => {
    return (
        <Switch>
            <Route path="/reseption"  >
                <Reseption />
            </Route>
            <Route path="/doctor" >
                <Doctor />
            </Route>
            <Route path="/director" >
                <Director />
            </Route>
            <Route path="/cashier" >
                <Cashier />
            </Route>
            <Route path="/turn" >
                <Turn />
            </Route>
            <Route path="/callcenter" >
                <CallCenter />
            </Route>
            <Route path="/clienthistorys/:id" >
                <ClientHistory />
            </Route>
            <Route path="/medsestra" >
                <Medsestra />
            </Route>
            <Route path="/fizioterapevt" >
                <Fizioterapevt />
            </Route>
            <Route path="/counteragent" >
                <CounterAgent />
            </Route>
            <Route path="/labaratoriya" >
                <Labaratoriya />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Route path="/" >
                <Site />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}