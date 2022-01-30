import React, { useCallback, useContext, useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-to-excel'
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { toast } from 'react-toastify'
import Select from 'react-select'
import DatePicker from "react-datepicker"

toast.configure()
export const TableSection = () => {
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const [alldirections, setAllDirections] = useState()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const getAllDirections = useCallback(async () => {
        try {
            const data = await request("/api/direction/table", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            let m = [{
                value: "all",
                label: "Bo'limlar",
                subvalue: " ",
                price: 0
            }]
            data.map((section) => {
                m.push({
                    value: section.section,
                    label: section.section,
                    subvalue: " ",
                    price: 0
                })
            })
            setAllDirections(m)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setAllDirections])

    const notify = (e) => {
        toast.error(e)
    }



    const [clients, setClients] = useState()
    const [directions, setDirections] = useState()
    const [sections, setSections] = useState()
    const [tables, setTables] = useState()
    const getSections = useCallback(async (section) => {
        try {
            const data = await request(`/api/section/table/${startDate}/${endDate}/${section}`, "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTables(data.tables)
            setClients(data.clients)
            setDirections(data.directions)
            setSections(data.datas)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setSections, setTables, setDirections, setClients, startDate, endDate])


    const editTables = (event, index, key) => {
        let t = [...tables]
        t[index][key].result = event.target.value
        t[index][key].accept = true
        setTables(t)
    }

    const patchTables = useCallback(async () => {
        try {
            const data = await request(`/api/section/table`, "PATCH", [...tables], {
                Authorization: `Bearer ${auth.token}`
            })
            toast.success(data.message)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, toast, tables])



    useEffect(() => {
        if (!alldirections) {
            getAllDirections()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    return (
        <div className='container'>
            <div className='row'>
                <div className=" col-2">
                    <DatePicker className="form-control mb-2" selected={startDate} onChange={(date) => { setStartDate(date) }} />
                </div>
                <div className="col-2">
                    <DatePicker className="form-control mb-2" selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div className="offset-5  col-2">
                    <Select onChange={(event) => getSections(event.value)} isDisabled={loading} defaultValue={alldirections && alldirections[0]} options={alldirections && alldirections} />
                </div>
                <div className="col-1 ">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success w-100"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>
            </div>
            <div style={{ width: "1100px", overflow: "auto", height: "75vh" }} >
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white", position: "sticky", top: "0" }}>
                        <tr>
                            <th style={{ width: "50px" }} >№</th>
                            <th className='text-center'>F.I.O</th>
                            <th className='text-center'>Tug'ilgan yili</th>
                            {
                                directions && directions.map((direction, index) => {
                                    return (
                                        <th colSpan={2} key={index} className='text-center'>{direction.shortname}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            clients && clients.map((client, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td className='fish fw-bold px-2'>{client.lastname + " " + client.firstname}</td>
                                        <td className='fw-bold px-2'>{new Date(client.born).toLocaleDateString()}</td>
                                        {sections && sections[index].map((section, key) => {
                                            return (
                                                <>
                                                    <td className='text-center fw-bold text-success' style={{ width: "20px" }} key={key}>{section} </td>
                                                    <td className={`text-center px-0`} >
                                                        {tables && tables[index][key] ?
                                                            <input
                                                                onChange={(event) => editTables(event, index, key)}
                                                                defaultValue={tables[index][key].result}
                                                                style={{ width: "100px" }} />
                                                            : ""
                                                        }
                                                    </td>
                                                </>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
            <div className='text-center'>
                <button onClick={patchTables} className='btn btn-info'>Saqlash</button>
            </div>

            <div className='d-none' >
                <table id="reseptionReport" class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white", position: "sticky", top: "0" }}>
                        <tr>
                            <th style={{ width: "50px" }} >№</th>
                            <th className='text-center'>F.I.O</th>
                            <th className='text-center'>Tug'ilgan yili</th>
                            {
                                directions && directions.map((direction, index) => {
                                    return (
                                        <th colSpan={2} key={index} className='text-center'>{direction.shortname}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            clients && clients.map((client, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td className='fish fw-bold px-2'>{client.lastname + " " + client.firstname}</td>
                                        <td className='fw-bold px-2'>{new Date(client.born).toLocaleDateString()}</td>
                                        {sections && sections[index].map((section, key) => {
                                            return (
                                                <>
                                                    <td className='text-center fw-bold text-success' style={{ width: "20px" }} key={key}>{section} </td>
                                                    <td className={`text-center px-0`} >
                                                        {tables && tables[index][key] ?
                                                            tables[index][key].result
                                                            : ""
                                                        }
                                                    </td>
                                                </>
                                            )
                                        })}
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
