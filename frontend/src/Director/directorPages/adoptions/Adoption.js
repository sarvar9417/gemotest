import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { useHttp } from '../../hooks/http.hook'
import { Print } from './Print'
import QRCode from 'qrcode'

toast.configure()
export const Adoption = () => {
    const [checkall, setCheckall] = useState(false)
    const [modal, setModal] = useState(false)
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
            const fetch = await request(`/api/connector/directorconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnector(fetch.connector)
            setSections(fetch.sections)
            setTableSections(fetch.tablesections)
            let k = true
            let s = [...fetch.sections]
            for (let i = 0; i < s.length; i++) {
                if (s[i].done === "tasdiqlanmagan") {
                    k = false
                }
            }
            setCheckall(k)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId, setConnector, setSections, setTableSections, setCheckall])

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
            history.push('/director/clients')
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



    const AdoptionAll = useCallback((event) => {
        if (event.target.checked) {
            let sectionss = [...sections]
            sectionss.map((section) => {
                section.done = "tasdiqlangan"
            })
            setSections(sectionss)
            setCheckall(true)
        } else {
            let sectionss = [...sections]
            sectionss.map((section) => {
                section.done = "tasdiqlanmagan"
            })
            setSections(sectionss)
            setCheckall(false)
        }
    }, [setSections, sections, setCheckall])

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
        if (!connector) {
            getConnector()
        }
        if (!logo) {
            getLogo()
        }
    }, [notify, clearError])

    return (
        <>
            <div className='d-none'>
                <div ref={componentRef} className="container p-4" style={{ fontFamily: "times" }}>
                    <Print qr={qr && qr} logo={logo} connector={connector} client={client} sections={sections} tablesections={tablesections} />
                </div>
            </div>
            <div className="container p-4" style={{ fontFamily: "times" }}>
                <div className="row" style={{ fontSize: "10pt" }}>
                    <div className="col-6" style={{ border: "1px solid", textAlign: "center" }}>
                        <p>
                            Министерство Здравоохранения Республики Узбекистан
                        </p>
                    </div>
                    <div className="col-2" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                        <p>
                            ОКОНХ  91514
                        </p>
                    </div>
                    <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                        <p style={{ margin: "0" }}>
                            Форма №     согласно приказу
                        </p>
                        <p style={{ margin: "0" }}>
                            МинЗдрав.РУз №777 от 25.12.2017г.
                        </p>
                    </div>
                </div>
                <div className="row" style={{ fontSize: "20pt" }}>
                    <div className="col-6" style={{ textAlign: "center" }}>
                        <p className='pt-5'>
                            "GEMOTEST"  LABORATORIYA
                        </p>
                    </div>
                    <div className="col-2">

                    </div>
                    <div className="col-4" style={{ textAlign: "center" }}>
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
                                    Ф.И.О. больного
                                </td>
                                <td className='p-0 py-1' style={{ width: "33%", border: "1px solid #000" }}>
                                    <h4>{client && client.lastname + " " + client.firstname}</h4>
                                </td>
                                <td rowSpan="3" style={{ width: "33%" }}>
                                    <p>
                                        <img width="200" src={logo && logo.logo} alt='Logo' />
                                    </p>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                    Год рождения
                                </td>
                                <td className='p-0 py-2' style={{ width: "33%", border: "1px solid #000", fontSize: "20px" }}>
                                    {client && new Date(client.born).toLocaleDateString()}
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td className='p-0 py-2' style={{ width: "33%", backgroundColor: "#808080", color: "#fff", border: "1px solid #000" }}>
                                    Дата
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
                        <p>
                            "GEMO-TEST" х/к
                        </p>
                    </div>
                    <div className="col-7">
                        <p>
                            Услуги лицензированны   ЛИЦЕНЗИЯ №01419  от 28.02.2019г. МинЗдрав Ру
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
                                                <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                    №
                                                </td>
                                                <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                    Показатели
                                                </td>
                                                <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                    Результат
                                                </td>
                                                <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                    Референтные значения
                                                </td>
                                                {
                                                    tablesections && (tablesections[index][0].additionalone).length > 1 ?
                                                        <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                            Референтные значения
                                                        </td> : ""
                                                }
                                                {
                                                    tablesections && (tablesections[index][0].additionaltwo).length > 1 ?
                                                        <td className='text-center fw-bold' style={{ border: "1px solid #000" }}>
                                                            Референтные значения
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
                                                            <td style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                {key + 1}
                                                            </td>
                                                            <td className='px-3' style={{ border: "1px solid #000", padding: "10px" }}>
                                                                {tablesection.name}
                                                            </td>
                                                            <td className='p-0' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                <textarea style={{ border: "none" }} onChange={(event) => { changeNorma(event, index, key) }} name='norma' className='form-control text-center' defaultValue={tablesection.norma} ></textarea>
                                                            </td>
                                                            <td className='p-0' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                <textarea style={{ border: "none" }} onChange={(event) => { changeResult(event, index, key) }} name='result' className='form-control text-center' defaultValue={tablesection.result}></textarea>
                                                            </td>
                                                            {
                                                                tablesection.additionalone !== " " ?
                                                                    <td className='p-0' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                        <textarea style={{ border: "none" }} onChange={(event) => { changeAdditionalone(event, index, key) }} name='additionalone' className='form-control  text-center' defaultValue={tablesection.additionalone}></textarea>
                                                                    </td> : ""
                                                            }
                                                            {
                                                                tablesection.additionaltwo !== " " ?
                                                                    <td className='p-0' style={{ textAlign: "center", border: "1px solid #000" }}>
                                                                        <textarea style={{ border: "none" }} onChange={(event) => { changeAdditionaltwo(event, index, key) }} name='additionaltwo' className='form-control  text-center' defaultValue={tablesection.additionaltwo}></textarea>
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
                                                            <textarea defaultValue={section.summary} onChange={(event) => { sectionSummary(event, index) }} className='form-control ' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
                                                        </td>
                                                        <td rowSpan="2" className='text-center' style={{ border: "1px solid #000", padding: "10px" }}>
                                                            <input checked={section.accept} onChange={(event) => sectionAccept(event, index)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                        </td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: "white" }}>
                                                        <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }}>
                                                            <textarea defaultValue={section.comment} onChange={(event) => { sectionComment(event, index) }} className='form-control' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
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
                                                    <textarea defaultValue={section.summary} onChange={(event) => { sectionSummary(event, index) }} className='form-control' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
                                                </td>
                                                <td rowSpan="2" className='text-center' style={{ border: "1px solid #000", padding: "10px" }}>
                                                    <input checked={section.accept} onChange={(event) => sectionAccept(event, index)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: "white" }}>
                                                <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                                <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                    <textarea defaultValue={section.comment} onChange={(event) => { sectionComment(event, index) }} className='form-control' style={{ border: "none" }} placeholder='Xulosa' ></textarea>
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
                        <label htmlFor='tasdiqlash' className='btn btn-warning m-0'>
                            <input onChange={AdoptionAll} checked={checkall} className='mx-2' type="checkbox" id='tasdiqlash' style={{ width: "15px", height: "15px" }} />
                            Tasdiqlash
                        </label>
                        <button onClick={() => { setModal(true); window.scrollTo({ top: 0 }) }} className='btn btn-success px-4 mx-4'>
                            Saqlash
                        </button>
                        <button onClick={handlePrint} className="btn btn-info px-5" >
                            Chop etish
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="" >
                        <div className="card" style={{ maxWidth: "700px" }} >
                            <div className='card-body text-danger '>
                                <h3 className='text-center'>Diqqat! <br />
                                    Barcha o'zgarishlar to'g'ri kiritilganligini tasdiqlaysizmi?</h3>
                            </div>
                            <div className='card-footer text-center'>
                                <button onClick={patchData} className='btn button-success mx-3' > Tasdiqlash </button>
                                <button onClick={() => setModal(false)} className='btn button-danger' > Qaytish </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

