import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useHttp } from '../hooks/http.hook'
import { Print } from './Print'
import QRCode from 'qrcode'

toast.configure()
export const Adoption = () => {
    const history = useHistory()
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const notify = (e) => {
        toast.error(e);
    };
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()

    const clientId = useParams().clientid
    const connectorId = useParams().connectorid
    const [client, setClient] = useState()
    const [connector, setConnector] = useState()
    const [sections, setSections] = useState()
    const [tablesections, setTableSections] = useState()
    const [tablecolumns, setTableColumns] = useState()

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

    const getConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/doctorconnector/${auth.doctor.section}/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnector(fetch.connector)
            setSections(fetch.sections)
            setTableSections(fetch.tablesections)
            setTableColumns(fetch.tablecolumns)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setTableColumns, connectorId, setConnector, setSections, setTableSections, setTableColumns])

    const changeNorma = (event, index, key) => {
        let t = [...tablesections]
        t[index][key].norma = event.target.value
        setTableSections(t)
    }
    const changeResult = (event, index, key) => {
        let t = [...tablesections]
        t[index][key].result = event.target.value
        setTableSections(t)
    }
    const changeAdditionalone = (event, index, key) => {
        let t = [...tablesections]
        t[index][key].additionalone = event.target.value
        setTableSections(t)
    }

    const changeAdditionaltwo = (event, index, key) => {
        let t = [...tablesections]
        t[index][key].additionaltwo = event.target.value
        setTableSections(t)
    }

    const changeAccept = useCallback((event, index, key) => {
        let t = [...tablesections]
        t[index][key].accept = event.target.checked
        let b = true
        t[index].map(tablesection => {
            if (!tablesection.accept) {
                b = false
            }
        })
        if (b) {
            let s = [...sections]
            s[index].accept = true
            setSections(s)
        } else {
            let s = [...sections]
            s[index].accept = false
            setSections(s)
        }
        setTableSections(t)

    }, [sections, setSections, setTableSections, tablesections])

    const changeSectionaccept = useCallback((event, index) => {
        let t = [...tablesections]
        t[index].map(tablesection => {
            tablesection.accept = event.target.checked
        })
        let s = [...sections]
        s[index].accept = event.target.checked
        setTableSections(t)
        setSections(s)
    }, [sections, setSections, setTableSections, tablesections])

    const sectionAccept = useCallback((event, index) => {
        let s = [...sections]
        s[index].accept = event.target.checked
        setSections(s)
    }, [sections, setSections])

    const sectionSummary = useCallback((event, index) => {
        let s = [...sections]
        s[index].summary = event.target.value
        setSections(s)
    }, [sections, setSections])

    const sectionComment = useCallback((event, index) => {
        let s = [...sections]
        s[index].comment = event.target.value
        setSections(s)
    }, [sections, setSections])

    const patchData = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctor`, 'PATCH', { sections: [...sections], tablesections: [...tablesections] }, {
                Authorization: `Bearer ${auth.token}`
            })
            toast.success(fetch.message)
            history.push('/doctor')
        } catch (e) {
            notify(e)
        }
    }, [request, auth, sections, tablesections, toast])


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
        if (!client) {
            getClient()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!connector) {
            getConnector()
        }
        if (!logo) {
            getLogo()
        }
        if (!baseUrl) {
            getBaseUrl()
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
        <>
            <div className='d-none'>
                <div ref={componentRef} className="container p-4" style={{ fontFamily: "times" }}>
                    <Print tablecolumns={tablecolumns} qr={qr} logo={logo} connector={connector} client={client} sections={sections} tablesections={tablesections} />
                </div>
            </div>
            <div className="container p-4" style={{ fontFamily: "times" }}>
                <div className="row" style={{ fontSize: "10pt" }}>
                    <div className="col-6" style={{ border: "1px solid", textAlign: "center" }}>
                        <p className='pt-2'>
                            O'zbekiston Respublikasi Sog'liqni Saqlash Vazirligi
                        </p>
                    </div>
                    <div className="col-2" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                        <p>
                            ОКED 86900
                        </p>
                    </div>
                    <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                        <p style={{ margin: "0" }}>
                            O'zbekiston Respublikasi SSV 31.12.2020 dagi №363 buyrug'i bilan tasdiqlangan
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
                                    <p className='fw-bold'>
                                        ANALIZ NATIJALARI
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
                                    Murojaat vaqti
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
                        <p className='p-2 m-0'>
                            Xizmatlar litsenziyalangan   ЛИЦЕНЗИЯ №01419  от 28.02.2019г. МинЗдрав Ру
                        </p>
                    </div>
                </div>
                <div className="row">

                    {
                        sections && sections.map((section, index) => {
                            if (
                                tablesections && tablesections[index].length > 0
                            ) {
                                return (
                                    <div className='p-0'>
                                        <table style={{ width: "100%" }}>
                                            <tr>
                                                <td colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                    {section.name + " " + section.subname}
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: "#C0C0C0" }}>
                                                <td className='text-center fw-bold cn' style={{ border: "1px solid #000" }}>
                                                    №
                                                </td>
                                                <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                    {tablecolumns && tablecolumns[index] && tablecolumns[index].col1}
                                                </td>
                                                <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                    {tablecolumns && tablecolumns[index] && tablecolumns[index].col2}
                                                </td>
                                                <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                    {tablecolumns && tablecolumns[index] && tablecolumns[index].col3}
                                                </td>
                                                {
                                                    tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                        <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                            {tablecolumns[index].col4}
                                                        </td> : ""
                                                }
                                                {
                                                    tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                        <td className={tablecolumns && tablecolumns[index] && checkClassHead(tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                            {tablecolumns[index].col5}
                                                        </td> : ""
                                                }
                                                <td className='text-center px-2' style={{ border: "1px solid #000" }}>
                                                    <input checked={section.accept} onChange={(event) => changeSectionaccept(event, index)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                </td>
                                            </tr>
                                            {
                                                tablesections && tablesections[index].map((tablesection, key) => {
                                                    return (
                                                        <tr style={{ backgroundColor: "white" }}>
                                                            <td className='cn' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                {key + 1}
                                                            </td>
                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ border: "1px solid #000", padding: "10px" }}>
                                                                {tablesection.name}
                                                            </td>
                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                <textarea style={{ border: "none" }} onChange={(event) => { changeResult(event, index, key) }} name='result' className='form-control text-center' defaultValue={tablesection.result}></textarea>
                                                            </td>
                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                <textarea style={{ border: "none" }} onChange={(event) => { changeNorma(event, index, key) }} name='norma' className='form-control text-center' defaultValue={tablesection.norma} ></textarea>
                                                            </td>
                                                            {
                                                                tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                        <textarea style={{ border: "none" }} onChange={(event) => { changeAdditionalone(event, index, key) }} name='additionalone' className='form-control text-center' defaultValue={tablesection.additionalone}></textarea>
                                                                    </td> : ""
                                                            }
                                                            {
                                                                tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                        <textarea style={{ border: "none" }} onChange={(event) => { changeAdditionaltwo(event, index, key) }} name='additionaltwo' className='form-control text-center' defaultValue={tablesection.additionaltwo}></textarea>
                                                                    </td> : ""
                                                            }
                                                            <td className='text-center px-2' style={{ border: "1px solid #000" }}>
                                                                <input checked={tablesection.accept} onChange={(event) => changeAccept(event, index, key)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                            </td>
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
                                                        <th style={{ border: "1px solid #000", padding: "10px" }} > Xulosa </th>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }} colSpan="5">
                                                            <textarea defaultValue={section.summary} onChange={(event) => { sectionSummary(event, index) }} className='form-control text-center' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
                                                        </td>
                                                        <td rowSpan="2" className='text-center' style={{ border: "1px solid #000", padding: "10px" }}>
                                                            <input checked={section.accept} onChange={(event) => sectionAccept(event, index)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                        </td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: "white" }}>
                                                        <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }}>
                                                            <textarea defaultValue={section.comment} onChange={(event) => { sectionComment(event, index) }} className='form-control text-center' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
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
                                                <th style={{ border: "1px solid #000", padding: "10px" }} > Xulosa </th>
                                                <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                    <textarea defaultValue={section.summary} onChange={(event) => { sectionSummary(event, index) }} className='form-control text-center' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
                                                </td>
                                                <td rowSpan="2" className='text-center' style={{ border: "1px solid #000", padding: "10px" }}>
                                                    <input checked={section.accept} onChange={(event) => sectionAccept(event, index)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: "white" }}>
                                                <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                                <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                    <textarea defaultValue={section.comment} onChange={(event) => { sectionComment(event, index) }} className='form-control text-center' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
                                                </td>
                                            </tr>
                                        </table>
                                    )
                                }
                            }

                        })

                    }

                </div>
                <div className='row'>
                    <div className='col-12 text-center my-4' >
                        <button onClick={patchData} className='btn btn-success px-4 mx-4'> Tasdiqlash</button>
                        <button onClick={handlePrint} className="btn btn-info px-5" >
                            Chop etish
                        </button>
                    </div>
                </div>
            </div>



        </>
    )
}


