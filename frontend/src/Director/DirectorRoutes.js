import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './directorPages/DirectorAuth'
import { Sayt } from '../Sayt/sayt'
import { Chart } from './directorPages/Others/Chart'
import { RouterComponent } from './RouterComponent'
import { Marketing } from './marketing/Marketing'
import { ClientsDoctor } from './directorPages/Others/ClientsDoctor'


import { Doctors } from './directorPages/Others/Doctors'
import { ClientsPages } from './directorPages/Others/ClientsPages'
import { AddDoctor } from './directorPages/Others/AddDoctor'
import { AddLogo } from './directorPages/Others/AddLogo'
import { EditDoctor } from './directorPages/Others/EditDoctor'
import { AddDirection } from './directorPages/Directions/AddDirection'
import { ClientAllHistory } from './directorPages/adoptions/ClientAllHistory'
import { ClientHistory } from './directorPages/Others/ClientHistory'
import { EditDirector } from './directorPages/Others/EditDirector'
import { EditReseption } from './directorPages/Others/EditReseption'
import { EditCashier } from './directorPages/Others/EditCashier'
import { CounterAgents } from './marketing/counteragents/CounterAgents'
import { AddCounterAgent } from './marketing/counteragents/AddCounterAgent'
import { EditCounterAgent } from './marketing/counteragents/EditCounterAgent'
import { ClientsCounterAgent } from './marketing/counteragents/ClientsCounterAgent'
import { Advertisements } from './marketing/advertising/Advertisements'
import { AddAdvertisement } from './marketing/advertising/AddAdvertisement'
import { EditAdvertisement } from './marketing/advertising/EditAdvertisement'
import { ClientsAdvertisements } from './marketing/advertising/ClientsAdvertisement'
import { EditCallCenter } from './directorPages/Others/EditCallCenter'
import { WareHouse } from './directorPages/WareHouse/WareHouse'
import { CreateWare } from './directorPages/WareHouse/CreateWare'
import { AddWare } from './directorPages/WareHouse/AddWare'
import { HistoryWare } from './directorPages/WareHouse/HistoryWare'
import { Rooms } from './directorPages/Rooms/Rooms'
import { CreateRoom } from './directorPages/Rooms/CreateRoom'
import { ClientsStatsionarPages } from './directorPages/ClientsStatsionarPages'
import { ClientsPayments } from './directorPages/ClientsPayments'
import { AddCounterDoctor } from './marketing/counterdoctors/AddCounterDoctor'
import { CounterDoctors } from './marketing/counterdoctors/Counterdoctors'
import { EditCounterDoctor } from './marketing/counterdoctors/EditCounterDoctor'
import { EditWareHouse } from './directorPages/WareHouse/EditWareHouse'
import { WareConnector } from './directorPages/WareHouse/WareConnectors'
import { RecieptStatsionar } from './directorPages/RecieptStatsionar'
import { ChartsMarketing } from './marketing/ChartsMarketing'
import { PaymentsCounterAgents } from './marketing/counteragents/PaymentsCounterAgents'
import { CallCenterClientsPages } from './marketing/callcenter/CallCenterClientsPages'
import { HeadDirections } from './directorPages/Directions/HeadDirections'
import { AddHeadDirection } from './directorPages/Directions/AddHeadDirection'
import { EditHeadDirection } from './directorPages/Directions/EditHeadDirection'
import { Directions } from './directorPages/Directions/Directions'
import { EditDirection } from './directorPages/Directions/EditDirection'
import { ClientsDirector } from './directorPages/adoptions/ClientsDirektor'
import { Adoption } from './directorPages/adoptions/Adoption'
import { Sales } from './directorPages/salesandebt/Sales'
import { Debtors } from './directorPages/salesandebt/Debtors'
import { AllClients } from './directorPages/adoptions/AllClients'

export const DirectorRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div>
                <Switch>
                    <Route path="/director" exact >
                        <RouterComponent component={<Chart />} menu={true} />
                    </Route>
                    <Route path="/director/info"  >
                        <RouterComponent component={<ClientsPages />} menu={true} />
                    </Route>
                    <Route path='/director/doctors' >
                        <RouterComponent component={<Doctors />} menu={true} />
                    </Route>
                    <Route path='/director/adddoctor' >
                        <RouterComponent component={<AddDoctor />} menu={true} />
                    </Route>
                    <Route path='/director/addlogo' >
                        <RouterComponent component={<AddLogo />} menu={true} />
                    </Route>
                    <Route path='/director/editdoctor/:id' >
                        <RouterComponent component={<EditDoctor />} menu={true} />
                    </Route>
                    <Route path='/director/headdirections' >
                        <RouterComponent component={<HeadDirections />} menu={true} />
                    </Route>
                    <Route path='/director/directions/:id' >
                        <RouterComponent component={<Directions />} menu={true} />
                    </Route>
                    <Route path='/director/addheaddirection' >
                        <RouterComponent component={<AddHeadDirection />} menu={true} />
                    </Route>
                    <Route path='/director/editheaddirection/:id' >
                        <RouterComponent component={<EditHeadDirection />} menu={true} />
                    </Route>
                    <Route path='/director/adddirection/:id' >
                        <RouterComponent component={<AddDirection />} menu={true} />
                    </Route>
                    <Route path='/director/directionedit/:headid/:id' >
                        <RouterComponent component={<EditDirection />} menu={true} />
                    </Route>
                    <Route path='/director/clientallhistory/:id' >
                        <RouterComponent component={<ClientAllHistory />} menu={true} />
                    </Route>
                    <Route path='/director/clienthistory/:id' >
                        <RouterComponent component={<ClientHistory />} menu={true} />
                    </Route>
                    <Route path='/director/editdirector' >
                        <RouterComponent component={<EditDirector />} menu={false} />
                    </Route>
                    <Route path='/director/editreseption' >
                        <RouterComponent component={<EditReseption />} />
                    </Route>
                    <Route path='/director/editcashier' >
                        <RouterComponent component={<EditCashier />} />
                    </Route>
                    <Route path='/director/editcallcenter' >
                        <RouterComponent component={<EditCallCenter />} />
                    </Route>
                    <Route path='/director/doctorprocient/:id' >
                        <RouterComponent component={<ClientsDoctor />} menu={true} />
                    </Route>
                    <Route path='/director/marketing' >
                        <RouterComponent component={<Marketing component={<ChartsMarketing />} />} />
                    </Route>
                    <Route path='/director/counteragents' >
                        <RouterComponent component={<Marketing component={<CounterAgents />} />} />
                    </Route>
                    <Route path='/director/addcounteragent' >
                        <RouterComponent component={<Marketing component={<AddCounterAgent />} />} />
                    </Route>
                    <Route path='/director/editcounteragent/:id' >
                        <RouterComponent component={<Marketing component={<EditCounterAgent />} />} />
                    </Route>
                    <Route path='/director/counteragentprocient/:id' >
                        <RouterComponent component={<Marketing component={<ClientsCounterAgent />} />} />
                    </Route>
                    <Route path='/director/paymentscounteragents/:id' >
                        <RouterComponent component={<Marketing component={<PaymentsCounterAgents />} />} />
                    </Route>
                    <Route path='/director/advertisements' >
                        <RouterComponent component={<Marketing component={<Advertisements />} />} />
                    </Route>
                    <Route path='/director/addadvertisements' >
                        <RouterComponent component={<Marketing component={<AddAdvertisement />} />} />
                    </Route>
                    <Route path='/director/editadvertisement/:id' >
                        <RouterComponent component={<Marketing component={<EditAdvertisement />} />} />
                    </Route>
                    <Route path='/director/clientsadvertisiments/:id' >
                        <RouterComponent component={<Marketing component={<ClientsAdvertisements />} />} />
                    </Route>
                    <Route path='/director/callcenter' >
                        <RouterComponent component={<Marketing component={<CallCenterClientsPages />} />} />
                    </Route>
                    <Route path='/director/warehouse' >
                        <RouterComponent component={<WareHouse />} menu={true} />
                    </Route>
                    <Route path='/director/createware' >
                        <RouterComponent component={<CreateWare />} menu={true} />
                    </Route>
                    <Route path='/director/addware/:id' >
                        <RouterComponent component={<AddWare />} menu={true} />
                    </Route>
                    <Route path='/director/wareconnectors' >
                        <RouterComponent component={<WareConnector />} menu={true} />
                    </Route>
                    <Route path='/director/editwarehouse/:id' >
                        <RouterComponent component={<EditWareHouse />} menu={true} />
                    </Route>
                    <Route path='/director/warehistory/:ware' >
                        <RouterComponent component={<HistoryWare />} menu={true} />
                    </Route>
                    <Route path='/director/rooms' >
                        <RouterComponent component={<Rooms />} menu={true} />
                    </Route>
                    <Route path='/director/createroom' >
                        <RouterComponent component={<CreateRoom />} menu={true} />
                    </Route>
                    <Route path='/director/statsionar' >
                        <RouterComponent component={<ClientsStatsionarPages />} menu={true} />
                    </Route>
                    <Route path='/director/recieptstatsionar/:id/:connector' >
                        <RouterComponent component={<RecieptStatsionar />} menu={true} />
                    </Route>
                    <Route path='/director/payments' >
                        <RouterComponent component={<ClientsPayments />} menu={true} />
                    </Route>
                    <Route path='/director/addcounterdoctor' >
                        <RouterComponent component={<Marketing component={<AddCounterDoctor />} />} />
                    </Route>
                    <Route path='/director/counterdoctors' >
                        <RouterComponent component={<Marketing component={<CounterDoctors />} />} />
                    </Route>
                    <Route path='/director/editcounterdoctor/:id' >
                        <RouterComponent component={<Marketing component={<EditCounterDoctor />} />} />
                    </Route>
                    <Route path='/director/clients' >
                        <RouterComponent component={<ClientsDirector />} menu={true} />
                    </Route>
                    <Route path='/director/adoption/:clientid/:connectorid' >
                        <RouterComponent component={<Adoption />} menu={false} />
                    </Route>
                    <Route path='/director/sales' >
                        <RouterComponent component={<Sales />} menu={true} />
                    </Route>
                    <Route path='/director/debtors' >
                        <RouterComponent component={<Debtors />} menu={true} />
                    </Route>
                    <Route path='/director/allresults' >
                        <RouterComponent component={<AllClients />} menu={true} />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>
                    <Redirect to="/director" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/director"  >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/director" />
        </Switch>
    )
}
