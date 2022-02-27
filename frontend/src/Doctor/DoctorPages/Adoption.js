import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useHttp } from '../hooks/http.hook'
import { Print } from './Print'
import QRCode from 'qrcode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faSave } from "@fortawesome/free-solid-svg-icons"
import Select from "react-select"
import makeAnimated from "react-select/animated"
const animatedComponents = makeAnimated()

toast.configure()
export const Adoption = () => {
    let k = 0
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
    const [sectionFiles, setSectionFiles] = useState()

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

    const [templates, setTemplates] = useState()
    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor/section/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = []
            fetch.map((f) => {
                s.push({
                    label: f.section,
                    value: f.section,
                    template: f.template
                })
            })
            setTemplates(s)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, setTemplates])

    const getConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/doctorconnector/${auth.doctor.section}/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnector(fetch.connector)
            setSections(fetch.sections)
            setTableSections(fetch.tablesections)
            setTableColumns(fetch.tablecolumns)
            setSectionFiles(fetch.sectionFiles)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setTableColumns, connectorId, setConnector, setSections, setTableSections, setTableColumns, setSectionFiles])

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

    const changeTypeOptions = useCallback((event, index) => {
        let s = [...sections]
        event.map((e) => {
            s[index].summary = s[index].summary + e.template
        })
        setSections(s)
    }, [setSections, sections])

    const changeSectionaccept = useCallback((event, index) => {
        if (tablesections[index].length > 5) {
            let t = [...tablesections]
            t[index].map(tablesection => {
                tablesection.accept = event.target.checked
            })
            let s = [...sections]
            s[index].accept = event.target.checked
            setTableSections(t)
            setSections(s)
        } else {
            let s = [...sections]
            let t = [...tablesections]
            s.map((section, i) => {
                if (i >= index && section.name === s[index].name && tablesections[i].length <= 5) {
                    section.accept = event.target.checked
                    t[i].map(tablesection => {
                        tablesection.accept = event.target.checked
                    })
                }
            })
            setTableSections(t)
            setSections(s)
        }

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
            // history.push('/doctor')
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

    const [t, setT] = useState()

    useEffect(() => {
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }

        if (!t) {
            setT(1)
            getClient()
            getConnector()
            getTemplates()
            getBaseUrl()
            getLogo()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError, getTemplates, getBaseUrl, getLogo, getClient, setT])

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

    const uploadImage = useCallback(async (e, index, section) => {
        const files = e.target.files[0]
        const data = new FormData()
        data.append('file', files)
        data.append('upload_preset', "mv6ddmzc")
        const res = await fetch("https://api.cloudinary.com/v1_1/gemotest-uz/image/upload", { method: 'POST', body: data })
            // .then(() => )
            .catch(() => toast.error("Fayl yuklashda xatolik yuz berdi"))
        const file = await res.json()
        toast.success("Fayl muvaffaqqiyatli yuklandi")
        let f = [...sectionFiles]
        f[index].push({
            imageurl: file.secure_url,
            section: section._id,
            imageid: file.public_id
        })
        setSectionFiles(f)
    }, [setSectionFiles, sectionFiles, toast])

    const Delete = useCallback(async (f) => {
        const fetch = await request(`/api/file/${f._id}`, 'DELETE', null, {
            Authorization: `Bearer ${auth.token}`
        })
        toast.success(fetch.message)
        getConnector()
    }, [setSectionFiles, sectionFiles, toast, getConnector])

    const patchFiles = useCallback(async (index) => {
        try {
            const fetch = await request(`/api/file`, 'POST', [...sectionFiles[index]], {
                Authorization: `Bearer ${auth.token}`
            })
            toast.success(fetch.message)
            history.push(`/doctor/adoption/${clientId}/${connectorId}`)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, sectionFiles])

    const changeComment = (e) => {
        if (e.key === "Enter") {
            updateConnector()
        } else {
            setConnector({ ...connector, diagnosis: e.target.value })
        }
    }

    const updateConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector`, 'PATCH', { ...connector }, {
                Authorization: `Bearer ${auth.token}`
            })
            toast.success(fetch.message)
            getConnector()
        } catch (error) {
            notify(error.message)
        }

    }, [toast, getConnector, notify])


    return (
        <>
            <div className='d-none'>
                <div ref={componentRef} className="container p-4" style={{ fontFamily: "times" }}>
                    <Print doctor={auth.doctor} sectionFiles={sectionFiles} tablecolumns={tablecolumns} qr={qr} logo={logo} connector={connector} client={client} sections={sections} tablesections={tablesections} />
                </div>
            </div>
            <div className="container p-4" style={{ fontFamily: "times" }}>
                <div>
                    <div className="row" style={{ fontSize: "10pt" }}>
                        <div className="col-4" style={{ border: "1px solid", textAlign: "center" }}>
                            <p className='pt-2'>
                                O'zbekiston Respublikasi Sog'liqni Saqlash Vazirligi
                            </p>
                        </div>
                        <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                            <p className='pt-2'>
                                IFUD: 86900
                            </p>
                        </div>
                        <div className="col-4" style={{ border: "1px solid", textAlign: "center", borderLeft: "none" }}>
                            <p style={{ margin: "0" }}>
                                O'zbekiston Respublikasi SSV 31.12.2020y dagi №363 buyrug'i bilan tasdiqlangan
                            </p>
                        </div>
                    </div>
                    <div className="row" style={{ fontSize: "20pt" }}>
                        <div className="col-6 pt-2" style={{ textAlign: "center" }}>
                            <p className='pt-3' style={{ fontFamily: "-moz-initial" }}>
                                "GEMO-TEST" <br />
                                MARKAZIY LABORATORIYA
                            </p>
                        </div>
                        <div className="col-6" style={{ textAlign: "center" }}>
                            <p className='text-end m-0'>
                                <img width="120" src={qr && qr} alt="QR" />
                            </p>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-12" style={{ padding: "0" }}>
                            <table style={{ width: "100%", border: "2px solid", borderTop: "3px solid" }}>
                                <tr style={{ textAlign: "center" }}>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                        Mijozning F.I.SH
                                    </td>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                        <h4>{client && client.lastname + " " + client.firstname}</h4>
                                    </td>
                                    <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                        <p className='fw-bold fs-5 m-0'>
                                            TAHLIL <br /> NATIJALARI
                                        </p>
                                    </td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                        Tug'ilgan yili
                                    </td>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                        {client && new Date(client.born).toLocaleDateString()}
                                    </td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                        Telefon raqami
                                    </td>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                        +{client && client.phone}
                                    </td>
                                    <td className='p-0 fw-bold' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000" }}>
                                        Namuna
                                    </td>
                                    <td className='p-0' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                        {connector && connector.probirka}
                                    </td>
                                </tr>

                                <tr style={{ textAlign: "center" }}>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                        Sana
                                    </td>
                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                        {connector && new Date(connector.bronDay).toLocaleDateString()}
                                    </td>
                                    <td className='p-0 fw-bold' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000" }}>
                                        ID
                                    </td>
                                    <td className='p-0' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                        {client && client.id}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
                        <div className="col-4">
                            <p className='px-2 m-0'>
                                "GEMO-TEST" х/к
                            </p>
                        </div>
                        <div className="col-8">
                            <p className='px-2 m-0 text-end pr-5'>
                                Xizmatlar litsenziyalangan.   LITSENZIYA №21830906  03.09.2020. SSV RU
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">


                    {
                        sections && sections.map((section, index) => {
                            if (
                                tablesections && tablesections[index].length > 0 && section.probirka
                            ) {
                                return (
                                    <>
                                        <table style={{ width: "100%" }}>
                                            {
                                                (sections[index - 1] &&
                                                    sections[index - 1].name !== section.name) ||
                                                    index === 0 ||
                                                    tablesections[index - 1].length === 0 ||
                                                    tablesections[index].length > 5 ||
                                                    tablesections[index - 1].length > 5 ?
                                                    <>
                                                        <span className='d-none'>{k = 0}</span>
                                                        <tr>
                                                            <td className='text-center' colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                                {tablesections[index].length > 5 ? section.subname : section.name} <br /> {section.source.length > 2 ? "Natijalar e'lon qilingan kun: " + section.source : ""}
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
                                                    </>
                                                    : ""

                                            }
                                            {
                                                tablesections && tablesections[index].map((tablesection, key) => {
                                                    return (
                                                        <tr style={{ backgroundColor: "white" }}>
                                                            <td className='cn py-0' style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                {++k}
                                                            </td>
                                                            <td
                                                                className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])}
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    padding: "10px",
                                                                    borderTop: "0px solid white",
                                                                    textAlign: "right !important"
                                                                }}>
                                                                <p className='text-start m-0 py-0 ps-2 '>{tablesection.name}</p>
                                                            </td>
                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                <textarea
                                                                    rows={(tablesection.result).split("\n").length}
                                                                    style={{ border: "none" }}
                                                                    onChange={(event) => { changeResult(event, index, key) }}
                                                                    name='result'
                                                                    onKeyDown={
                                                                        (e) => {
                                                                            if (e.key === "ArrowDown" && tablesections[index][key + 1]) {
                                                                                document.getElementById(`result${index}-${key + 1}`).focus()
                                                                            }
                                                                            if (e.key === "ArrowUp" && key > 0) {
                                                                                document.getElementById(`result${index}-${key - 1}`).focus()
                                                                            }
                                                                            if (e.key === "ArrowUp" && key === 0 && tablesections[index - 1].length > 0) {
                                                                                document.getElementById(`result${index - 1}-${tablesections[index - 1].length - 1}`).focus()
                                                                            }
                                                                            if (e.key === "ArrowDown" && tablesections[index].length - 1 === key && tablesections[index + 1].length > 0) {
                                                                                document.getElementById(`result${index + 1}-${0}`).focus()
                                                                            }
                                                                        }}
                                                                    id={`result${index}-${key}`}
                                                                    className='form-control text-center fw-bold'
                                                                    defaultValue={tablesection.result}
                                                                >

                                                                </textarea>
                                                            </td>
                                                            <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                <textarea
                                                                    rows={(tablesection.norma).split("\n").length}
                                                                    style={{ border: "none" }}
                                                                    onChange={(event) => { changeNorma(event, index, key) }}
                                                                    name='norma' className='form-control text-center'
                                                                    defaultValue={tablesection.norma} >
                                                                </textarea>
                                                            </td>
                                                            {
                                                                tablecolumns && tablecolumns[index] && (tablecolumns[index].col4).length > 1 ?
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                        <textarea
                                                                            rows={(tablesection.additionalone).split("\n").length}
                                                                            style={{ border: "none" }}
                                                                            onChange={(event) => { changeAdditionalone(event, index, key) }}
                                                                            name='additionalone'
                                                                            className='form-control text-center'
                                                                            defaultValue={tablesection.additionalone}
                                                                        >

                                                                        </textarea>
                                                                    </td> : ""
                                                            }
                                                            {
                                                                tablecolumns && tablecolumns[index] && (tablecolumns[index].col5).length > 1 ?
                                                                    <td className={tablecolumns && tablecolumns[index] && checkClassFoot(tablecolumns[index])} style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                        <textarea
                                                                            rows={(tablesection.additionaltwo).split("\n").length}
                                                                            style={{ border: "none" }}
                                                                            onChange={(event) => { changeAdditionaltwo(event, index, key) }}
                                                                            name='additionaltwo' className='form-control text-center'
                                                                            defaultValue={tablesection.additionaltwo}>
                                                                        </textarea>
                                                                    </td> : ""
                                                            }
                                                            <td className='text-center px-2' style={{ border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                <input checked={tablesection.accept} onChange={(event) => changeAccept(event, index, key)} type="checkbox" style={{ width: "20px", height: "20px" }} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })

                                            }

                                        </table>
                                        <br />
                                        {/* {
                                            !section.probirka ?
                                                (
                                                    <table className='mt-4'>
                                                        <tr>
                                                            <td colSpan={3} className="text-uppercase">
                                                                {section.subname}
                                                            </td>
                                                        </tr>
                                                        <tr style={{ backgroundColor: "white" }}>
                                                            <th
                                                                className='w-25'
                                                                style={{ border: "1px solid #000", padding: "10px" }}
                                                            >
                                                                Xulosa <br />
                                                                <Select
                                                                    className=""
                                                                    onChange={(event) => changeTypeOptions(event, index)}
                                                                    closeMenuOnSelect={false}
                                                                    components={animatedComponents}
                                                                    options={templates && templates}
                                                                    isMulti
                                                                /> </th>
                                                            <td
                                                                style={{ border: "1px solid #000", padding: "10px" }}
                                                                className='p-0'
                                                            >
                                                                <textarea
                                                                    rows={(sections[index].summary).split("\n").length}
                                                                    value={sections[index].summary}
                                                                    onChange={(event) => { sectionSummary(event, index) }}
                                                                    className='form-control'
                                                                    style={{ border: "none", overflowY: "auto" }}
                                                                    placeholder='Xulosa'
                                                                    contentEditable>

                                                                </textarea>
                                                            </td>
                                                            <td rowSpan="2" className='text-center' style={{ border: "1px solid #000", padding: "10px" }}>
                                                                <input
                                                                    checked={section.accept}
                                                                    type="checkbox"
                                                                    style={{ width: "20px", height: "20px" }}
                                                                    onChange={(event) => sectionAccept(event, index)}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr style={{ backgroundColor: "white" }}>
                                                            <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                                            <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                                <textarea
                                                                    rows={(sections[index].comment).split("\n").length}
                                                                    defaultValue={sections[index].comment}
                                                                    onChange={(event) => { sectionComment(event, index) }}
                                                                    className='form-control' style={{ border: "none" }}
                                                                    placeholder='Xulosa' >

                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                ) : ""
                                        } */}
                                    </>
                                )
                            } else {
                                if (!section.probirka) {
                                    return <table className='mt-4'>
                                        <tr>
                                            <td colSpan={3} className="text-uppercase">
                                                {section.subname}
                                            </td>
                                        </tr>
                                        <tr style={{ backgroundColor: "white" }}>
                                            <th
                                                className='w-25'
                                                style={{ border: "1px solid #000", padding: "10px" }}
                                            >
                                                Xulosa <br />
                                                <Select
                                                    className=""
                                                    onChange={(event) => changeTypeOptions(event, index)}
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    options={templates && templates}
                                                    isMulti
                                                /> </th>
                                            <td
                                                style={{ border: "1px solid #000", padding: "10px" }}
                                                className='p-0'
                                            >
                                                <textarea
                                                    rows={(sections[index].summary).split("\n").length}
                                                    value={sections[index].summary}
                                                    onChange={(event) => { sectionSummary(event, index) }}
                                                    className='form-control'
                                                    style={{ border: "none", overflowY: "auto" }}
                                                    placeholder='Xulosa'
                                                    contentEditable>
                                                </textarea>
                                            </td>
                                            <td rowSpan="2" className='text-center' style={{ border: "1px solid #000", padding: "10px" }}>
                                                <input
                                                    checked={section.accept}
                                                    type="checkbox"
                                                    style={{ width: "20px", height: "20px" }}
                                                    onChange={(event) => sectionAccept(event, index)}
                                                />
                                            </td>
                                        </tr>
                                        <tr style={{ backgroundColor: "white" }}>
                                            <th style={{ border: "1px solid #000", padding: "10px" }}> Izoh </th>
                                            <td style={{ border: "1px solid #000", padding: "10px" }} className='p-0'>
                                                <textarea
                                                    defaultValue={sections[index].comment}
                                                    onChange={(event) => { sectionComment(event, index) }}
                                                    className='form-control' style={{ border: "none" }}
                                                    placeholder='Xulosa'
                                                    rows={(sections[index].comment).split("\n").length}
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </table>
                                }

                            }

                        })

                    }

                    <div className='py-3 fs-5'>
                        <span className='fw-bold me-4'>Qo'shimcha izoh: </span>
                        <input
                            defaultValue={connector && connector.diagnosis}
                            className='form-control w-75 d-inline-block me-2'
                            onChange={changeComment}
                            onKeyUp={changeComment}
                        />
                        <button
                            className='btn btn-info'
                            onClick={updateConnector}

                        > Saqlash</button>
                    </div>

                    {
                        sections && sections.map((section, index) => {
                            return (
                                <>
                                    <div className='row mt-4'>
                                        <div className='col-12 text-center border border-dark w-100 py-1'>
                                            {section.name + " " + section.subname}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div
                                            className='col-1 text-center w-100 py-1'
                                            style={{ border: "1px solid black", borderTop: "0" }}
                                        >
                                            <span className='d-inline-block mt-2'>Fayl</span>
                                        </div>
                                        <div
                                            className='col-8'
                                            style={{ border: "1px solid black", borderTop: "0", borderLeft: "0" }}
                                        >
                                            {
                                                sectionFiles && sectionFiles[index] && sectionFiles[index].map((file) => {
                                                    return (
                                                        <div className='row'>
                                                            <div className='col-10 p-3'>
                                                                <img className='m-auto' width="90%" src={file.imageurl} alt="result" />
                                                            </div>
                                                            <div className='col-2'>
                                                                <button
                                                                    onClick={() => { Delete(file) }}
                                                                    className='btn button-danger mt-3'
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })

                                            }
                                        </div>
                                        <div
                                            className='col-2 px-4'
                                            style={{ border: "1px solid black", borderTop: "0", borderLeft: "0" }}
                                        >
                                            <input
                                                onChange={(event) => uploadImage(event, index, section)}
                                                type="file"
                                                className='form-control mt-2'
                                            />
                                        </div>
                                        <div
                                            className='col-1 text-center py-2'
                                            style={{ border: "1px solid black", borderTop: "0", borderLeft: "0" }}
                                        >
                                            <button
                                                id={index} onClick={() => patchFiles(index)}
                                                className='btn btn-info'>
                                                <FontAwesomeIcon icon={faSave} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
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


