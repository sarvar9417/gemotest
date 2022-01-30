import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

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
