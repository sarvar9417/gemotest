import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const Sales = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const [clientId, setClientId] = useState('')
    const [all, setAll] = useState()
    const getSales = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/sales/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/saleid/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/saleborn/${born}`, 'GET', null, {
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
        getSales()
    }

    const sortOnOff = (event) => {
        // setType(event.value)
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
            const fetch = await request(`/api/connector/salename/${startDate}/${endDate}/${fish}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate, fish])

    const [t, setT] = useState()

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!t) {
            setT(1)
            getSales()
        }
    }, [notify, clearError, setT, getSales])

    // if (loading) {
    //     return <Loader />
    // }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1250px" }}  >
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
                        }}
                    />
                </div>
                <div className="col-1">
                    <button onClick={searchBornDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="offset-1 col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
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

                <div className=" col-2">
                    {/* <Select isDisabled={loading} onChange={(event) => sortSections(event)} defaultValue={allSections && allSections[0]} options={allSections && allSections} /> */}
                </div>

            </div>
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="reseptionReport" className="table-striped table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center">Jami <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Chegirma <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">Foiz <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className=" text-center">Izoh <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                all && all.map((data, index) => {
                                    return (
                                        <tr className='bg-white border-bottom'>
                                            <td className="no" scope="" > {index + 1}  </td>
                                            <td scope="" className="fish text-center fw-bold"> {data.lastname + " " + data.firstname} </td>
                                            <td scope="" className="id text-center">{new Date(data.bronDay).toLocaleDateString()} </td>
                                            <td scope="" className="id text-center">{data.id} </td>
                                            <td scope="" className="phone text-center">+{data.phone} </td>
                                            <td scope="" className="fish text-center fw-bold"> {data.sectionssumma} </td>
                                            <td scope="" className="section text-center text-success fw-bold"> {data.payment} </td>
                                            <td scope="" className="date text-center text-info fw-bold" >{data.sale} </td>
                                            <td scope="" className="prices text-center text-danger fw-bold"> {data.procient}% </td>
                                            <td scope="" className=" text-center">{data.comment} </td>

                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                        <tfoot>
                            <tr className='bg-white'>
                                <td colSpan={2} className='fw-bold text-end'>Jami:</td>
                                <td colSpan={8} className='text-start ps-4 fw-bold'>
                                    {
                                        all && all.reduce((summ, data) => {
                                            return summ + data.sectionssumma
                                        }, 0)
                                    }
                                </td>
                            </tr>
                            <tr className='bg-white'>
                                <td colSpan={2} className='fw-bold text-end'>Chegirma:</td>
                                <td colSpan={8} className='text-start ps-4 fw-bold text-info'>
                                    {
                                        all && all.reduce((summ, data) => {
                                            return summ + data.sale
                                        }, 0)
                                    }
                                </td>
                            </tr>
                            <tr className='bg-white'>
                                <td colSpan={2} className='fw-bold text-end'>To'lov:</td>
                                <td colSpan={8} className='text-start ps-4 fw-bold text-success'>
                                    {
                                        all && all.reduce((summ, data) => {
                                            return summ + data.payment
                                        }, 0)
                                    }
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>



        </div>
    )
}
