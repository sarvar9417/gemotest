import React, { useCallback, useEffect, useState } from 'react';
import { useHttp } from '../Client/hooks/http.hook';


export const Navbar = () => {
    const [logo, setLogo] = useState()
    const { request } = useHttp()
    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null,)
            setLogo(data[0])
        } catch (e) {

        }
    }, [request, setLogo])

    useEffect(() => {
        if (!logo) {
            getLogo()
        }
    })

    return <div>
        <header id="header" className="fixed-top">
            <div className="container d-flex align-items-center py-0">
                <img width="150" height="70" src={logo && logo.logo} alt="logo" className='me-auto m-0 p-0' />
                <nav id="navbar" className=" navbar order-last order-lg-0">
                    <ul>
                        <li><a className="nav-link scrollto " href="#hero">Bosh sahifa</a></li>
                        <li><a className="nav-link scrollto" href="#about">Biz haqimizda</a></li>
                        <li><a className="nav-link scrollto" href="#services">Xizmatlar</a></li>
                        <li><a className="nav-link scrollto" href="#departments">Bo'limlar</a></li>
                        <li><a className="nav-link scrollto" href="#doctors">Shifokorlar</a></li>
                        <li><a className="nav-link scrollto" href="#contact">Kontakt</a></li>
                    </ul>
                    <i className="bi bi-list mobile-nav-toggle" />
                </nav>
                <a href="#appointment" className="appointment-btn scrollto">Natijalarni olish</a>
            </div>
        </header>

    </div>;
};
