import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { useReactToPrint } from 'react-to-print'
import DatePicker from "react-datepicker"
import QRCode from 'qrcode'

toast.configure()
export const AllClients = () => {
    const [modal, setModal] = useState(false)
    let k = 0
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const notify = (e) => {
        toast.error(e)
    }

    const auth = useContext(AuthContext)

    const { loading, request, error, clearError } = useHttp()
    // const clientId = useParams().id
    const [all, setAll] = useState()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const getAll = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/allresults/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate])


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
    const searchDate = () => {
        getAll()
    }

    const [t, setT] = useState()
    const [q, setQ] = useState()

    useEffect(() => {
        if (!t) {
            setT(1)
            getAll()
            getBaseUrl()
            getLogo()
        }
        if (all) {
            QRCode.toDataURL(`gemo-test.uz`)
                .then(data => {
                    setQr(data)
                })
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError, setT, getAll])

    const checkClassHead = (data) => {
        if (data.col5.length > 1) {
            return "text-center fw-bold cw18 py-0"
        }
        if (data.col4.length > 1) {
            return "text-center fw-bold   cw22 py-0"
        }
        return "text-center fw-bold  cw30 py-0"
    }

    const checkClassFoot = (data) => {
        if (data.col5.length > 1) {
            return "text-center cw18 py-0"
        }
        if (data.col4.length > 1) {
            return "text-center  cw22 py-0"
        }
        return "text-center cw30 py-0"
    }

    const Delete =
        useCallback(async () => {
            try {
                const data = await request("/api/tozalash", "DELETE", null, {
                    Authorization: `Bearer ${auth.token}`
                })
                toast.success("Barcha ma'lumotlar o'chirib yuborildi")
            } catch (e) {
                notify(e)
            }
        }, [request, toast, auth])


    return (
        <div>
            <div className="row mb-3">
                <div className=" col-2">
                    <DatePicker className="form-control mb-2" selected={startDate} onChange={(date) => { setStartDate(date) }} />
                </div>
                <div className="col-2">
                    <DatePicker className="form-control mb-2" selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div className="col-1">
                    <button onClick={searchDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}> <FontAwesomeIcon icon={faSearch} /> </button>
                </div>
                <div className='col-5 text-center' >
                    <button onClick={handlePrint} className="btn btn-info px-5" >
                        Chop etish / Saqlash
                    </button>
                </div>

                <div className="col-2">
                    <button
                        onClick={() => setModal(true)}
                        className="btn text-white mb-2 btn-danger"
                    >
                        O'chirish
                    </button>
                </div>
            </div>

            <div ref={componentRef} className="container" style={{ fontFamily: "times" }}>
                {
                    all && all.map((customer, i) => {
                        return (
                            <div style={{ pageBreakAfter: "always" }} >
                                <table className="report-container w-100">
                                    <thead className="report-header">
                                        <tr>
                                            <th className="report-header-cell">
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
                                                                        <h4>{customer.client && customer.client.lastname + " " + customer.client.firstname}</h4>
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
                                                                        {customer.client && new Date(customer.client.born).toLocaleDateString()}
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ textAlign: "center" }}>
                                                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                                        Kelgan sanasi
                                                                    </td>
                                                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                                        {customer.connector && new Date(customer.connector.bronDay).toLocaleDateString()}

                                                                    </td>
                                                                    <td className='p-0 fw-bold' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000" }}>
                                                                        Namuna
                                                                    </td>
                                                                    <td className='p-0' style={{ width: "100px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                                        {customer.connector && customer.connector.probirka}
                                                                    </td>
                                                                </tr>

                                                                <tr style={{ textAlign: "center" }}>
                                                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000" }}>
                                                                        Manzil
                                                                    </td>
                                                                    <td className='p-0' style={{ width: "33%", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                                        {customer.client && customer.client.address}
                                                                    </td>
                                                                    <td className='p-0 fw-bold' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000" }}>
                                                                        ID
                                                                    </td>
                                                                    <td className='p-0' style={{ width: "200px", backgroundColor: "white", border: "1px solid #000", fontSize: "20px" }}>
                                                                        {customer.client && customer.client.id}
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
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="report-content">
                                        <tr>
                                            <td className="report-content-cell">
                                                {
                                                    customer.sections && customer.sections.map((section, index) => {
                                                        if (true) {
                                                            if (
                                                                customer.tablesections && customer.tablesections[index].length > 0
                                                            ) {
                                                                let l = 0
                                                                let old = 0
                                                                customer.tablesections[index] && customer.tablesections[index].map((tablesection, j) => {
                                                                    if (tablesection.accept) {
                                                                        l++
                                                                    }
                                                                })
                                                                customer.tablesections[index - 1] && customer.tablesections[index - 1].map((tablesection, j) => {
                                                                    if (tablesection.accept) {
                                                                        old++
                                                                    }
                                                                })
                                                                return (
                                                                    <>
                                                                        <table style={{ width: "100%" }}>
                                                                            {
                                                                                ((customer.sections[index - 1] &&
                                                                                    customer.sections[index - 1].name !== section.name) ||
                                                                                    index === 0 ||
                                                                                    customer.tablesections[index - 1].length === 0 ||
                                                                                    customer.tablesections[index - 1].length > 5 ||
                                                                                    customer.tablesections[index].length > 5 || old === 0) && l !== 0 ?
                                                                                    <>
                                                                                        <span className='d-none'>{k = 0}</span>
                                                                                        <tr>
                                                                                            <td className='text-center py-0 m-0 pt-2' colSpan={6} style={{ backgroundColor: "#FFF" }} >
                                                                                                {customer.tablesections[index].length > 5 ? section.subname : section.name}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr style={{ backgroundColor: "#C0C0C0" }}>
                                                                                            <td className='text-center fw-bold cn py-1' style={{ border: "1px solid #000" }}>
                                                                                                №
                                                                                            </td>
                                                                                            <td className={customer.tablecolumns && customer.tablecolumns[index] && checkClassHead(customer.tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                                {customer.tablecolumns && customer.tablecolumns[index] && customer.tablecolumns[index].col1}
                                                                                            </td>
                                                                                            <td className={customer.tablecolumns && customer.tablecolumns[index] && checkClassHead(customer.tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                                {customer.tablecolumns && customer.tablecolumns[index] && customer.tablecolumns[index].col2}
                                                                                            </td>
                                                                                            <td className={customer.tablecolumns && customer.tablecolumns[index] && checkClassHead(customer.tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                                {customer.tablecolumns && customer.tablecolumns[index] && customer.tablecolumns[index].col3}
                                                                                            </td>
                                                                                            {
                                                                                                customer.tablecolumns && customer.tablecolumns[index] && (customer.tablecolumns[index].col4).length > 1 ?
                                                                                                    <td className={customer.tablecolumns && customer.tablecolumns[index] && checkClassHead(customer.tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                                        {customer.tablecolumns[index].col4}
                                                                                                    </td> : ""
                                                                                            }
                                                                                            {
                                                                                                customer.tablecolumns && customer.tablecolumns[index] && (customer.tablecolumns[index].col5).length > 1 ?
                                                                                                    <td className={customer.tablecolumns && customer.tablecolumns[index] && checkClassHead(customer.tablecolumns[index])} style={{ border: "1px solid #000" }}>
                                                                                                        {customer.tablecolumns[index].col5}
                                                                                                    </td> : ""
                                                                                            }
                                                                                        </tr>
                                                                                    </>
                                                                                    : ""

                                                                            }
                                                                            {
                                                                                customer.tablesections && customer.tablesections[index].map((tablesection, key) => {
                                                                                    if (tablesection.accept) {
                                                                                        return (
                                                                                            <tr style={{ backgroundColor: "white", marginTop: "10px !important" }}>
                                                                                                <td className='py-0 cn' style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}>
                                                                                                    {++k}
                                                                                                </td>
                                                                                                <td
                                                                                                    className={customer.tablecolumns && customer.tablecolumns[index] && checkClassFoot(customer.tablecolumns[index])}
                                                                                                    style={{ border: "1px solid #000", borderTop: "0px solid white" }}
                                                                                                >
                                                                                                    <p className='py-0 ps-2 text-start m-0' >{tablesection.name}</p>
                                                                                                </td>
                                                                                                <td
                                                                                                    className={customer.tablecolumns && customer.tablecolumns[index] && checkClassFoot(customer.tablecolumns[index])}
                                                                                                    style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                                                >
                                                                                                    <pre className='pretable fw-bold fs-6' >{tablesection.result}</pre>
                                                                                                </td>
                                                                                                <td
                                                                                                    className={customer.tablecolumns && customer.tablecolumns[index] && checkClassFoot(customer.tablecolumns[index])}
                                                                                                    style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                                                >
                                                                                                    {tablesection.norma}
                                                                                                </td>
                                                                                                {
                                                                                                    customer.tablecolumns && customer.tablecolumns[index] && (customer.tablecolumns[index].col4).length > 1 ?
                                                                                                        <td
                                                                                                            className={customer.tablecolumns && customer.tablecolumns[index] && checkClassFoot(customer.tablecolumns[index])}
                                                                                                            style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                                                        >
                                                                                                            <pre className='pretable' >{tablesection.additionalone}</pre>
                                                                                                        </td> : ""
                                                                                                }
                                                                                                {
                                                                                                    customer.tablecolumns && customer.tablecolumns[index] && (customer.tablecolumns[index].col5).length > 1 ?
                                                                                                        <td
                                                                                                            className={customer.tablecolumns && customer.tablecolumns[index] && checkClassFoot(customer.tablecolumns[index])}
                                                                                                            style={{ textAlign: "center", border: "1px solid #000", borderTop: "0px solid white" }}
                                                                                                        >
                                                                                                            <pre className='pretable' >{tablesection.additionaltwo}</pre>
                                                                                                        </td> : ""
                                                                                                }
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                        </table>
                                                                        {
                                                                            !section.probirka && section.accept ?
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
                                                                    </>
                                                                )
                                                            } else {
                                                                if (!section.probirka && section.accept) {
                                                                    return (
                                                                        <table className='mt-4 w-100'>
                                                                            <tr>
                                                                                <td colSpan={3} className="text-uppercase">
                                                                                    {section.subname}
                                                                                </td>
                                                                            </tr>
                                                                            {
                                                                                section.summary.length > 1 ?
                                                                                    <tr style={{ backgroundColor: "white" }}>
                                                                                        <th
                                                                                            className='text-center'
                                                                                            style={{ border: "1px solid #000", padding: "10px", width: "100px" }}
                                                                                        >
                                                                                            Xulosa
                                                                                        </th>
                                                                                        <td
                                                                                            style={{ border: "1px solid #000", padding: "10px" }}
                                                                                            className='p-0 fw-normal text-start'
                                                                                        >
                                                                                            <pre style={{ border: "none" }} >{section.summary}</pre>
                                                                                        </td>
                                                                                    </tr> : ""
                                                                            }
                                                                            {
                                                                                section.comment.length > 1 ?
                                                                                    <tr style={{ backgroundColor: "white" }}>
                                                                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center", width: "100px" }}> Izoh </th>
                                                                                        <td style={{ border: "1px solid #000", padding: "10px" }}
                                                                                            className='p-0 fw-normal text-start'
                                                                                        >
                                                                                            <pre style={{ border: "none" }} >{section.comment}</pre>
                                                                                        </td>
                                                                                    </tr>
                                                                                    : ""
                                                                            }

                                                                        </table>
                                                                    )
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="report-footer">
                                        <tr>
                                            <td className="report-footer-cell">
                                                <div className='row'>
                                                    <div className='col-4'>
                                                        <div className="footer-info">
                                                            <p className='text-start py-0 m-0'> Manzil: {logo && logo.address} </p>
                                                            <p className='text-start py-0 m-0'> Telefon: +{logo && logo.phone1}, +{logo && logo.phone2} </p>
                                                            <p className='text-start py-0 m-0'> <FontAwesomeIcon icon={faTelegram} /> http://t.me/gemotestuz </p>
                                                            <p className='text-start py-0 m-0'> Pochta indeksi: 210100 </p>
                                                        </div>
                                                    </div>
                                                    <div className='col-4'>
                                                        <p className='text-center' style={{ paddingTop: "35px" }}> Vrach: Iydiyev B.  __________ </p>
                                                    </div>
                                                    <div className='col-4'>
                                                        <img width="200" src={logo && logo.logo} />
                                                    </div>
                                                    <div className='col-12'>
                                                        <p className='text-center fs-6' > WWW.GEMO-TEST.UZ </p>
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                                {
                                    customer.sections && customer.sections.map((section, index) => {
                                        if (customer.sectionFiles && customer.sectionFiles[index].length > 0) {
                                            return (
                                                <div style={{ pageBreakAfter: "always" }}>
                                                    <div className='row mt-4'>
                                                        <div className='col-12 text-center w-100 py-1'>
                                                            {section.name + " " + section.subname}
                                                        </div>
                                                    </div>
                                                    {
                                                        customer.sectionFiles && customer.sectionFiles[index] && customer.sectionFiles[index].map((file) => {
                                                            return (
                                                                <div className='row'>
                                                                    <div
                                                                        className='col-12 w-100'
                                                                    >
                                                                        <img
                                                                            className='img m-auto'
                                                                            src={file.imageurl}
                                                                            alt="result"
                                                                            width="100%"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })

                                                    }

                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <p className='fs-4 text-danger text-center'>Diqqat! Barcha ma;umorlar o'chirilishini tasdiqlaysizmi? <br />
                            O'chirilgan ma'lumotlarni qayta tiklashning imkoni mavjud bo'lmaydi.
                        </p>
                        <div className='text-center'>
                            <button className='btn btn-danger me-3' onClick={Delete}> O'chirish </button>
                            <button className='btn btn-info' onClick={() => setModal(false)}> Qaytish </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
