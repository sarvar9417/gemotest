import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckDirection } from './CheckDirection'
import { Loader } from '../../components/Loader'
import '../tableStyle.css'

toast.configure()

export const AddDirection = () => {
  const auth = useContext(AuthContext)
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)
  const headId = useParams().id
  //Direction ma'lumotlari
  const [direction, setDirection] = useState({
    value: "",
    price: "",
    section: "",
    headsection: headId && headId,
    subsection: "",
    shortname: "",
    label: "",
    room: "",
    doctorProcient: "",
    counteragentProcient: "",
    counterDoctor: "",
    norma: " ",
    result: " ",
    additionalone: " ",
    additionaltwo: " ",
  })

  //Direction ma'lumotlari
  const [headdirection, setHeadDirection] = useState()

  const getHeadDirection = useCallback(async () => {
    try {
      const fetch = await request(`/api/headsection/${headId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })

      setHeadDirection({
        name: fetch.name
      })

    } catch (error) {
      notify(error)
    }
  }, [auth, request, setHeadDirection])

  const changeSection = (event) => {
    setDirection({
      ...direction,
      section: event.target.value,
      value: headdirection && headdirection.name + " " + event.target.value + " " + direction.subsection,
      label: headdirection && headdirection.name + " " + event.target.value + " " + direction.subsection
    })
  }

  const changeSubsection = (event) => {
    setDirection({
      ...direction,
      subsection: event.target.value,
      value: headdirection && headdirection.name + " " + direction.section + " " + event.target.value,
      label: headdirection && headdirection.name + " " + direction.section + " " + event.target.value
    })
  }

  const changeShortname = (event) => {
    setDirection({
      ...direction,
      shortname: event.target.value,
    })
  }

  const changePrice = (event) => {
    setDirection({ ...direction, price: parseInt(event.target.value) })
  }

  const changeRoom = (event) => {
    setDirection({ ...direction, room: event.target.value })
  }

  const checkDirection = () => {
    if (CheckDirection(direction)) {
      return notify(CheckDirection(direction))
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/direction/register", "POST", { ...direction }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push(`/director/directions/${headId}`)
    } catch (e) {
      notify(e)
    }
  }

  const changeProcient = (event) => {
    setDirection({ ...direction, [event.target.name]: parseInt(event.target.value) })
  }

  const notify = (e) => {
    toast.error(e)
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
    if (!headdirection) {
      getHeadDirection()
    }
  }, [notify, clearError, getHeadDirection])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className=" table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Bo'lim nomi</th>
                      <th className="text-center">Xizmat nomi</th>
                      <th className="text-center">Xizmat turi</th>
                      <th className="text-center">Xizmatning qisqartma nomi</th>
                      <th className="text-center">Xizmat narxi</th>
                      <th className="text-center">Xizmat xonasi</th>
                      <th className="text-center">Doctor ulushi</th>
                      <th className="text-center">Medpridstovitel ulushi</th>
                      <th className="text-center">Yo'llanma bergan doctor ulushi</th>
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center"><input style={{ width: "100px" }} defaultValue={headdirection && headdirection.name} disabled name="lastname" className="addDirection" /></td>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> <input style={{ width: "100px" }} defaultValue={direction.section} onChange={changeSection} name="lastname" className="addDirection" /> </span>
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> <input style={{ width: "100px" }} defaultValue={direction.subsection} onChange={changeSubsection} name="lastname" className="addDirection" /> </span>
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> <input style={{ width: "100px" }} defaultValue={direction.shortname} onChange={changeShortname} name="lastname" className="addDirection" /> </span>
                        </span>
                      </td>
                      <td className="text-center"><input style={{ width: "100px" }} defaultValue={direction.price} onChange={changePrice} type="number" name="lastname" className="addDirection" /> sum</td>
                      <td className="text-center"><input style={{ width: "100px" }} defaultValue={direction.room} onChange={changeRoom} name="room" className="addDirection" /></td>
                      <td className="text-center"><input style={{ width: "100px" }} type="number" defaultValue={direction.doctorProcient} onChange={changeProcient} name="doctorProcient" className="addDirection" /></td>
                      <td className="text-center"><input style={{ width: "100px" }} type="number" defaultValue={direction.counteragentProcient} onChange={changeProcient} name="counteragentProcient" className="addDirection" /></td>
                      <td className="text-center"><input style={{ width: "100px" }} type="number" defaultValue={direction.counterDoctor} onChange={changeProcient} name="counterDoctor" className="addDirection" /></td>
                      <td className="text-center"><button onClick={checkDirection} className="btn button-success" >Saqlash</button> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div className={modal ? "modal" : "d-none"}>
        <div className="modal-card">

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Bo'lim nomi</th>
                      <th className="text-center">Xizmat nomi</th>
                      <th className="text-center">Xizmat turi</th>
                      <th className="text-center">Xizmat narxi</th>
                      <th className="text-center">Xizmat xonasi</th>
                      <th className="text-center">Doctor ulushi</th>
                      <th className="text-center">Medpridstovitel ulushi</th>
                      <th className="text-center">Yo'llanma bergan doctor ulushi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center" style={{ width: "200px" }}>{headdirection && headdirection.name}</td>
                      <td className="text-center" style={{ width: "200px" }}>
                        <span className="table-avatar">
                          <span href="profile.html"> {direction.section} </span>
                        </span>
                      </td>
                      <td className="text-center" style={{ width: "200px" }}>
                        <span className="table-avatar">
                          <span href="profile.html"> {direction.subsection} </span>
                        </span>
                      </td>
                      <td className="text-center" style={{ width: "100px" }}>{direction.price} sum</td>
                      <td className="text-center" style={{ width: "100px" }}>{direction.room}</td>
                      <td className="text-center" style={{ width: "100px" }}>{direction.doctorProcient}</td>
                      <td className="text-center" style={{ width: "100px" }}>{direction.counteragentProcient}</td>
                      <td className="text-center" style={{ width: "100px" }}>{direction.counterDoctor}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className=" text-center">
                <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div >
  )
}
