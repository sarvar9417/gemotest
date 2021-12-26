import React from 'react'
import { DashboardMenu } from './DashboardMenu'

export const Dashboard = (props) => {
    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    {props.menu && <DashboardMenu />}
                    {props.component}
                </div>
            </section>
        </div>

    )
}
