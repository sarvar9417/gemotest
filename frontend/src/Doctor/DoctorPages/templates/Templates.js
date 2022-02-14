import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSave } from '@fortawesome/free-solid-svg-icons'
import { types } from 'joi'
import Select from "react-select"
import makeAnimated from "react-select/animated"
const animatedComponents = makeAnimated()

toast.configure()
export const Templates = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const [templates, setTemplates] = useState()
    const [alltemplates, setAllTemplates] = useState()
    const [types, setTypes] = useState()
    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction/doctor/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTemplates(fetch)
            let s = [{
                label: "Barcha xizmatlar",
                value: "all"
            }]
            fetch.map((d) => {
                s.push({
                    label: d.section,
                    value: d.section,
                })
            })
            const ids = s.map(o => o.label)
            const filtered = s.filter(({ label }, index) => !ids.includes(label, index + 1))
            setTypes(filtered)
            setAllTemplates(fetch)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, setTypes, setTemplates, setAllTemplates])

    const notify = (e) => {
        toast(e)
    }

    const setTableTurn = (index, event) => {
        let t = [...templates]
        t[index].tableturn = parseInt(event.target.value)
        setTemplates(t)
    }

    const setTable = (index, event) => {
        let t = [...templates]
        t[index].table = event.target.checked
        setTemplates(t)
    }


    const patchDirection = useCallback(async (index) => {
        try {
            const fetch = await request(`/api/direction/${templates[index]._id}`, 'PATCH', templates[index], {
                Authorization: `Bearer ${auth.token}`
            })
            toast.success("O'zgartirish muvaffaqqiyatli saqlandi!")
        } catch (error) {
            notify(error)
        }
    }, [request, auth, templates])

    useEffect(() => {
        if (!templates) {
            getTemplates()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    //=================================================================================
    //=================================================================================
    //=================================================================================
    // FISH bilan qidirish
    const [fish, setFish] = useState()
    const searchName = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction/doctor/${auth.doctor.section}/${fish}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTemplates(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setTemplates, fish])

    const changeTypeOptions = (event) => {
        let s = []
        if (event.value === "all") {
            setTemplates(alltemplates)
        } else {
            alltemplates && alltemplates.map(op => {
                if (op.section === event.value) {
                    s.push(op)
                }
            })
            setTemplates(s)
        }
    }


    if (loading) {
        return <Loader />
    }

    return (
        <div className="container" style={{ marginTop: "90px" }}>
            <div className='row' >
                <div className='col-3'>
                    <input onChange={(event) => { setFish(event.target.value) }} className='form-control w-75 d-inline-block me-2' placeholder='Xizmat nomini kiriting' />
                    <button onClick={searchName} className="btn text-white float-end" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className='col-6'>
                    <h4 className="text-center py-3"> Barcha xizmatlar </h4>
                </div>
                <div className='col-3'>
                    <Select
                        className=""
                        onChange={changeTypeOptions}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        options={types && types}
                    />
                </div>
            </div>
            <div>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th style={{ width: "50px" }} >№</th>
                            <th className='text-center'>Xizmat nomi</th>
                            <th className='text-center'>Xizmat turi</th>
                            <th className='text-center'>Xizmat jadvallari</th>
                            <th className='text-center'>Jadvaldagi o'rni</th>
                            <th className='text-center'>Jadvalda ko'rinishi</th>
                            <th className='text-center'>Saqlash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            templates && templates.map((template, index) => {
                                return (
                                    <tr>
                                        <td className='fw-bold text-center'>{index + 1}</td>
                                        <td className='fw-bold text-center'>{template.section}</td>
                                        <td className='fw-bold text-center'>{template.subsection}</td>
                                        <td className='text-center'> <Link to={`/doctor/edittemplate/${template.headsection}/${template._id}`} className='btn btn-info'> <FontAwesomeIcon icon={faPenAlt} /></Link> </td>
                                        <td className='fw-bold text-center px-2'>
                                            <input
                                                style={{ width: "70px" }}
                                                type="number"
                                                className='form-control m-auto'
                                                defaultValue={template.tableturn}
                                                onChange={(event) => setTableTurn(index, event)}
                                            />
                                        </td>
                                        <td className='fw-bold text-center'>
                                            <input
                                                type="checkbox"
                                                style={{ width: "20px", height: "20px" }}
                                                onChange={(event) => setTable(index, event)}
                                                defaultChecked={template.table}
                                            />
                                        </td>
                                        <td className='fw-bold text-center'>
                                            <button className='btn btn-info' onClick={() => patchDirection(index)}>
                                                <FontAwesomeIcon icon={faSave} />
                                            </button>
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
