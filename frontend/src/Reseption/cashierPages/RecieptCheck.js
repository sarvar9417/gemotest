import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'
import QRCode from 'qrcode'

toast.configure()
export const RecieptCheck = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const clientId = useParams().id
    const connectorId = useParams().connector
    const today = (new Date().getDate().toString() + "." + (new Date().getMonth() + 1).toString() + "." + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString())

    let unpaid = 0
    let paid = 0
    let price = 0
    let k = 0
    let l = 0
    const [client, setClient] = useState()
    const { loading, request, error, clearError } = useHttp()
    const [sections, setSections] = useState()

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
            // window.location.reload()
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
    const [oldPayments, setOldPayments] = useState()

    const getOldPayments = useCallback(async () => {
        try {
            const fetch = await request(`/api/payment/cashier/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let sum = fetch.reduce((summ, payment) => {
                return summ + payment.cash + payment.card + payment.transfer
            }, 0)
            setOldPayments(sum)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setOldPayments])
    const [sale, setSale] = useState()
    const getSale = useCallback(async () => {
        try {
            const fetch = await request(`/api/sale/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSale(fetch[0])
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setSale, connectorId])
    const [qr, setQr] = useState()

    const [t, setT] = useState()
    useEffect(() => {
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!t) {
            setT(1)
            getSections()
            getServices()
            getClient()
            getOldPayments()
            getSale()
            getLogo()
            getBaseUrl()
        }
    }, [QRCode, t, client, error, clearError, getSale, setT, getLogo, getSections, getServices, getBaseUrl, getClient, getOldPayments])

    if (loading) {
        return <Loader />
    }


    return (
        <div style={{ width: "110mm", margin: "0 auto" }} >
            <div ref={componentRef}  >
                <div style={{ width: "108mm", fontFamily: "monospace", fontSize: "10pt" }} className='px-3'>
                    {/* <div className='text-center'>
                        <img src={logo && logo.logo} width="250px" />
                    </div> */}
                    <div className='row'>
                        <div className='col-12 text-center border-bottom border-dark'>
                            {logo && logo.companyname}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            {new Date().toLocaleString()}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            Manzil:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {logo && logo.address}
                        </div>
                    </div>
                    <div className='row border-bottom'>
                        <div className='col-6'>
                            Telefon:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            +{logo && logo.phone1}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            Bank:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {logo && logo.bank}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            MFO:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {logo && logo.mfo}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            INN:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {logo && logo.inn}
                        </div>
                    </div>
                    <div className='row border-bottom'>
                        <div className='col-6'>
                            Hisob raqam:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {logo && logo.accountnumber}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            F.I.O:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {client && client.lastname} {client && client.firstname} {client && client.fathername}
                        </div>
                    </div>
                    <div className='row border-bottom border-dark'>
                        <div className='col-6'>
                            ID:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {client && client.id}
                        </div>
                    </div>
                    <div className='row fs-6 '>
                        <div className='col-6'>
                            To'lov summasi:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {(sections && sections.reduce((summ, section) => {
                                return summ + section.priceCashier
                            }, 0)) + (services && services.reduce((summ, service) => {
                                return summ + service.priceCashier
                            }, 0))} so'm
                        </div>
                    </div>
                    <div className='row fs-6'>
                        <div className='col-6'>
                            Chegirma:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {sale && sale.summa} so'm
                        </div>
                    </div>
                    <div className='row fs-6'>
                        <div className='col-6'>
                            To'langan summa:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {oldPayments && oldPayments} so'm
                        </div>
                    </div>
                    <div className='row fs-6 mb-5'>
                        <div className='col-6'>
                            Qarz summa:
                        </div>
                        <div className='col-6 text-end fw-bold'>
                            {(sections && sections.reduce((summ, section) => {
                                return summ + section.priceCashier
                            }, 0)) + (services && services.reduce((summ, service) => {
                                return summ + service.priceCashier
                            }, 0)) - oldPayments - (sale && sale.summa)} so'm
                        </div>
                    </div>
                    <div style={{ border: "1px  dashed black", marginTop: "100px" }}>
                    </div>
                    <div style={{ border: "1px  dashed black", marginTop: "100px" }}>
                    </div>
                </div>
            </div>
            <div className="" style={{ position: "fixed", bottom: "20px", width: "110mm" }} >
                <div className="row w-100">
                    <div className=" col-12 text-center">
                        <button onClick={handlePrint} className="btn btn-primary px-5" >
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
