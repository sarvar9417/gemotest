import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { useReactToPrint } from 'react-to-print'
import QRCode from 'qrcode'

toast.configure()
export const ClientAllHistory = () => {

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const notify = (e) => {
        toast.error(e);
    };
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()

    const clientId = useParams().id
    const [client, setClient] = useState()
    const [connectors, setConnectors] = useState()
    const [allsections, setAllSections] = useState()
    const [alltablesections, setAllTableSections] = useState()
    const [alltablecolumns, setAllTableColumns] = useState()

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/doctor/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setClient, clientId])

    const getConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/clientallhistory/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnectors(fetch.connectors)
            setAllSections(fetch.allsections)
            setAllTableSections(fetch.alltablesections)
            setAllTableColumns(fetch.alltablecolumns)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setConnectors, setAllSections, setAllTableSections, setAllTableColumns])

    const [logo, setLogo] = useState()
    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null)
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [request, setLogo])

    const [qr, setQr] = useState()
    const [baseUrl, setBasuUrl] = useState()
    const getBaseUrl = useCallback(async () => {
        try {
            const fetch = await request(`/api/clienthistorys/url`, 'GET', null)
            setBasuUrl(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, setBasuUrl])

    useEffect(() => {
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }
        if (!baseUrl) {
            getBaseUrl()
        }
        if (!client) {
            getClient()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!connectors) {
            getConnectors()
        }
        if (!logo) {
            getLogo()
        }
    }, [notify, clearError])

    const checkClassHead = (data) => {
        if (data.col5.length > 1) {
            return "text-center fw-bold cw18"
        }
        if (data.col4.length > 1) {
            return "text-center fw-bold   cw22"
        }
        return "text-center fw-bold  cw30"
    }

    const checkClassFoot = (data) => {
        if (data.col5.length > 1) {
            return "text-center cw18"
        }
        if (data.col4.length > 1) {
            return "text-center  cw22"
        }
        return "text-center cw30"
    }

    return (
        <div>
            <div className='row'>
                <div className='col-12 text-center my-4' >
                    <button onClick={handlePrint} className="btn btn-info px-5" >
                        Chop etish / Saqlash
                    </button>
                </div>
            </div>
            <div ref={componentRef} className="container" style={{ fontFamily: "times" }}>
                {
                    connectors && connectors.map((connector, i) => {
                        return (
                            <div style={{ minHeight: "100vh", pageBreakAfter: "always" }} className='p-4'>
                                <div className="row" style={{ fontSize: "10pt" }}>
                                    <div className="col-6" style={{ border: "1px solid", textAlign: "center" }}>
                                        <p className='pt-2'>
                                            O'zbekiston Respublikasi Sog'liqni Saqlash Vazirligi
                                        </p>
                                    </div>
                                    <div className="col-2" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                                        <p className='pt-2'>
                                            ОКED 86900
                                        </p>
                                    </div>
                                    <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                                        <p style={{ margin: "0" }}>
                                            O'zbekiston Respublikasi SSV 31.12.2020y dagi №363 buyrug'i bilan tasdiqlangan
                                        </p>
                                    </div>
                                </div>
                                <div className="row" style={{ fontSize: "20pt" }}>
                                    <div className="col-3 pt-3">
                                        <img width="200" src={logo && logo.logo} alt='Logo' />
                                    </div>
                                    <div className="col-6 pt-2" style={{ textAlign: "center" }}>
                                        <p className='pt-4' style={{ fontFamily: "-moz-initial" }}>
                                            "GEMO-TEST" <br />
                                            MARKAZIY LABARATORIYA
                                        </p>
                                    </div>
                                    <div className="col-3" style={{ textAlign: "center" }}>
                                        <p className='text-end m-0'>
                                            <img width="140" src={qr && qr} alt="QR" />
                                        </p>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-12" style={{ padding: "0" }}>
                                        <table style={{ width: "100%", border: "2px solid", borderTop: "3px solid" }}>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-1' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                                    Mijozning F.I.SH
                                                </td>
                                                <td className='p-0 py-1' style={{ width: "33%", border: "1px solid #000" }}>
                                                    <h4>{client && client.lastname + " " + client.firstname}</h4>
                                                </td>
                                                <td rowSpan="3" style={{ width: "33%" }}>
                                                    <p className='fw-bold fs-4'>
                                                        TAHLIL <br /> NATIJALARI
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                                    Tug'ilgan yili
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "33%", border: "1px solid #000", fontSize: "20px" }}>
                                                    {client && new Date(client.born).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            <tr style={{ textAlign: "center" }}>
                                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                                    Sana
                                                </td>
                                                <td className='p-0 py-2' style={{ width: "33%", border: "1px solid #000", fontSize: "20px" }}>
                                                    {connector && new Date(connector.bronDay).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
                                    <div className="col-1">

                                    </div>
                                    <div className="col-4">
                                        <p className='p-2 m-0'>
                                            "GEMO-TEST" х/к
                                        </p>
                                    </div>
                                    <div className="col-7">
                                        <p className='p-2 m-0 text-end pr-5'>
                                            Xizmatlar litsenziyalangan.   LITSENZIYA №21830906  03.09.2020. SSV RU
                                        </p>
                                    </div>
                                </div>
                                <div className="row">

                                    {
                                        allsections && allsections[i].map((section, index) => {
                                            if (section.accept) {
                                                if (
                                                    alltablesections && alltablesections[i][index].length > 0
                                                ) {
                                                    return (
                                                        <div className='p-0 '>
                                                            <table className='w-100' >
                                                                <tr>
                                                                    <td colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                                        {section.name + " " + section.subname}
                                                                    </td>

                                                                </tr>
                                                                <tr style={{ backgroundColor: "#C0C0C0" }}>
                                                                    <td className='text-center fw-bold cn' style={{ border: "1px solid #000" }}>
                                                                        №
                                                                    </td>
                                                                    <td className={alltablecolumns && alltablecolumns[i][index] && checkClassHead(alltablecolumns[i][index])} style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                                        {alltablecolumns && alltablecolumns[i][index] && alltablecolumns[i][index].col1}
                                                                    </td>
                                                                    <td className={alltablecolumns && alltablecolumns[i][index] && checkClassHead(alltablecolumns[i][index])} style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                                        {alltablecolumns && alltablecolumns[i][index] && alltablecolumns[i][index].col2}
                                                                    </td>
                                                                    <td className={alltablecolumns && alltablecolumns[i][index] && checkClassHead(alltablecolumns[i][index])} style={{ border: "1px solid #000", maxWidth: "33%", minWidth: "19%" }}>
                                                                        {alltablecolumns && alltablecolumns[i][index] && alltablecolumns[i][index].col3}
                                                                    </td>
                                                                    {
                                                                        alltablecolumns && alltablecolumns[i][index] && (alltablecolumns[i][index].col4).length > 1 ?
                                                                            <td className={alltablecolumns && alltablecolumns[i][index] && checkClassHead(alltablecolumns[i][index])} style={{ border: "1px solid #000" }}>
                                                                                {alltablecolumns[i][index].col4}
                                                                            </td> : ""
                                                                    }
                                                                    {
                                                                        alltablecolumns && alltablecolumns[i][index] && (alltablecolumns[i][index].col5).length > 1 ?
                                                                            <td className={alltablecolumns && alltablecolumns[i][index] && checkClassHead(alltablecolumns[i][index])} style={{ border: "1px solid #000" }}>
                                                                                {alltablecolumns[i][index].col5}
                                                                            </td> : ""
                                                                    }
                                                                </tr>
                                                                {
                                                                    alltablesections && alltablesections[i][index].map((tablesection, key) => {
                                                                        return (
                                                                            <tr style={{ backgroundColor: "white" }}>
                                                                                <td style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                    {key + 1}
                                                                                </td>
                                                                                <td className={alltablecolumns && alltablecolumns[i][index] && checkClassFoot(alltablecolumns[i][index])} style={{ border: "1px solid #000", padding: "10px" }}>
                                                                                    {tablesection.name}
                                                                                </td>
                                                                                <td className={alltablecolumns && alltablecolumns[i][index] && checkClassFoot(alltablecolumns[i][index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                    {tablesection.result}
                                                                                </td>
                                                                                <td className={alltablecolumns && alltablecolumns[i][index] && checkClassFoot(alltablecolumns[i][index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                    {tablesection.norma}
                                                                                </td>
                                                                                {
                                                                                    alltablecolumns && alltablecolumns[i][index] && (alltablecolumns[i][index].col4).length > 1 ?
                                                                                        <td className={alltablecolumns && alltablecolumns[i][index] && checkClassFoot(alltablecolumns[i][index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                            {tablesection.additionalone}
                                                                                        </td> : ""
                                                                                }
                                                                                {
                                                                                    alltablecolumns && alltablecolumns[i][index] && (alltablecolumns[i][index].col5).length > 1 ?
                                                                                        <td className={alltablecolumns && alltablecolumns[i][index] && checkClassFoot(alltablecolumns[i][index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                                            {tablesection.additionaltwo}
                                                                                        </td> : ""
                                                                                }
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </table>
                                                            <br />
                                                            {
                                                                !section.probirka ?
                                                                    (<table style={{ width: "100%" }}>
                                                                        <tr style={{ backgroundColor: "white" }}>
                                                                            <th style={{ border: "1px solid #000", padding: "10px", width: "100px" }} > Xulosa </th>
                                                                            <td style={{ border: "1px solid #000", padding: "10px" }} colSpan="5" className='px-2'>
                                                                                {section.summary}
                                                                            </td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "white" }}>
                                                                            <th style={{ border: "1px solid #000", padding: "10px", width: "200px" }}> Izoh </th>
                                                                            <td style={{ border: "1px solid #000", padding: "10px" }} className='px-2'>
                                                                                {section.comment}
                                                                            </td>
                                                                        </tr></table>) : ""
                                                            }
                                                        </div>
                                                    )
                                                } else {
                                                    if (!section.probirka) {
                                                        return (
                                                            <table>
                                                                <tr style={{ backgroundColor: "white" }}>
                                                                    <td colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                                        {section.name + " " + section.subname}
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "white" }}>
                                                                    <th style={{ border: "1px solid #000", padding: "10px", width: "100px" }} > Xulosa </th>
                                                                    <td style={{ border: "1px solid #000", padding: "10px" }} className='p-2'>
                                                                        {section.summary}
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "white" }}>
                                                                    <th style={{ border: "1px solid #000", padding: "10px", width: "100px" }}> Izoh </th>
                                                                    <td style={{ border: "1px solid #000", padding: "10px" }} className='p-2'>
                                                                        {section.comment}
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        )
                                                    }
                                                }
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
