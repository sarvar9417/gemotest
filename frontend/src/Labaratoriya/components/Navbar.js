import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import AOS from "aos"
import "aos/dist/aos.css"
import { AuthContext } from '../context/AuthContext'
import './nav.css'

export const Navbar = () => {
    useEffect(() => {
        AOS.init()
    }, [])
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/labaratorita/auth')
    }

    const goBack = () => {
        history.push("/sayt")
        window.location.reload()
    }
    const [show, setShow] = useState(true)
    return (
        <nav className="navbar navbar-expand-md navbar-light shadow fixed-top bg-light" data-aos="fade-down" data-aos-duration="1000" >
            <div className="container" >
                <button className="navbar-brand btn" onClick={goBack}>Bosh menyu</button>
                <button onClick={() => setShow(!show)} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} className="navbar-icon" />
                </button>
                <div className={show ? "collapse navbar-collapse" : "collapse navbar-collapse show"} id="navbarNav">
                    <ul className="navbar-nav ms-auto ull">
                        <li className="nav-item">
                            <Link className="nav-link a aktive" to="/labaratoriya/clients">Mijozlar</Link>
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
