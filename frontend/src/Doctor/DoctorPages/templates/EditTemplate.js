import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import { useHistory, useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

toast.configure()
export const EditTemplate = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const history = useHistory()
    const headsectionid = useParams().headsectionid
    const directionid = useParams().directionid
    const [templates, setTemplates] = useState()
    const [deletetemplate, setDeleteTemplate] = useState()
    const [template, setTemplate] = useState({
        directionid: directionid,
        headsectionid: headsectionid,
        name: '',
        norma: ' ',
        result: ' ',
        additionalone: ' ',
        additionaltwo: ' ',
        accept: false
    })

    const [t, setT] = useState()
    const [tablecolumn, setTableColumn] = useState({
        direction: directionid,
        col1: ' ',
        col2: ' ',
        col3: ' ',
        col4: ' ',
        col5: ' '
    })

    const getTableColumn = useCallback(async () => {
        try {
            const fetch = await request(`/api/tablecolumn/${directionid}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            if (!fetch) {
                setTableColumn(fetch)
            }
        } catch (error) {
            notify(error)
        }
    }, [request, auth, directionid, setTableColumn])

    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/tabledirection/${directionid}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTemplates(fetch)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, directionid, setTemplates])

    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)

    const checkTemplate = () => {
        if (template.name === "") {
            return notify("Diqqat! Jadval nomini kiritish majburiy.")
        }

        setModal(true)
        window.scrollTo({ top: 0 })
    }

    const inputTemplate = (event) => {
        setTemplate({ ...template, [event.target.name]: event.target.value })
    }

    const createHandler = useCallback(async () => {
        try {
            const fetch = await request(`/api/tabledirection/register`, 'POST', { ...template, headsectionid, directionid }, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (error) {
            notify(error)
        }
    }, [request, auth, template, headsectionid, directionid])

    const Delete = useCallback(async () => {
        try {
            const fetch = await request(`/api/tabledirection/${deletetemplate._id}`, 'Delete', null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (error) {
            notify(error)
        }
    }, [request, auth, deletetemplate])

    const notify = (e) => {
        toast.error(e)
    }


    useEffect(() => {
        if (!t) {
            getTableColumn()
            setT(1)
        }
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
        <div className="container" style={{ marginTop: "90px" }}>
            <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                    <tr>
                        <th className='text-center'>Jadval nomi</th>
                        <th className='text-center'>Rezultat</th>
                        <th className='text-center'>Norma</th>
                        <th className='text-center'>Qo'shimcha1</th>
                        <th className='text-center'>Qo'shimcha2</th>
                        <th className='text-center'>Saqlash</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0'>
                            <textarea name='name' onChange={inputTemplate} className='form-control border border-white fw-bold' style={{ height: "100px" }} ></textarea>
                        </td>
                        <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0'>
                            <textarea name='result' onChange={inputTemplate} className='form-control border border-white' style={{ height: "100px" }} ></textarea>
                        </td>
                        <td style={{ width: "300px" }} className='text-center p-0 m-0'>
                            <textarea name='norma' onChange={inputTemplate} className='form-control border border-white' style={{ height: "100px" }} ></textarea>
                        </td>
                        <td style={{ width: "300px" }} className='text-center p-0 m-0'>
                            <textarea name='additionalone' onChange={inputTemplate} className='form-control border border-white' style={{ height: "100px" }} ></textarea>
                        </td>
                        <td style={{ width: "300px" }} className='text-center p-0 m-0'>
                            <textarea name='additionaltwo' onChange={inputTemplate} className='form-control border border-white' style={{ height: "100px" }} ></textarea>
                        </td>
                        <td style={{ width: "100px" }} className='text-center pt-4'>
                            <button onClick={checkTemplate} className='btn btn-info' ><FontAwesomeIcon icon={faSave} /> </button> </td>
                    </tr>
                </tbody>
            </table>

            <br />

            <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                    <tr>
                        <th className='text-center'>Jadval nomi</th>
                        <th className='text-center'>Rezultat</th>
                        <th className='text-center'>Norma</th>
                        <th className='text-center'>Qo'shimcha1</th>
                        <th className='text-center'>Qo'shimcha2</th>
                        <th className='text-center'>O'chirish</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        templates && templates.map((template, index) => {
                            return (
                                <tr>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {template.name}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {template.result}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {template.norma}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {template.additionalone}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {template.additionaltwo}
                                    </td>
                                    <td style={{ width: "100px" }} className='text-center pt-2'>
                                        <button onClick={() => { setDeleteTemplate(template); setModal2(true) }} className='btn button-danger' ><FontAwesomeIcon icon={faTrashAlt} /> </button> </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"} >
                <div className="modal-card">
                    <div className="card px-4" style={{ minWidth: "400px" }}>
                        <div className='fw-bold text-danger text-center fs-4 p-4'>
                            Diqqat! Ma'lumotlar to'g'ri to'ldirilganligini yana bir bor tasdiqlang.
                        </div>
                        <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                            <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                <tr>
                                    <th className='text-center'>Jadval nomi</th>
                                    <th className='text-center'>Norma</th>
                                    <th className='text-center'>Rezultat</th>
                                    <th className='text-center'>Qo'shimcha1</th>
                                    <th className='text-center'>Qo'shimcha2</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {template.name}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {template.norma}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {template.result}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {template.additionalone}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {template.additionaltwo}
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
                                    <th className='text-center'>Jadval nomi</th>
                                    <th className='text-center'>Rezultat</th>
                                    <th className='text-center'>Norma</th>
                                    <th className='text-center'>Qo'shimcha1</th>
                                    <th className='text-center'>Qo'shimcha2</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {deletetemplate && deletetemplate.name}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center fw-bold text-capitalize m-0 p-0 py-3'>
                                        {deletetemplate && deletetemplate.result}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {deletetemplate && deletetemplate.norma}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {deletetemplate && deletetemplate.additionalone}
                                    </td>
                                    <td style={{ width: "300px" }} className='text-center p-0 m-0 py-3'>
                                        {deletetemplate && deletetemplate.additionaltwo}
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
