import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

toast.configure()
export const HeadDirections = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError } = useHttp()
    const notify = (e) => {
        toast.error(e)
    }

    const [headdirections, setHeadDirections] = useState()
    const getHeadDirections = useCallback(async () => {
        try {
            const fetch = await request('/api/headsection/', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setHeadDirections(fetch)
        } catch (error) {
            notify(error)
        }
    }, [auth, request, setHeadDirections, notify])

    const Delete = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/headsection/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
            notify("Bo'lim o'chirildi")
        } catch (error) {
            notify(error)
        }
    }, [auth, request, notify])

    useEffect(() => {
        if (!headdirections) {
            getHeadDirections()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    return (
        <div>
            <div className="row p-3">
                <div className="col-12 text-end">
                    <Link to="/director/addheaddirection" className="btn button-success">
                        Bo'lim yaratish
                    </Link>
                </div>
            </div>
            <div className="card" style={{ minWidth: "800px" }}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className="text-center" scope="col">№</th>
                            <th className="text-center" scope="col">Nomi</th>
                            <th className="text-center" scope="col">Barcha xizmatlar</th>
                            <th className="text-center" scope="col">Tahrirlash</th>
                            <th className="text-center" scope="col">O'chirish</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            headdirections && headdirections.map((agent, index) => {
                                return (
                                    <tr key={index}>
                                        <th className="text-center" >{index + 1}</th>
                                        <td className="ps-3 text-success fw-bolder pt-3"> {agent.name} </td>
                                        <td className="text-center">
                                            <Link to={`/director/directions/${agent._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48" }}>
                                                Barcha xizmatlar
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            <Link to={`/director/editheaddirection/${agent._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48" }}>
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            <button onClick={() => Delete(agent._id)} className="btn button-danger">
                                                <FontAwesomeIcon icon={faTrashAlt} />
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
