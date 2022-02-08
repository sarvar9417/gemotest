import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faSyncAlt, faSave } from '@fortawesome/free-solid-svg-icons'

toast.configure()
export const Templates = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const [templates, setTemplates] = useState()
    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction/doctor/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTemplates(fetch)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, setTemplates])

    const notify = (e) => {
        toast(e)
    }

    const setTableTurn = (index, event) => {
        let t = [...templates]
        t[index].tableturn = parseInt(event.target.value)
        setTemplates(t)
    }

    const setTable = (index, event) => {
        console.log(event.target.checked);
        let t = [...templates]
        t[index].table = event.target.checked
        setTemplates(t)
    }

    console.log(templates);

    const patchDirection = useCallback(async (index) => {
        try {
            console.log(index);
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

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container" style={{ marginTop: "90px" }}>
            <div>
                <h4 className="text-center py-3"> Barcha xizmatlar </h4>
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
