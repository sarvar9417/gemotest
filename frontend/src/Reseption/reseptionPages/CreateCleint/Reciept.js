import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Loader } from '../../components/Loader'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import QRCode from 'qrcode'
import { toast } from 'react-toastify'

toast.configure()
export const Reciept = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const [qr, setQr] = useState()
    const clientId = useParams().id
    const connectorId = useParams().connector
    const today = (new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString())
    const [sections, setSections] = useState()
    let price = 0
    let k = 0
    let l = 0
    const [client, setClient] = useState()

    // =================================================================================
    // =================================================================================
    // Servislar bo'limi
    const [services, setServices] = useState()
    const getServices = useCallback(async () => {
        try {
            const data = await request(`/api/service/reseption/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setServices(data)
        } catch (e) {
        }
    }, [request, connectorId, auth, setServices])
    // =================================================================================
    // =================================================================================


    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/section/reseptionid/${clientId}/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSections(data)
        } catch (e) {
        }
    }, [request, clientId, auth])



    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId, auth])

    const notify = (e) => {
        toast.error(e)
    }

    const [baseUrl, setBasuUrl] = useState()
    const getBaseUrl = useCallback(async () => {
        try {
            const fetch = await request(`/api/clienthistorys/url`, 'GET', null)
            setBasuUrl(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, setBasuUrl])

    const [logo, setLogo] = useState()
    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null)
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [request, setLogo])

    const [connector, setConnector] = useState()

    const getConnector = useCallback(async () => {
        try {
            const data = await request(`/api/connector/${connectorId && connectorId}`, "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnector(data)
        } catch (e) {
            notify(e)
        }
    }, [request, setConnector, connectorId, auth])

    useEffect(() => {
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }
        if (!client) {
            getClient()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!logo) {
            getLogo()
        }
        if (!baseUrl) {
            getBaseUrl()
        }
        if (!sections) {
            getSections()
        }
        if (!services) {
            getServices()
        }
        if (!connector) {
            getConnector()
        }

    }, [notify, clearError, getConnector, getServices, getSections, getBaseUrl, getLogo])

    if (loading) {
        return <Loader />
    }


    return (
        <div>
            <div ref={componentRef}>
                <div className="container px-5" >
                    <div className="row"  >
                        <table className="table ">
                            <tbody>
                                <tr>
                                    <td>
                                        <ul className="list-unstyled  text-start m-3">
                                            <li className="" style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }} > {logo && logo.companyname}</strong></li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Manzil: </strong> {logo && logo.address}</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Bank: </strong> {logo && logo.bank}</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}> <strong style={{ fontSize: "10pt", fontFamily: "times" }}>MFO: </strong> {logo && logo.mfo}</li>
                                            <li style={{ fontFamily: "times" }}> <h5 style={{ textAlign: "", fontSize: "10pt" }}> {today}</h5> </li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>INN:</strong> {logo && logo.inn}</li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Hisob raqam: </strong> {logo && logo.accountnumber}</li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Telefon raqam: </strong>
                                                {logo && logo.phone1 !== null ? "+" + logo.phone1 : ""} <br />
                                                {logo && logo.phone2 !== null ? "+" + logo.phone2 : ""} <br />
                                                {logo && logo.phone3 !== null ? "+" + logo.phone3 : ""} <br /></li>
                                        </ul>
                                    </td>
                                    <td className=''>
                                        <img className='me-3' width="200" src={logo && logo.logo} alt="logo" /><br />
                                        {
                                            connector && connector.probirka ?
                                                <h6
                                                    className='d-inline-block'
                                                    style={{ fontSize: "27pt", fontFamily: "times" }}>
                                                    NAMUNA: {connector && connector.probirka}
                                                </h6> :
                                                ""
                                        }
                                    </td>
                                    <td className="text-end">
                                        <img width="140" className='me-3 mt-4' src={qr && qr} alt="QR" /><br />
                                        <p className="pe-3 me-1" style={{ fontSize: "10pt" }}>Bu yerni skanerlang</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="invoice-from ps-4">
                                <h6 className='d-inline-block' style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "17pt" }} >ID: {client && client.id}</h6>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="invoice-from text-center">
                                <h6 className='d-inline-block' style={{ fontSize: "17pt", fontFamily: "times" }}>F.I.O: {client && client.lastname} {client && client.firstname} {client && client.fathername}</h6>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="invoice-from text-center">
                                <h6 className='d-inline-block' style={{ fontSize: "17pt", fontFamily: "times" }}>Yil: {client && new Date(client.born).toLocaleDateString()}</h6>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="invoice-from text-end pe-4">
                                <h6 className='d-inline-block' style={{ fontSize: "17pt", fontFamily: "times" }}>Tel: {client && "+" + client.phone}</h6>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="table-responsive" style={{ overflow: "hidden", outline: "none" }} tabindex="0">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>№</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Bo'lim</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Navbat</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>
                                                Xizmat ko'rsatilganligi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sections && sections.map((section) => {
                                                k++
                                                price = price + (section.price)
                                                return (<tr>
                                                    <td style={{ fontSize: "15pt", fontFamily: "times" }}>{k}</td>
                                                    <td style={{ fontSize: "15pt", fontFamily: "times" }} className="text-start px-2">
                                                        {/* <span className=''>{section.name} </span> */}
                                                        <span className='text-uppercase fw-bold'>{section.subname}</span>
                                                    </td>
                                                    <td style={{ fontSize: "15pt", fontFamily: "times" }} className="text-center">
                                                        {section.bron === 'offline' ? section.turn : section.bronTime}

                                                    </td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center"><input type="checkbox" style={{ width: "20px", height: "20px" }} /></td>
                                                </tr>
                                                )

                                            })
                                        }
                                        {
                                            services && services.map((service) => {

                                                k++
                                                price = price + (service.price - service.priceCashier)
                                                return (<tr>
                                                    <td style={{ fontSize: "13pt", fontFamily: "times" }}>{k}</td>
                                                    <td style={{ fontSize: "13pt", fontFamily: "times" }} className="text-start px-2">{service.name} {service.type}</td>
                                                    <td style={{ fontSize: "13pt", fontFamily: "times" }} className="text-center">{service.pieces} (dona)</td>
                                                    <td style={{ fontSize: "13pt", fontFamily: "times" }} className="text-center">{service.price - service.priceCashier}</td>
                                                </tr>
                                                )

                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className=' fs-5'>
                                    Mijoz imzosi: ________________
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ border: "2px dashed black", margin: "50px 0" }} ></div>
                <div className="container px-5" >
                    <div className="row"  >
                        <table className="table ">
                            <tbody>
                                <tr>
                                    <td>
                                        <ul className="list-unstyled  text-start m-3">
                                            <li className="" style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }} > {logo && logo.companyname}</strong></li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Manzil: </strong> {logo && logo.address}</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Bank: </strong> {logo && logo.bank}</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}> <strong style={{ fontSize: "10pt", fontFamily: "times" }}>MFO: </strong> {logo && logo.mfo}</li>
                                            <li style={{ fontFamily: "times" }}> <h5 style={{ textAlign: "", fontSize: "10pt" }}> {today}</h5> </li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>INN:</strong> {logo && logo.inn}</li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Hisob raqam: </strong> {logo && logo.accountnumber}</li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Telefon raqam: </strong>
                                                {logo && logo.phone1 !== null ? "+" + logo.phone1 : ""} <br />
                                                {logo && logo.phone2 !== null ? "+" + logo.phone2 : ""} <br />
                                                {logo && logo.phone3 !== null ? "+" + logo.phone3 : ""} <br /></li>
                                        </ul>
                                    </td>
                                    <td className=''>
                                        <img className='me-3' width="200" src={logo && logo.logo} alt="logo" /><br />
                                        {
                                            connector && connector.probirka ?
                                                <h6
                                                    className='d-inline-block'
                                                    style={{ fontSize: "27pt", fontFamily: "times" }}>
                                                    NAMUNA: {connector && connector.probirka}
                                                </h6> :
                                                ""
                                        }
                                    </td>
                                    <td className="text-end">
                                        <img width="140" className='me-3 mt-4' src={qr && qr} alt="QR" /><br />
                                        <p className="pe-3 me-1" style={{ fontSize: "10pt" }}>Bu yerni skanerlang</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="invoice-from ps-4">
                                <h6 className='d-inline-block' style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "17pt" }} >ID: {client && client.id}</h6>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="invoice-from text-center">
                                <h6 className='d-inline-block' style={{ fontSize: "17pt", fontFamily: "times" }}>F.I.O: {client && client.lastname} {client && client.firstname} {client && client.fathername}</h6>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="invoice-from text-center">
                                <h6 className='d-inline-block' style={{ fontSize: "17pt", fontFamily: "times" }}>Yil: {client && new Date(client.born).toLocaleDateString()}</h6>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="invoice-from text-end pe-4">
                                <h6 className='d-inline-block' style={{ fontSize: "17pt", fontFamily: "times" }}>Tel: {client && "+" + client.phone}</h6>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="table-responsive" style={{ overflow: "hidden", outline: "none" }} tabindex="0">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>№</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Bo'lim</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Navbat</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>
                                                Xizmat ko'rsatilganligi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sections && sections.map((section) => {
                                                l++
                                                price = price + (section.price)
                                                return (<tr>
                                                    <td style={{ fontSize: "15pt", fontFamily: "times" }}>{l}</td>
                                                    <td style={{ fontSize: "15pt", fontFamily: "times" }} className="text-start px-2">
                                                        {/* <span className=''>{section.name} </span> */}
                                                        <span className='text-uppercase fw-bold'>{section.subname}</span>
                                                    </td>
                                                    <td style={{ fontSize: "15pt", fontFamily: "times" }} className="text-center">
                                                        {section.bron === 'offline' ? section.turn : section.bronTime}

                                                    </td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center"><input type="checkbox" style={{ width: "20px", height: "20px" }} /></td>
                                                </tr>
                                                )

                                            })
                                        }
                                        {
                                            services && services.map((service) => {
                                                l++
                                                price = price + (service.price - service.priceCashier)
                                                return (<tr>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }}>{l}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-start px-2">{service.name} {service.type}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{service.pieces} (dona)</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{service.price - service.priceCashier}</td>
                                                </tr>
                                                )

                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className=' fs-5 mb-5'>
                                    Mijoz imzosi: ________________
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center w-100" style={{ position: "fixed", bottom: "20px" }} >
                <button onClick={handlePrint} className="btn btn-primary px-5" >
                    Print
                </button>
            </div>
        </div >
    )
}
