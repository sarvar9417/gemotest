import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faClock, faCheck, faSyncAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import { AuthContext } from '../context/AuthContext'
import './tableStyle.css'
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'

import "react-datepicker/dist/react-datepicker.css"
const mongoose = require('mongoose')

toast.configure()
export const ClientsPages = () => {
    const auth = useContext(AuthContext)
    const payment = ["kelgan", "kelmagan", "chaqirilmagan"]
    const options = [
        { value: 'all', label: 'Barchasi' },
        { value: 'chaqirilmagan', label: "Chaqirilmagan" },
        { value: "kelgan", label: "Chaqirilgan" }
    ]

    const notify = (e) => {
        toast.error(e)
    }

    let paid = 0
    let unpaid = 0
    let k = 0
    let kk = 0
    let position = "all"
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()
    const [sections, setSections] = useState()
    const [AllSections, setAllSections] = useState()
    const [AllClients, setAllClients] = useState()
    const [clientId, setClientId] = useState('')

    const getClients = useCallback(async () => {
        try {
            const fetch = await request('/api/clients/cashier', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAllClients(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, setAllSections, auth])

    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctorall/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAllSections(fetch)
            let c = []
            fetch.map((section) => {
                if (new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()) {
                    c.push(section)
                }
            })
            setSections(c)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setSections, setAllSections])

    const searchDate = () => {
        let c = []
        AllSections && AllSections.map((section) => {
            if (setSortDate(section) && position) {
                c.push(section)
            }
        })
        setSections(c)
    }

    const sortOnOff = (event) => {
        position = event.value
        let c = []
        if (event.value === "all") {
            AllSections &&  AllSections.map((section) => {
                if (setSortDate(section)) {
                    c.push(section)
                }
            })
            setSections(c)
        } else {
            AllSections && AllSections.map((section) => {
                if (section.checkup === event.value && setSortDate(section))
                    c.push(section)
            })
            setSections(c)
        }
    }

    const searchId = () => {
        let c = []
        AllSections && AllSections.map((section) => {
            AllClients && AllClients.map((client) => {
                if (client.id === clientId && section.client === client._id) {
                    c.push(section)
                }
            })
        })
        setSections(c)
    }

    const searchBornDate = () => {
        let c = []
        AllSections && AllSections.map((section) => {
            AllClients && AllClients.map((client) => {
                let year = born.getFullYear().toString()
                let month = born.getMonth().toString() < 10 ? "0" + born.getMonth().toString() : born.getMonth().toString()
                let day = born.getDate().toString() < 10 ? "0" + born.getDate().toString() : born.getDate().toString()
                let date1 = parseInt(year + month + day)

                year = new Date(client.born).getFullYear().toString()
                month = new Date(client.born).getMonth().toString() < 10 ? "0" + new Date(client.born).getMonth().toString() : new Date(client.born).getMonth().toString()
                day = new Date(client.born).getDate().toString() < 10 ? "0" + new Date(client.born).getDate().toString() : new Date(client.born).getDate().toString()
                let date2 = parseInt(year + month + day)
                if (date1 === date2 && section.client === client._id) {
                    c.push(section)
                }
            })

        })
        setSections(c)
    }

    const setSortDate = (section) => {

        if (section.bron === 'offline') {
            let year = startDate.getFullYear().toString()
            let month = startDate.getMonth().toString() < 10 ? "0" + startDate.getMonth().toString() : startDate.getMonth().toString()
            let day = startDate.getDate().toString() < 10 ? "0" + startDate.getDate().toString() : startDate.getDate().toString()
            let date1 = parseInt(year + month + day)

            year = endDate.getFullYear().toString()
            month = endDate.getMonth().toString() < 10 ? "0" + endDate.getMonth().toString() : endDate.getMonth().toString()
            day = endDate.getDate().toString() < 10 ? "0" + endDate.getDate().toString() : endDate.getDate().toString()
            let date3 = parseInt(year + month + day)

            year = new mongoose.Types.ObjectId(section._id).getTimestamp().getFullYear().toString()
            month = new mongoose.Types.ObjectId(section._id).getTimestamp().getMonth().toString() < 10 ? "0" + new mongoose.Types.ObjectId(section._id).getTimestamp().getMonth().toString() : new mongoose.Types.ObjectId(section._id).getTimestamp().getMonth().toString()
            day = new mongoose.Types.ObjectId(section._id).getTimestamp().getDate().toString() < 10 ? "0" + new mongoose.Types.ObjectId(section._id).getTimestamp().getDate().toString() : new mongoose.Types.ObjectId(section._id).getTimestamp().getDate().toString()
            let date2 = parseInt(year + month + day)
            return (date1 <= date2 && date2 <= date3)
        } else {
            let year = startDate.getFullYear().toString()
            let month = startDate.getMonth().toString() < 10 ? "0" + startDate.getMonth().toString() : startDate.getMonth().toString()
            let day = startDate.getDate().toString() < 10 ? "0" + startDate.getDate().toString() : startDate.getDate().toString()
            let date1 = parseInt(year + month + day)

            year = endDate.getFullYear().toString()
            month = endDate.getMonth().toString() < 10 ? "0" + endDate.getMonth().toString() : endDate.getMonth().toString()
            day = endDate.getDate().toString() < 10 ? "0" + endDate.getDate().toString() : endDate.getDate().toString()
            let date3 = parseInt(year + month + day)

            year = new Date(section.bronDay).getFullYear().toString()
            month = new Date(section.bronDay).getMonth().toString() < 10 ? "0" + new Date(section.bronDay).getMonth().toString() : new Date(section.bronDay).getMonth().toString()
            day = new Date(section.bronDay).getDate().toString() < 10 ? "0" + new Date(section.bronDay).getDate().toString() : new Date(section.bronDay).getDate().toString()
            let date2 = parseInt(year + month + day)
            return (date1 <= date2 && date2 <= date3)
        }

    }

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!AllClients) {
            getClients()
        }
        if (!AllSections) {
            getAllSections()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5"  >
            <div style={{ marginTop: "90px" }} className="row mb-3">
                <div className=" col-lg-2 col-md-4 col-sm-4">
                    <DatePicker className="form-control mb-2" selected={startDate} onChange={(date) => { setStartDate(date) }} />
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                    <DatePicker className="form-control mb-2" selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div className="col-lg-1 col-md-1 col-sm-1  ">
                    <button onClick={searchDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}> <FontAwesomeIcon icon={faSearch} /> </button>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                    <input style={{ marginRight: "5px", width: "115px" }} defaultValue={clientId} onChange={(event) => { setClientId(parseInt(event.target.value)) }} className="form-control pb-2 d-inline-block" type="number" placeholder="ID qidiruvi" />
                    <button onClick={searchId} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4  ">
                    <input className="form-control mb-2" type="date" onChange={(event) => { setBorn(new Date(event.target.value)) }} />
                </div>
                <div className="col-lg-1 col-md-1 col-sm-2">
                    <button onClick={searchBornDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-6 ">
                    <Select onChange={(event) => sortOnOff(event)} defaultValue={options[0]} options={options} />
                </div>
            </div>
            <div className="row">
                <div className="offset-10 col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>
                <div className=" col-1 text-end">
                    <button onClick={() => setSections(AllSections)} className="btn text-white" style={{ backgroundColor: "#45D3D3" }} ><FontAwesomeIcon icon={faSyncAlt} /> </button>
                </div>

            </div>
            <div>
                <div style={{ minWidth: "1300px" }} >
                    <table id="" className="table-striped table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="date text-center" >Kelgan kuni <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="edit text-center">Tahrirlash <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">Xulosa <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center"> Summasi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center"> To'langan <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center"> Ish haqi <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div className="overflow-auto" style={{ height: "59vh", minWidth: "1300px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {sections && sections.map((section, key) => {
                            return AllClients && AllClients.map(client => {
                                if (client._id === section.client && (section.position === "offline" || section.position === "kelgan")) {
                                    paid = paid + section.priceCashier
                                    unpaid = unpaid + (section.price - section.priceCashier)
                                    k++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{k}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleDateString()}</td>
                                            <td className="fish text-uppercase" ><Link className='text-success' style={{ fontWeight: "700" }} to={`/doctor/clienthistory/${client._id}`} > {client.lastname} {client.firstname} {client.fathername} </Link></td>
                                            <td className="id" >{client.id}</td>
                                            <td className="phone">+{client.phone}</td>
                                            <td className="section text-uppercase fw-bold text-success">  {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                            <td className="edit"> {section.checkup === "chaqirilmagan" ? "" : <Link to={`/doctor/adoption/${section._id}`} > <FontAwesomeIcon icon={faPenAlt} className="text-dark" /> </Link>}   </td>
                                            <td className={
                                                payment.map((pay) => {
                                                    if (pay === "kelgan" && section.checkup === "kelgan") {
                                                        return " text-success prices text-center"
                                                    }
                                                    if (pay === "kelmagan" && section.checkup === "kelmagan") {
                                                        return " text-danger prices text-center"
                                                    }
                                                    if (pay === "chaqirilmagan" && section.checkup === "chaqirilmagan") {
                                                        return (" text-warning prices text-center")
                                                    }
                                                })
                                            } >
                                                {
                                                    payment.map((pay) => {
                                                        if (pay === "kelgan" && section.checkup === "kelgan") {
                                                            return (<FontAwesomeIcon icon={faCheck} />)
                                                        }
                                                        if (pay === "kelmagan" && section.checkup === "kelmagan") {
                                                            return (<FontAwesomeIcon icon={faTimesCircle} />)
                                                        }
                                                        if (pay === "chaqirilmagan" && section.checkup === "chaqirilmagan") {
                                                            return (<FontAwesomeIcon icon={faClock} />)
                                                        }
                                                    })
                                                }
                                            </td>
                                            <td className="cek fw-bold"> {section.payment === "to'lanmagan" ? "" : section.price}</td>
                                            <td className="cek fw-bold text-success"> {section.payment === "to'lanmagan" ? "" : section.priceCashier}</td>
                                            <td className="cek fw-bold text-warning"> {section.payment === "to'lanmagan" ? "" : section.priceCashier * auth.doctor.procient / 100}</td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        )}
                    </tbody>

                </table>
            </div>

            <div>
                <div style={{ minWidth: "1300px" }} >
                    <table id="" className="table-striped table-hover pt-2" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <tfooter>
                            <tr className="mt-4">
                                <th className="no" scope="" >Jami:</th>
                                <th scope="" className="date text-center" ></th>
                                <th scope="" className="fish text-center"></th>
                                <th scope="" className="id text-center"></th>
                                <th scope="" className="phone text-center"></th>
                                <th scope="" className="section text-center"></th>
                                <th scope="" className="edit text-center"> </th>
                                <th scope="" className="prices text-center"> </th>
                                <th scope="" className="cek text-center "> {unpaid + paid}</th>
                                <th scope="" className="cek text-center text-success"> {paid} </th>
                                <th scope="" className="cek text-center text-danger">  {paid * auth.doctor.procient / 100} </th>
                            </tr>
                        </tfooter>
                    </table>
                </div>
            </div>





            <div className="d-none" >
                <table id="reseptionReport" className=" table-hover"  >
                    <thead className=" ">
                        <tr>
                            <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                            <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="turn text-center">Navbati <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Ish haqi <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {sections &&  sections.map((section, key) => {
                            return AllClients && AllClients.map(client => {
                                if (client._id === section.client && (section.position === "offline" || section.position === "kelgan")) {
                                    kk++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{kk}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-uppercase" > {client.lastname} {client.firstname} {client.fathername}</td>
                                            <td className="id" >{client.id}</td>
                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                            <td className="phone">+{client.phone}</td>
                                            <td className="section text-uppercase">  {section.name} </td>
                                            <td  >
                                                {section.payment === "to'lanmagan" ? "" : section.price}
                                            </td>
                                            <td >
                                                {section.payment === "to'lanmagan" ? "" : section.priceCashier}
                                            </td>
                                            <td className="cek fw-bold text-danger"> {section.payment === "to'lanmagan" ? "" : section.priceCashier * auth.doctor.procient / 100}</td>
                                        </tr>
                                    )
                                }
                            })

                        }
                        )}
                    </tbody>
                    <tfooter className=" ">
                        <tr>
                            <th className="no" colSpan="7" scope="" > Jami </th>
                            <th scope="" className="prices text-center">{paid + unpaid}</th>
                            <th scope="" className="prices text-center">{paid}</th>
                            <th scope="" className="prices text-center">{paid * auth.doctor.procient / 100}</th>
                        </tr>
                    </tfooter>

                </table>
            </div>
        </div>
    )
}
