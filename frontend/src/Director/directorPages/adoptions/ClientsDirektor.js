import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../../context/AuthContext'

toast.configure()
export const ClientsDirector = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const options = [
        { value: "all", label: "Barchasi" },
        { value: true, label: "Qabul qilinganlar" },
        { value: false, label: "Qabul qilinmaganlar" },
    ]

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()
    const [clientId, setClientId] = useState('')
    const [probirka, setProbirka] = useState('')
    const [all, setAll] = useState()

    const getToday = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/directorclients`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll])

    const getConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/director/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const getConnectorType = useCallback(async (type) => {
        try {
            const fetch = await request(`/api/connector/labaratoriyatype/${startDate}/${endDate}/${type}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/directorid/${startDate}/${endDate}/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll, startDate, endDate])

    const getProbirka = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/directorprobirka/${startDate}/${endDate}/${probirka}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, probirka, setAll, startDate, endDate])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/directorborn/${born}`, 'GET', null, {
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


    const searchId = () => {
        getId()
    }

    const searchProbirka = () => {
        getProbirka()
    }

    const searchBornDate = () => {
        getBorn()
    }

    const searchType = (event) => {
        if (event.value === "all") {
            getConnectors()
        } else {
            getConnectorType(event.value)
        }
    }

    //=================================================================================
    //=================================================================================
    //=================================================================================
    // FISH bilan qidirish
    const [fish, setFish] = useState()
    const searchName = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/directorfish/${startDate}/${endDate}/${fish}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate, fish])


    const [connectorId, setConnectorId] = useState()
    const [key, setKey] = useState()
    const [modal, setModal] = useState(false)
    const Accept = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/labaratoriya/${connectorId}`, 'PATCH', null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId])

    const [t, setT] = useState()

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!t) {
            setT(1)
            getToday()
        }
    }, [notify, clearError, getToday, setT])

    // if (loading) {
    //     return <Loader />
    // }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1100px" }}  >
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
                <div className="col-2">
                    <input
                        style={{ marginRight: "5px", width: "115px" }}
                        defaultValue={clientId}
                        onChange={(event) => { setClientId(parseInt(event.target.value)) }}
                        className="form-control pb-2 d-inline-block"
                        type="number"
                        placeholder="ID qidiruvi"
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchId() }
                        }}
                    />
                    <button onClick={searchId} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <input
                        style={{ marginRight: "5px", width: "115px" }}
                        defaultValue={probirka}
                        onChange={(event) => { setProbirka(parseInt(event.target.value)) }}
                        className="form-control pb-2 d-inline-block"
                        type="number"
                        placeholder="Probirka qidiruvi"
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchProbirka() }
                        }}
                    />
                    <button onClick={searchProbirka} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <input
                        className="form-control mb-2"
                        type="date"
                        onChange={(event) => { setBorn(new Date(event.target.value)) }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") { searchBornDate() }
                        }}
                    />
                </div>
                <div className="col-1">
                    <button onClick={searchBornDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
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
                        }}
                    />
                </div>
                <div className='col-1'>
                    <button onClick={(event) => (searchName((event.target.value)))} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="offset-8  col-1 ">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>
                {/* <div className='col-2'>
                    <Select onChange={(event) => { searchType(event) }} defaultValue={options[0]} options={options} />
                </div> */}
            </div>
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="" className="table-striped table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th style={{ width: "100px" }} className='text-center' >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th style={{ width: "100px" }} className=" text-center">Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "200px" }} className=" text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "100px" }} className=" text-center">Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "100px" }} className=" text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "100px" }} className=" text-center">Probirka <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "200px" }} className=" text-center">Qabul <br /> qilish <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "100px" }} className=" text-center">Tahrirlash <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "100px" }} className=" text-center">Izoh <FontAwesomeIcon icon={faSort} /></th>
                                <th style={{ width: "100px" }} className=" text-center">Holati <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div className="d-none" >
                <table id="reseptionReport" className=" table-hover"  >
                    <thead>
                        <tr>
                            <th style={{ width: "100px" }} className='text-center' >№ <FontAwesomeIcon icon={faSort} /> </th>
                            <th style={{ width: "100px" }} className=" text-center">Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th style={{ width: "200px" }} className=" text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th style={{ width: "100px" }} className=" text-center">Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                            <th style={{ width: "100px" }} className=" text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th style={{ width: "100px" }} className=" text-center">Probirka <FontAwesomeIcon icon={faSort} /></th>
                            <th style={{ width: "200px" }} className=" text-center">Tayyorlangan <FontAwesomeIcon icon={faSort} /></th>
                            <th style={{ width: "100px" }} className=" text-center">Tayyorlanmagan <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {
                            all && all.clients.map((client, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ width: "100px" }} className='text-center'>{index + 1}</td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {all && new Date(all.connectors[index].bronDay).toLocaleString()}
                                        </td>
                                        <td style={{ width: "200px" }} className=' fw-bold text-success text-uppercase'>
                                            {client.lastname} {client.firstname} {client.fathername}
                                        </td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {new Date(client.born).toLocaleDateString()}
                                        </td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {client.id}
                                        </td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {all && all.connectors[index].probirka}
                                        </td>
                                        <td style={{ width: "200px" }} className='text-center'>
                                            <span className='text-success'>{all && all.countsection[index].accept}</span>
                                        </td>
                                        <td style={{ width: "100px" }} className='text-center'>
                                            <span className='text-danger'>{all && all.countsection[index].all}</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="overflow-auto" style={{ height: "60vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {
                            all && all.clients.map((client, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ width: "100px" }} className='text-center'>{index + 1}</td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {all && all.connectors[index] && new Date(all.connectors[index].bronDay).toLocaleString()}
                                        </td>
                                        <td style={{ width: "200px" }} className=' fw-bold text-success text-uppercase'>
                                            {client && client.lastname} {client && client.firstname} {client && client.fathername}
                                        </td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {client && new Date(client.born).toLocaleDateString()}
                                        </td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {client.id}
                                        </td>
                                        <td style={{ width: "100px" }} className=' text-center'>
                                            {all && all.connectors[index] && all.connectors[index].probirka}
                                        </td>
                                        <td style={{ width: "200px" }} className='text-center'>
                                            <Link className='btn btn-info' to={`/director/adoption/${client._id}/${all && all.connectors[index]._id}`} >
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </Link>
                                        </td>
                                        <td style={{ width: "100px" }} className='text-center'>
                                            <Link className='btn btn-info' to={`/director/clientallhistory/${client._id}`} >
                                                <FontAwesomeIcon icon={faPrint} />
                                            </Link>
                                        </td>
                                        <td style={{ width: "100px" }} className='text-center'>
                                            {all && all.connectors[index] && all.connectors[index].diagnosis}
                                        </td>
                                        <td style={{ width: "100px" }} className='text-center fw-bold fs-5'>
                                            <span className='text-success'>{all && all.countsection[index].accept}</span>  / <span className='text-danger'>{all && all.countsection[index].all}</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>





        </div>
    )
}
