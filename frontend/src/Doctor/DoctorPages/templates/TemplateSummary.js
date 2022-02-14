import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons'


toast.configure()
export const TemplateSummary = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const history = useHistory()
    const [template, setTemplate] = useState({
        headsection: auth && auth.doctor.section,
        template: "",
        section: ""
    })
    const [deletetemplate, setDeleteTemplate] = useState()

    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)

    const checkTemplate = () => {
        if (template.subsection === "") {
            return notify("Iltimos shablon nomini kiriting")
        }
        if (template.template === "") {
            return notify("Iltimos shablonni kiriting")
        }

        setModal(true)
        window.scrollTo({ top: 0 })
    }

    const inputTemplate = (event) => {
        setTemplate({ ...template, [event.target.name]: event.target.value })
    }

    const createHandler = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor/register`, 'POST', { ...template }, {
                Authorization: `Bearer ${auth.token}`
            })
            getTemplates()
            setModal(false)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, template, setModal])

    const notify = (e) => {
        toast.error(e)
    }

    const [templates, setTemplates] = useState()
    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor/section/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTemplates(fetch)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, setTemplates])

    const Delete = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor/${deletetemplate._id}`, 'Delete', null, {
                Authorization: `Bearer ${auth.token}`
            })
            getTemplates()
            setModal2(false)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, deletetemplate, getTemplates, setModal2])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!templates) {
            getTemplates()
        }
    }, [notify, clearError, getTemplates])

    if (loading) {
        return <Loader />
    }


    return (
        <div>
            <div className="container" style={{ marginTop: "90px" }}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className='text-center'>
                                Xizmat turi
                            </th>
                            <th className='text-center'>
                                Xizmat shabloni
                            </th>
                            <th className='text-center'>

                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0'>
                                <textarea name='section' onChange={inputTemplate} className='form-control border border-white fw-bold' style={{ height: "100px" }} ></textarea>
                            </td>
                            <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0'>
                                <textarea name='template' onChange={inputTemplate} className='form-control border border-white' style={{ height: "100px" }} ></textarea>
                            </td>
                            <td style={{ width: "100px" }} className='text-center pt-4'>
                                <button onClick={checkTemplate} className='btn btn-info' ><FontAwesomeIcon icon={faSave} /> </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />

                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className='text-center'>Xizmat nomi</th>
                            <th className='text-center'>Xizmat shabloni</th>
                            <th className='text-center'>O'chirish</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            templates && templates.map((template, index) => {
                                return (
                                    <tr>
                                        <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                            {template.section}
                                        </td>
                                        <td style={{ width: "300px" }} className='text-capitalize m-0 p-0 py-3'>
                                            <pre>{template.template}</pre>
                                        </td>
                                        <td style={{ width: "100px" }} className='text-center pt-2'>
                                            <button onClick={() => { setDeleteTemplate(template); setModal2(true) }} className='btn button-danger' ><FontAwesomeIcon icon={faTrashAlt} /> </button> </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"} >
                <div className="modal-card">
                    <div className="card px-4" style={{ minWidth: "400px" }}>
                        <div className='fw-bold text-danger text-center fs-4 p-4'>
                            Diqqat! Ushbu shablon shablonlar ro'yxatiga qo'shilshini tasdiqlaysizmi?
                        </div>
                        <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                            <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                <tr>
                                    <th className='text-center'>Xizmat nomi</th>
                                    <th className='text-center'>Xizmat shabloni</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {template.section}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-capitalize m-0 p-0 py-3'>
                                        <pre>{template.template}</pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-center pb-4' >
                            <button onClick={createHandler} className='btn button-success me-5 px-4' >Saqlash</button>
                            <button onClick={() => setModal(false)} className='btn button-danger px-4' >Qaytish</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal2 ? "modal" : "d-none"} >
                <div className="modal-card">
                    <div className="card px-4" style={{ minWidth: "400px" }}>
                        <div className='fw-bold text-danger text-center fs-4 p-4'>
                            Diqqat! Ushbu jadval jadvallar ro'yxatidan o'chirilishini tasdiqlaysizmi?.
                        </div>
                        <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                            <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                <tr>
                                    <th className='text-center'>Xizmat nomi</th>
                                    <th className='text-center'>Xizmat shabloni</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {deletetemplate && deletetemplate.section}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center text-capitalize m-0 p-0 py-3'>
                                        <pre>
                                            {deletetemplate && deletetemplate.template}
                                        </pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-center pb-4' >
                            <button onClick={Delete} className='btn btn-danger me-5 px-4' >O'chirish</button>
                            <button onClick={() => setModal2(false)} className='btn button-danger px-4' >Qaytish</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
