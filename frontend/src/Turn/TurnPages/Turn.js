import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { toast } from "react-toastify"
import './turn.css'
import { Loading } from '../components/Loading'
import { DirectionTurn } from './DirectionTurn'

toast.configure()
export const Turn = () => {

    // So'rovlar yuklanishi
    const { request } = useHttp()

    const [headsections, setHeadsections] = useState()
    const getHeadsections = useCallback(async () => {
        try {
            const data = await request("/api/headsection", "GET", null)
            let h = []
            data.map((headsection) => {
                h.push({
                    headsection: headsection._id,
                    name: headsection.name,
                    room: 0,
                    turn: 0
                })
            })
            setHeadsections(h)
        } catch (e) {
        }
    }, [request, setHeadsections])

    const getTurns = () => {
        headsections && headsections.map((headsection) => {
            const fetch = request(`/api/section/turnid/${headsection.headsection}`, 'GET', null)
            let h = [...headsection]
            console.log(fetch)
        })
    }

    const [time, setTime] = useState(new Date().toLocaleTimeString())
    setInterval(() => {
        setTime(new Date().toLocaleTimeString())
        // getTurns()
    }, 1000);

    setInterval(() => {
        // getTurns()
    }, 5000);

    // Componentlar chaqiruvi
    useEffect(() => {
        if (!headsections) {
            getHeadsections()
        }
    }, [getHeadsections])


    return (
        <div className="body">
            <div className="cc mb-5">
                <div className="row text-white" style={{ backgroundColor: "#45D3D3" }}>
                    <div className="col-lg-4 d-lg-block  text-center d-none" >
                        <h1 className="p-4">{new Date().toLocaleDateString()}</h1>
                    </div>
                    <div className="col-lg-4 d-md-block d-none" style={{ textAlign: "center" }}>
                        <h1 className="p-4 text-uppercase">Gemo-Test</h1>
                    </div>
                    <div className="col-lg-4 text-md-center">
                        <h1 className="p-4">{time}</h1>
                    </div>
                </div>
            </div>
            <div className="row mb-4" style={{ overflowX: "hidden" }}>
                {headsections && headsections.map((headsection, index) => {

                    return (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-2" key={index}>
                            <DirectionTurn section={headsection.name} room={headsection.room} turn={headsection.turn} />
                        </div>)
                })}
            </div>
        </div>
    )
}