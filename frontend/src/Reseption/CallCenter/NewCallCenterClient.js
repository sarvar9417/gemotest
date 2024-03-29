import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useHttp } from "../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { CheckClentData } from "./CheckClentData"
import { AuthContext } from "../context/AuthContext"
import '../CSS/radio.css'
const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

toast.configure()
export const NewCallCenterClient = () => {
  //Xatoliklar chiqaruvi
  const notify = (e) => {
    toast.error(e)
  }

  // Modal oyna funksiyalari
  let allPrice = 0
  const [modal, setModal] = useState(false)

  //Avtorizatsiyani olish
  const auth = useContext(AuthContext)
  let s = []


  // So'rov kutish va xatoliklarni olish
  const { loading, request, error, clearError } = useHttp()

  //Navbatni ro'yxatga olish
  const [turns, seTurns] = useState([])

  //Registratsiyadan o'tgan bo'limlarni olish
  const [sections, setSections] = useState([])
  const [source, setSource] = useState(" ")
  const [counteragent, setCounterAgent] = useState(" ")

  // Mijoz sxemasi
  const [client, setClient] = useState({
    firstname: "",
    lastname: "",
    fathername: "",
    gender: "",
    phone: "",
    id: 0,
    born: "",
    address: ""
  })

  const call = useParams().id
  const [callData, setCallData] = useState()
  const getCall = useCallback(async () => {
    try {
      const data = await request(`/api/callcenter/${call}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      getClient(data.client)
      setCallData({
        _id: data._id,
        position: 'Kelgan',
        illness: data.illness,
        voucher: data.voucher,
        client: data.client,
        callDay: data.callDay
      })
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setCallData, call])

  const getClient = useCallback(async (client) => {
    try {
      const data = await request(`/api/clients/reseption/${client}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setClient(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setClient])

  //Boshqa sahifaga yo'naltirish yuklanishi
  const history = useHistory()

  // Bo'limlar
  const [options, setOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOptions(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setOptions])

  // =================================================================================
  // =================================================================================
  // Servislar bo'limi
  const [services, setServices] = useState()
  const [warehouse, setWarehouse] = useState()
  const getWarehouse = useCallback(async () => {
    try {
      const fetch = await request('/api/warehouse/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setWarehouse(fetch)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setWarehouse])

  const changeServices = (event) => {
    s = []
    event.map((service) => {
      s.push({
        warehouse: service._id,
        name: service.name,
        type: service.type,
        price: service.price,
        pieces: 1,
        priceone: service.price,
        payment: "kutilmoqda",
        priceCashier: 0,
        commentCashier: " ",
        paymentMethod: " "
      })
    })
    setServices(s)
  }
  const changePieces = (event) => {
    const key = parseInt(event.target.id)
    setServices(
      Object.values({
        ...services,
        [key]: {
          ...services[key],
          pieces: parseInt(event.target.value),
          price: parseInt(services[key].priceone) * parseInt(event.target.value)
        },
      })
    )
  }

  const createAllServices = (id, connector) => {
    services.map((service) => {
      createService(id, service, connector)
    })
  }

  const createService = async (id, service, connector) => {
    try {
      const data = await request(`/api/service/register`, "POST", { ...service, connector, client: id }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  // =================================================================================
  // =================================================================================


  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value })
  }

  const changeDate = (event) => {
    setClient({ ...client, born: new Date(event.target.value) })
  }


  const changeSections = (event) => {
    s = []
    event.map((section) => {
      let turn = 0
      turns.map((sec) => {
        if (checkTurn(sec, section.section)) {
          turn++
        }
      })
      s.map((sec) => {
        if (sec.name === section.section) {
          turn++
        }
      })
      s.push({
        name: section.section,
        subname: section.subsection,
        price: section.price,
        priceCashier: 0,
        commentCashier: " ",
        comment: " ",
        summary: " ",
        done: "tasdiqlanmagan",
        payment: "kutilmoqda",
        turn: turn + 1,
        bron: "callcenter",
        bronDay: new Date(),
        bronTime: " ",
        position: "callcenter",
        checkup: "chaqirilmagan",
        doctor: " ",
        counteragent: counteragent,
        paymentMethod: " ",
        source: source
      })
    })
    setSections(s)
  }

  const createSections = (event) => {
    let key = parseInt(event.target.id)
    setSections(
      Object.values({
        ...sections,
        [key]: { ...sections[key], price: event.target.value },
      }),
      () =>
        setSections(
          Object.values({
            ...sections,
            [key]: { ...sections[key], turn: parseInt(event.target.name) },
          })
        )
    )
  }

  const allClients = useCallback(async () => {
    try {
      const fetch = await request("/api/clients/reseption/length", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      const sec = await request("/api/section/reseption/turn", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      seTurns(sec)
      client.id = fetch + 1000001
    } catch (e) {
      notify(e)
    }
  }, [request, auth, client])

  const checkData = () => {
    if (CheckClentData(client)) {
      return notify(CheckClentData(client))
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }


  const createHandler = async () => {
    try {
      const caller = await request(`/api/callcenter/${callData._id}`, "PATCH", { ...callData }, {
        Authorization: `Bearer ${auth.token}`
      })
      createConnector(callData.client)
    } catch (e) {
      notify(e)
    }
  }

  const createConnector = async (client) => {
    try {
      const connector = await request("/api/connector/register", "POST", {
        client,
        source,
        counteragent,
        type: "callcenter",
        position: " ",
        prepayment: 0,
        diagnosis: " ",
        bronDay: new Date(),
        prepaymentCashier: 0,
      }, {
        Authorization: `Bearer ${auth.token}`
      })
      createAllSections(client, connector._id)
      createAllServices(client, connector._id)
    } catch (e) {
      notify(e)
    }
  }

  const createAllSections = (id, connector) => {
    sections.map((section) => {
      create(id, section, connector)
    })
    history.push(`/reseption/clients`)
  }

  const create = async (id, section, connector) => {
    try {
      const data = await request(`/api/section/reseption/register/${id}`, "POST", { ...section, connector }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }

  const checkTurn = (turn, name) => {
    if (
      mongoose.Types.ObjectId(turn._id).getTimestamp().getFullYear() ===
      new Date().getFullYear() &&
      mongoose.Types.ObjectId(turn._id).getTimestamp().getMonth() ===
      new Date().getMonth() &&
      mongoose.Types.ObjectId(turn._id).getTimestamp().getDate() ===
      new Date().getDate() &&
      turn.name === name
    )
      return true
    return false
  }

  useEffect(() => {
    if (!options) {
      getOptions()
    }

    if (error) {
      notify(error)
      clearError()
    }
    if (!callData) {
      getCall()
    }
    if (!warehouse) {
      getWarehouse()
    }
    if (client.id === 0) {
      allClients()
    }
  }, [notify, clearError])

  return (
    <div className="container">
      <div className="col-lg-6 offset-lg-3">
        <div className="row" >
          <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
            <h4 className="text-right">Call Center mijozi</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-2 input_box" >
            <input
              defaultValue={client.lastname}
              onChange={changeHandlar}
              name="lastname"
              type="text"
              className="form-control inp"
              placeholder=""
            />
            <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
          </div>
          <div className="col-md-6 mb-2 input_box" >
            <input
              defaultValue={client.firstname}
              onChange={changeHandlar}
              name="firstname"
              type="text"
              className="form-control inp"
              placeholder=""
            />
            <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
          </div>
        </div>
        <div className="row" style={{ padding: "15px 0" }}>
          <div className="col-md-6 mb-2 input_box" >
            <input
              defaultValue={client.fathername}
              onChange={changeHandlar}
              name="fathername"
              type="text"
              className="form-control inp"
              placeholder=""
            />
            <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Otasining ismi</label>
          </div>
          <div className="col-md-6 mb-2 input_box" >
            <input
              value={new Date(client.born).getFullYear().toString() + '-' + (new Date(client.born).getMonth() < 9 ? "0" + (new Date(client.born).getMonth() + 1).toString() : (new Date(client.born).getMonth() + 1).toString()) + '-' + (new Date(client.born).getDate() < 10 ? "0" + (new Date(client.born).getDate()).toString() : (new Date(client.born).getDate()).toString())}
              onChange={changeDate}
              type="date"
              name="born"
              className="form-control inp"
              placeholder=""
              style={{ color: "#999" }}
            />
            <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan sanasi</label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-2" >
            <div className="form-group">
              <div className="btn-group">
                <div className="wrapp">
                  <input
                    className="input"
                    id="erkak"
                    onClick={changeHandlar}
                    name="gender"
                    type="radio"
                    defaultValue="man"
                    checked={client.gender === "man" ? true : false}
                  />
                  <label
                    className={client.gender === "man" ? "label clabel" : "label"}
                    htmlFor="erkak"
                  >
                    Erkak
                  </label>
                  <input
                    checked={client.gender === "woman" ? true : false}
                    className="input"
                    type="radio"
                    id="ayol"
                    onChange={changeHandlar}
                    name="gender"
                    defaultValue="woman"
                  />
                  <label
                    className={
                      client.gender === "woman" ? "label clabel" : "label"
                    }
                    htmlFor="ayol"
                  >
                    Ayol
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-2 input_box" >
            <input
              defaultValue={client.phone}
              onChange={changeHandlar}
              type="number"
              name="phone"
              maxLength="12"
              minLength="12"
              className="form-control inp"
              placeholder=""
            />
            <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Telefon raqami</label>
          </div>
          <div className="col-12">
            <input
              defaultValue={client.address}
              onChange={changeHandlar}
              name="address"
              type="text"
              className="form-control inp"
              placeholder="Mijozning manzili"
            />
            <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Mijoz manzili</label>
          </div>
        </div>

        <div className="row pt-3">
          <div className="col-12" >
            <p className="m-0 ps-2">Bo'limni tanlang</p>
            <Select
              className=""
              onChange={(event) => changeSections(event)}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={options && options}
            />
            {sections && sections.map((section, key) => {
              return (
                <div className="row">
                  <div className="col-6">
                    <input
                      disabled
                      value={section.name + " " + section.subname}
                      id={key}
                      className="form-control mt-2"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      disabled
                      value={section.price}
                      id={key}
                      className="form-control mt-2"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="col-12 mt-5" >
            <p className="m-0 ps-2">Xizmatni tanlang</p>
            <Select
              className=""
              onChange={(event) => changeServices(event)}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={warehouse && warehouse}
            />
            {services && services.map((service, key) => {
              return (
                <div className="row">
                  <div className="col-4">
                    <input
                      disabled
                      value={service.name + " " + service.type}
                      id={key}
                      className="form-control mt-2"
                    />
                  </div>
                  <div className="col-4">
                    <input
                      onChange={changePieces}
                      defaultValue={service.pieces}
                      id={key}
                      className="form-control mt-2"
                    />
                  </div>
                  <div className="col-4">
                    <input
                      disabled
                      value={service.price}
                      id={key}
                      className="form-control mt-2"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-5 text-center" >
          <button onClick={checkData} className="btn btn-primary profile-button mb-5">
            Saqlash
          </button>
        </div>

        {/* Modal oynaning ochilishi */}
        <div className={modal ? "modal" : "d-none"}>
          <div className="modal-card">
            <div className="card p-4" style={{ fontFamily: "times" }}>
              <div className="text-center fs-4 fw-bold text-secondary">
                <span className="text-dark">Mijoz: </span>  {client.lastname} {client.firstname} {client.fathername}
              </div>
              <table className="w-100 mt-3" style={{ overflow: "auto" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #999" }} >
                    <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                    <th style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                  </tr>
                </thead>
                <tbody style={{ borderBottom: "1px solid #999" }}>

                  {
                    sections.map((section, key) => {
                      allPrice = allPrice + section.price
                      return (
                        <tr key={key}>
                          <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                          <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                            {section.name} {section.subname}
                          </td>
                          <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                        </tr>
                      )
                    })
                  }
                  {
                    services && services.map((service, key) => {
                      allPrice = allPrice + service.price
                      return (
                        <tr key={key}>
                          <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                          <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                            {service.name} {service.type}
                          </td>
                          <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.price}</td>
                        </tr>
                      )
                    })
                  }

                </tbody>
              </table>

              <div className="row m-1 mt-3">
                <div className="col-6">
                  <div className="fw-bold text-primary">Jami to'lov:</div>
                </div>
                <div className="col-6">
                  <div className="fw-bold  text-end ">{allPrice}</div>
                </div>
                <hr />

              </div>
              <div className="row m-1">
                <div className="col-12 text-center">
                  <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                  <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
