import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import './../CSS/tableStyle.css'
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsPages = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)

    const options = [
        { value: 'all', label: 'Barcha' },
        { value: 'offline', label: 'Offline' },
        { value: 'online', label: 'Online' },
        { value: 'callcenter', label: 'CallCenter' },
    ]


    let paid = 0
    let unpaid = 0
    let k = 0
    let kk = 0
    const [type, setType] = useState("all")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()
    const [clientId, setClientId] = useState('')
    const [all, setAll] = useState()

    const getToday = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseption`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch);
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const getConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseption/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])


    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch) 
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseptionborn/${born}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, born, setAll])


    const notify = (e) => {
        toast.error(e);
    };

    const searchDate = () => {
        getConnectors()
    }

    const sortOnOff = (event) => {
        setType(event.value)
    }

    const searchId = () => {
        getId()
    }

    const searchBornDate = () => {
        getBorn()
    }

    //=================================================================================
    //=================================================================================
    //=================================================================================
    // FISH bilan qidirish
    const [fish, setFish] = useState()
    const searchName = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseptionoffline/${startDate}/${endDate}/${fish}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate, fish])


    //====================================================================================
    //====================================================================================
    //====================================================================================
    // Bo'limlar bo'yicha sartirovka
    const [allSections, setAllSections] = useState()

    const getAllSections = useCallback(async () => {
        try {
            const data = await request("/api/direction/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            const fetch = await request("/api/warehouse/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            let m = [{
                _id: "123",
                __v: 0,
                value: "all",
                label: "Barcha bo'limlar",
                subvalue: " ",
                price: 0
            }]
            data.map((section) => {
                let k = 0
                m.map((mm) => {
                    if (mm.value === section.section) {
                        k++
                    }
                })
                if (!k) {
                    m.push({
                        value: section.section,
                        label: section.section,
                        subvalue: " ",
                        price: 0
                    })
                }
            })
            fetch.map((ware) => {
                let k = 0
                m.map((mm) => {
                    if (mm.value === ware.name) {
                        k++
                    }
                })
                if (!k) {
                    m.push({
                        value: ware.name,
                        label: ware.name,
                        subvalue: " ",
                        price: 0
                    })
                }
            })
            setAllSections(m)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setAllSections, options])

    const getSortSection = useCallback(async (section) => {
        try {
            const fetch = await request(`/api/connector/reseption/${startDate}/${endDate}/${section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const sortSections = (event) => {
        if (event.value === "all") {
            getConnectors()
        } else {
            getSortSection(event.value)
        }
    }

    const [t, setT] = useState()
    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!t) {
            setT(1)
            getToday()
            getAllSections()
        }
    }, [notify, clearError, setT, getAllSections, getToday])

    // if (loading) {
    //     return <Loader />
    // }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1250px" }}  >
            <div className="row mb-3">
                <div className=" col-2">
                    <DatePicker
                        className="form-control mb-2"
                        selected={startDate}
                        onChange={(date) => { setStartDate(date) }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchDate() }
                        }}
                    />
                </div>
                <div className="col-2">
                    <DatePicker
                        className="form-control mb-2"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchDate() }
                        }}
                    />
                </div>
                <div className="col-1">
                    <button onClick={searchDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}> <FontAwesomeIcon icon={faSearch} /> </button>
                </div>
                <div className="col-2">
                    <input
                        style={{ marginRight: "5px", width: "115px" }}
                        defaultValue={clientId}
                        onChange={(event) => { setClientId(parseInt(event.target.value)) }}
                        className="form-control pb-2 d-inline-block" type="number"
                        placeholder="ID qidiruvi"
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchId() }
                        }} />
                    <button onClick={searchId} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <input
                        className="form-control mb-2"
                        type="date"
                        onChange={(event) => { setBorn(new Date(event.target.value)) }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchBornDate() }
                        }} />
                </div>
                <div className="col-1">
                    <button onClick={searchBornDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <Select onChange={(event) => sortOnOff(event)} defaultValue={options[0]} options={options} />
                </div>
            </div>
            <div className="row">
                <div className='col-2 '>
                    <input
                        onChange={(event) => { setFish(event.target.value) }}
                        className='form-control'
                        placeholder='Mijoz ism-familiyasi'
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchName() }
                        }} />
                </div>
                <div className='col-1'>
                    <button onClick={(event) => (searchName((event.target.value)))} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="offset-6  col-1 ">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>
                <div className=" col-2">
                    <Select isDisabled={loading} onChange={(event) => sortSections(event)} defaultValue={allSections && allSections[0]} options={allSections && allSections} />
                </div>

            </div>
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="" className="table-striped table-hover w-100" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="edit text-center">Qo'shish <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center"> Chek <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="turn text-center">Navbati <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div className="d-none" >
                <table id="reseptionReport" className=" table-hover w-100"  >
                    <thead className=" ">
                        <tr>
                            <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                            <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="turn text-center">Navbati <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Qarz <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {
                            all && all.connectors &&
                            all.connectors.map((connector, key) => {
                                if (type === "all") {
                                    return (<>
                                        {all && all.sections[key] && all.sections[key].map((section, index) => {
                                            if (index === 0) {
                                                if (section.payment !== "to'lanmagan") {
                                                    paid = paid + section.priceCashier
                                                    unpaid = unpaid + (section.price - section.priceCashier)
                                                }
                                                return (
                                                    <tr key={index} className=' border-top' >
                                                        <td
                                                            className="no border-right"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {++k}
                                                        </td>
                                                        <td
                                                            className="fish text-uppercase ps-3 fw-bold text-success"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {all.clients[key] && all.clients[key].lastname && all.clients[key].lastname} {all.clients[key] && all.clients[key].firstname && all.clients[key].firstname} {all.clients[key].fathername && all.clients[key].fathername}
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {all.clients[key] && all.clients[key].id}
                                                        </td>
                                                        <td
                                                            className="phone"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            +{all.clients[key] && all.clients[key].phone}
                                                        </td>
                                                        <td className="date text-center" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                        <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                                        <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                    </tr>
                                                )
                                            } else {
                                                if (section.payment !== "to'lanmagan") {
                                                    paid = paid + section.priceCashier
                                                    unpaid = unpaid + (section.price - section.priceCashier)
                                                }
                                                return (
                                                    <tr key={index}  >
                                                        <td className="date fw-normal"  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                        <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span> </td>
                                                        <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                        {all && all.sections[key] && all.sections[key].length === 0 ?
                                            <>{
                                                all && all.services[key] && all.services[key].map((service, index) => {
                                                    if (index === 0) {
                                                        if (service.payment !== "to'lanmagan") {
                                                            paid = paid + service.priceCashier
                                                            unpaid = unpaid + (service.price - service.priceCashier)
                                                        }
                                                        return (
                                                            <tr className=' border-top border-success' >
                                                                <td
                                                                    className="no border-right border-success"
                                                                    rowSpan={all && all.services[key] && all.services[key].length}
                                                                >
                                                                    {++k}
                                                                </td>
                                                                <td
                                                                    className="fish text-uppercase ps-3"
                                                                    rowSpan={all && all.services[key] && all.services[key].length}
                                                                >
                                                                    <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                        {all && all.clients[key].lastname && all.clients[key].lastname} {all && all.clients[key].firstname && all.clients[key].firstname}  {all && all.clients[key].fathername && all.clients[key].fathername}
                                                                    </Link>
                                                                    <br />
                                                                    <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id}`} >
                                                                        <FontAwesomeIcon icon={faPenAlt} />
                                                                    </Link>
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all.services[key] && all.services[key].length}
                                                                >
                                                                    {all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all && all.services[key] && all.services[key].length}
                                                                >
                                                                    {all && all.clients[key] && all.clients[key].id}
                                                                </td>
                                                                <td
                                                                    className="phone"
                                                                    rowSpan={all && all.services[key] && all.services[key].length}
                                                                >
                                                                    +{all && all.clients[key] && all.clients[key].phone}
                                                                </td>
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                <td className='turn'></td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                            </tr>
                                                        )
                                                    } else {
                                                        if (service.payment !== "to'lanmagan") {
                                                            paid = paid + service.priceCashier
                                                            unpaid = unpaid + (service.price - service.priceCashier)
                                                        }
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                <td className='turn'></td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                            </tr>
                                                        )
                                                    }
                                                })


                                            }
                                            </> :
                                            <>{
                                                all && all.services[key] && all.services[key].map((service, index) => {
                                                    if (service.payment !== "to'lanmagan") {
                                                        paid = paid + service.priceCashier
                                                        unpaid = unpaid + (service.price - service.priceCashier)
                                                    }
                                                    return (

                                                        <tr key={index}  >
                                                            <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className='turn'></td>
                                                            <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                            <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                            <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                            <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>)
                                } else {
                                    if (type === connector.type) {
                                        return (<>
                                            {all && all.sections[key] && all.sections[key].map((section, index) => {
                                                if (index === 0) {
                                                    if (section.payment !== "to'lanmagan") {
                                                        paid = paid + section.priceCashier
                                                        unpaid = unpaid + (section.price - section.priceCashier)
                                                    }
                                                    return (
                                                        <tr key={index} className=' border-top' >
                                                            <td
                                                                className="no border-right"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {++k}
                                                            </td>
                                                            <td
                                                                className="fish text-uppercase ps-3 fw-bold text-success"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key].lastname && all.clients[key].lastname} {all.clients[key].firstname && all.clients[key].firstname} {all.clients[key].fathername && all.clients[key].fathername}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key] && all.clients[key].id}
                                                            </td>
                                                            <td
                                                                className="phone"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                +{all.clients[key] && all.clients[key].phone}
                                                            </td>
                                                            <td className="date text-center" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    if (section.payment !== "to'lanmagan") {
                                                        paid = paid + section.priceCashier
                                                        unpaid = unpaid + (section.price - section.priceCashier)
                                                    }
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal"  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span> </td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                        </tr>
                                                    )
                                                }
                                            })}
                                            {all && all.sections[key].length === 0 ?
                                                <>{
                                                    all && all.services[key] && all.services[key].map((service, index) => {
                                                        if (index === 0) {
                                                            if (service.payment !== "to'lanmagan") {
                                                                paid = paid + service.priceCashier
                                                                unpaid = unpaid + (service.price - service.priceCashier)
                                                            }
                                                            return (
                                                                <tr className=' border-top border-success' >
                                                                    <td
                                                                        className="no border-right border-success"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        {++k}
                                                                    </td>
                                                                    <td
                                                                        className="fish text-uppercase ps-3"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                            {all && all.clients[key].lastname && all.clients[key].lastname} {all && all.clients[key].firstname && all.clients[key].firstname} {all && all.clients[key].fathername && all.clients[key].fathername}
                                                                        </Link>
                                                                        <br />
                                                                        <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id && all.clients[key]._id}`} >
                                                                            <FontAwesomeIcon icon={faPenAlt} />
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all.services[key].length && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key] && all.clients[key].id}
                                                                    </td>
                                                                    <td
                                                                        className="phone"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        +{all && all.clients[key] && all.clients[key].phone}
                                                                    </td>
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                    <td className='turn'></td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            if (service.payment !== "to'lanmagan") {
                                                                paid = paid + service.priceCashier
                                                                unpaid = unpaid + (service.price - service.priceCashier)
                                                            }
                                                            return (
                                                                <tr key={index}  >
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                    <td className='turn'></td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })


                                                }
                                                </> :
                                                <>{
                                                    all && all.services[key] && all.services[key].map((service, index) => {
                                                        if (service.payment !== "to'lanmagan") {
                                                            paid = paid + service.priceCashier
                                                            unpaid = unpaid + (service.price - service.priceCashier)
                                                        }
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                <td className='turn'></td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            }
                                        </>)
                                    }
                                }
                            }
                            )

                        }
                    </tbody>
                    <tfooter className=" ">
                        <tr>
                            <th className="no text-end text-right" scope="" colSpan="8" > Jami </th>
                            <th scope="" className="prices text-center"> {unpaid + paid}</th>
                            <th scope="" className="prices text-center"> {paid}</th>
                            <th scope="" className="prices text-center">{unpaid}</th>
                        </tr>
                    </tfooter>

                </table>
            </div>

            <div className="overflow-auto" style={{ height: "60vh", minWidth: "1100px" }}>
                <table className=" table-hover w-100"  >
                    <tbody className="" >
                        {all && all.connectors &&
                            all.connectors.map((connector, key) => {
                                if (type === "all") {
                                    return (
                                        <>
                                            {all && all.sections[key] && all.sections[key].map((section, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <tr key={index} className=' border-top border-success' >
                                                            <td
                                                                className="no border-right border-success"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {++kk}
                                                            </td>
                                                            <td
                                                                className="fish text-uppercase ps-3"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                    {all.clients[key].lastname && all.clients[key].lastname} {all.clients[key].firstname && all.clients[key].firstname} {all.clients[key].fathername && all.clients[key].fathername}
                                                                </Link>
                                                                <br />
                                                                <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all.clients[key]._id && all.clients[key]._id}`} >
                                                                    <FontAwesomeIcon icon={faPenAlt} />
                                                                </Link>
                                                                <span className='ps-3 fs-5'> <span className='text-success fw-bold'>{all.countsection[key] && all.countsection[key].accept}</span> / <span className='text-danger fw-bold'>{all.countsection[key] && all.countsection[key].all}</span>  </span> <br />
                                                                <span className='text-info fw-bold'>{all.connectors[key] && all.connectors[key].diagnosis}</span>
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key] && all.clients[key].id}

                                                            </td>
                                                            <td
                                                                className="phone"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                +{all.clients[key] && all.clients[key].phone}
                                                            </td>
                                                            <td
                                                                className="edit"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                <Link className='btn button-success text-success' to={`/reseption/addservices/${all.clients[key]._id && all.clients[key]._id}/${connector._id}`} >
                                                                    +
                                                                </Link>
                                                            </td>
                                                            <td
                                                                className="cek"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                <Link to={`/reseption/reciept/${all.clients[key] && all.clients[key]._id}/${section.connector}`} >
                                                                    <FontAwesomeIcon icon={faPrint} className="fa-2x" />
                                                                </Link>
                                                            </td>
                                                            <td className="date text-center border-left border-success" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        </tr>
                                                    )
                                                }
                                            })}
                                            {all && all.sections[key] && all.sections[key].length === 0 ?
                                                <>{
                                                    all && all.services[key] && all.services[key].map((service, index) => {
                                                        if (index === 0) {
                                                            return (
                                                                <tr className=' border-top border-success' >
                                                                    <td
                                                                        className="no border-right border-success"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        {++kk}
                                                                    </td>
                                                                    <td
                                                                        className="fish text-uppercase ps-3"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                            {all && all.clients[key].lastname && all.clients[key].lastname} {all && all.clients[key].firstname && all && all.clients[key].firstname} {all && all.clients[key].fathername && all.clients[key].fathername}
                                                                        </Link>
                                                                        <br />
                                                                        <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id && all.clients[key]._id}`} >
                                                                            <FontAwesomeIcon icon={faPenAlt} />
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key] && all.clients[key].id}
                                                                    </td>
                                                                    <td
                                                                        className="phone"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        +{all && all.clients[key] && all.clients[key].phone}
                                                                    </td>
                                                                    <td
                                                                        className="edit"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        <Link className='btn button-success text-success' to={`/reseption/addservices/${all && all.clients[key]._id && all.clients[key]._id}/${connector._id}`} >
                                                                            +
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="cek"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        <Link to={`/reseption/reciept/${all && all.clients[key] && all.clients[key]._id}/${connector._id}`} >
                                                                            <FontAwesomeIcon icon={faPrint} className="fa-2x" />
                                                                        </Link>
                                                                    </td>
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                    <td className="turn">{service.pieces}(dona)</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            return (
                                                                <tr key={index}  >
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                    <td className="turn">{service.pieces}(dona)</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })


                                                }
                                                </> :
                                                <>{
                                                    all && all.services[key] && all.services[key].map((service, index) => {
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                <td className="turn">{service.pieces}(dona)</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            }

                                        </>
                                    )

                                } else {
                                    if (type === connector.type) {
                                        return (<>
                                            {all && all.sections[key] && all.sections[key].map((section, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <tr key={index} className=' border-top border-success' >
                                                            <td
                                                                className="no border-right border-success"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {++kk}
                                                            </td>
                                                            <td
                                                                className="fish text-uppercase ps-3"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                    {all.clients[key].lastname && all.clients[key].lastname} {all.clients[key].firstname && all.clients[key].firstname} {all.clients[key].fathername && all.clients[key].fathername}
                                                                </Link>
                                                                <br />
                                                                <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all.clients[key] && all.clients[key]._id}`} >
                                                                    <FontAwesomeIcon icon={faPenAlt} />
                                                                </Link>
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key] && all.clients[key].id}
                                                            </td>
                                                            <td
                                                                className="phone"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                +{all.clients[key] && all.clients[key].phone}
                                                            </td>
                                                            <td
                                                                className="edit"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                <Link className='btn button-success text-success' to={`/reseption/addservices/${all.clients[key]._id && all.clients[key]._id}/${connector._id}`} >
                                                                    +
                                                                </Link>
                                                            </td>
                                                            <td
                                                                className="cek"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                <Link to={`/reseption/reciept/${all.clients[key] && all.clients[key]._id}/${section.connector}`} >
                                                                    <FontAwesomeIcon icon={faPrint} className="fa-2x" />
                                                                </Link>
                                                            </td>
                                                            <td className="date text-center border-left border-success" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        </tr>
                                                    )
                                                }
                                            })}
                                            {all && all.sections[key] && all.sections[key].length === 0 ?
                                                <>{
                                                    all && all.services[key] && all.services[key].map((service, index) => {
                                                        if (index === 0) {
                                                            return (
                                                                <tr className=' border-top border-success' >
                                                                    <td
                                                                        className="no border-right border-success"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        {++kk}
                                                                    </td>
                                                                    <td
                                                                        className="fish text-uppercase ps-3"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                            {all && all.clients[key].lastname && all.clients[key].lastname} {all && all.clients[key].firstname && all.clients[key].firstname} {all && all.clients[key].fathername && all.clients[key].fathername}
                                                                        </Link>
                                                                        <br />
                                                                        <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key] && all.clients[key]._id}`} >
                                                                            <FontAwesomeIcon icon={faPenAlt} />
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all.services[key] && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key] && new Date(all.clients[key].born).toLocaleDateString()}
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key] && all.clients[key].id}
                                                                    </td>
                                                                    <td
                                                                        className="phone"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        +{all && all.clients[key] && all.clients[key].phone}
                                                                    </td>
                                                                    <td
                                                                        className="edit"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        <Link className='btn button-success text-success' to={`/reseption/addservices/${all && all.clients[key]._id && all.clients[key]._id}/${connector._id}`} >
                                                                            +
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="cek"
                                                                        rowSpan={all && all.services[key] && all.services[key].length}
                                                                    >
                                                                        <Link to={`/reseption/reciept/${all && all.clients[key] && all.clients[key]._id}/${connector._id}`} >
                                                                            <FontAwesomeIcon icon={faPrint} className="fa-2x" />
                                                                        </Link>
                                                                    </td>
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                    <td className="turn">{service.pieces}(dona)</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            return (
                                                                <tr key={index}  >
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                    <td className="turn">{service.pieces}(dona)</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })


                                                }
                                                </> :
                                                <>{
                                                    all && all.services[key] && all.services[key].map((service, index) => {
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                <td className="turn">{service.pieces}(dona)</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            }
                                        </>)

                                    }
                                }
                            })
                        }
                    </tbody>

                </table>
            </div>
        </div>
    )
}
