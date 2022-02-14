import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'

export const DirectionTurn = ({ section, id }) => {
    const { request } = useHttp()

    const [offline, setOffline] = useState(0)
    const [room, setRoom] = useState(0)
    const getOffline = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/turnid/${id}`, 'GET', null)
            if (!fetch) {
                setOffline(0)
            } else {
                if (fetch.section.turn !== offline) {
                    setOffline(fetch.section.turn)
                }
                if (fetch.room) {
                    setRoom(fetch.room)
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [request, offline, setOffline, id, setRoom])

    // useEffect(() => {
    // }, [getOffline])
    setInterval(() => {
        if ('caches' in window) {
            caches.keys().then((names) => {
                // Delete all the cache files
                names.forEach(name => {
                    caches.delete(name);
                })
            });

            // Makes sure the page reloads. Changes are only visible after you refresh.
            // window.location.reload(true);    
        }
        getOffline()

    }, 3000)

    setInterval(() => {

        // Makes sure the page reloads. Changes are only visible after you refresh.
        window.location.reload(true);


    }, 120000)



    return (
        <div className="kard" style={{ width: "90%", margin: "auto" }}>
            <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                <h2 className="text px-2">{section}</h2>
                <p></p>
            </div>
            <div className="row">
                <div className="col-7" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                    <h5>Navbat</h5>
                    <h1 style={{ color: "green" }}>{offline}</h1>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <div className="image">
                        <h5>Xona</h5>
                        <h1 style={{ color: "#e3342f" }}>{room}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
