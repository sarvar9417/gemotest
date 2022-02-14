import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/AuthContext'
import './nav.css'
import { toast } from 'react-toastify'
import { useHttp } from '../hooks/http.hook'

toast.configure()
export const Navbar = () => {

    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const history = useHistory()
    const [direction, setDirection] = useState()
    const getDirection = useCallback(async () => {
        try {
            const fetch = await request(`/api/headsection/${auth && auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDirection(fetch)
        } catch (e) {
        }
    }, [request, auth, setDirection])

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/doctor')
    }

    const goBack = () => {
        history.push('/sayt')
        window.location.reload()
    }


    const [show, setShow] = useState(true)

    useEffect(() => {
        if (!direction) {
            getDirection()
        }
    }, [])
    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow fixed-top bg-light" >
            <div className="container" >
                <button className="navbar-brand btn p-0" onClick={goBack}>
                    Bosh menyu
                </button>
                <button onClick={() => setShow(!show)} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} className="navbar-icon" />
                </button>
                <div className={show ? "collapse navbar-collapse" : "collapse navbar-collapse show"} id="navbarNav">
                    <ul className="navbar-nav ms-auto ull">
                        <li className="nav-item">
                            <Link className="nav-link a aktive" to="/doctor">Mijozlar</Link>
                        </li>
                        <li className="nav-item" >
                            {
                                direction && direction.probirka ?
                                    <Link className="nav-link a" to="/doctor/templates">Shablonlar</Link>
                                    :
                                    <Link className="nav-link a" to="/doctor/templatesummary">Shablonlar</Link>
                            }

                        </li>

                        <li className="nav-item ll" >
                            {
                                direction && direction.probirka ?
                                    <Link className="nav-link a" to="/doctor/tables">Jadvallar</Link>
                                    : ""
                            }
                        </li>


                    </ul>
                    <li className="nav-item ll" >
                        <span style={{ backgroundColor: "#EA5353" }} className="nav-link btn text-white" href="" onClick={logoutHandler} >Chiqish</span>
                    </li>
                </div>
            </div>
        </nav>
    )
}
