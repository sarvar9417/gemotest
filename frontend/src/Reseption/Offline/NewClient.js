import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useHttp } from "../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { CheckClentData } from "../Online/CheckClentData"
import { AuthContext } from "../context/AuthContext"
import { Loader } from "../components/Loader"
import '../CSS/radio.css'
const mongoose = require("mongoose")
const animatedComponents = makeAnimated()



toast.configure()
export const NewClient = () => {
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
  const { request, error, clearError, loading } = useHttp()

  const [advertisement, setAdvertisement] = useState(false)
  const [sources, setSources] = useState()
  const [source, setSource] = useState(" ")

  //==============================================================================
  //==============================================================================
  //Counteragents begin
  const [counteragent, setCounterAgent] = useState()
  const [counteragents, setCounterAgents] = useState()
  const getCounterAgents = useCallback(async () => {
    try {
      const fetch = await request('/api/counterdoctor', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let c = [{
        label: "Tanlanmagan",
        value: " ",
        counterdoctor: "",
        counteragent: "",
      }]
      fetch.map((data) => {
        c.push({
          label: data.clinic.toUpperCase() + " " + data.lastname + " " + data.firstname,
          value: data.lastname + " " + data.firstname,
          counterdoctor: data._id,
          counteragent: data.counteragent
        })
      })
      setCounterAgents(c)
    } catch (error) {
      notify(error.message)
    }
  }, [auth, request, setCounterAgents])

  const changeCounterAgent = (event) => {
    if (event.label === "Tanlanmagan") {
      setCounterAgent(null)
    } else {
      setCounterAgent({
        counteragent: event.counteragent,
        counterdoctor: event.counterdoctor,
        paymentDay: new Date()
      })
    }
  }

  const createPaymentCounteragent = async (client, connector) => {
    try {
      const data = await request(`/api/counteragentpayment/reseption/register`, "POST", { ...counteragent, connector, client }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  //==============================================================================
  //==============================================================================

  const getSources = useCallback(async () => {
    try {
      const fetch = await request('/api/source/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setSources(fetch)
    } catch (error) {
      notify(error.message)
    }
  }, [auth, request, setSources])

  //Navbatni ro'yxatga olish
  const [turns, seTurns] = useState([])

  //Registratsiyadan o'tgan bo'limlarni olish
  const [sections, setSections] = useState()

  //Boshqa sahifaga yo'naltirish yuklanishi
  const history = useHistory()

  // Bo'limlar
  const [options, setOptions] = useState()
  const [alloptions, setAllOptions] = useState()
  const [typeoptions, setTypeOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      let s = [{
        label: "Barcha xizmatlar",
        value: "all"
      }]
      let all = []
      data.map((d) => {
        s.push({
          label: d.section,
          value: d.section,
        })
        all.push({
          _id: d._id,
          value: d.value,
          label: d.subsection,
          section: d.section,
          headsection: d.headsection,
          subsection: d.subsection,
          shortname: d.shortname,
          price: d.price,
          room: d.room,
          doctorProcient: d.doctorProcient,
          counteragentProcient: d.counteragentProcient,
          counterDoctor: d.counterDoctor,
          norma: d.norma,
          result: d.result,
          additionalone: d.additionalone,
          additionaltwo: d.additionaltwo
        })
      })
      const ids = s.map(o => o.label)
      const filtered = s.filter(({ label }, index) => !ids.includes(label, index + 1))
      setTypeOptions(filtered)
      setAllOptions(all)
      setOptions(all)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setAllOptions, setTypeOptions, setOptions,])

  const changeTypeOptions = (event) => {
    let s = []
    if (event.value === "all") {
      setOptions(alloptions)
    } else {
      alloptions && alloptions.map(op => {
        if (op.section === event.value) {
          s.push(op)
        }
      })
      setOptions(s)
    }
  }

  // Mijoz sxemasi
  const [client, setClient] = useState({
    firstname: "",
    lastname: "",
    fathername: " ",
    gender: "",
    phone: "998",
    id: 0,
    born: "",
    address: " "
  })

  const [headdirections, setHeadDirections] = useState()
  const getHeadDirections = useCallback(async () => {
    try {
      const fetch = await request('/api/headsection/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setHeadDirections(fetch)
    } catch (error) {
      notify(error.message)
    }
  }, [auth, request, setHeadDirections, notify])

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
      let s = []
      fetch.map(p => {
        s.push({
          label: p.name + " " + p.type,
          value: p.name + " " + p.type,
          name: p.name,
          type: p.type,
          price: p.price,
          _id: p._id
        })
      })
      setWarehouse(s)
    } catch (error) {
      notify(error.message)
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
    services && services.map((service) => {
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

  const changeSource = (name) => {
    sections && sections.map((section, key) => {
      setSections(
        Object.values({
          ...sections,
          [key]: { ...sections[key], source: name },
        })

      )

    })
    setSource(name)
  }

  const [ids, setIds] = useState([])
  const changeSections = (event) => {
    s = []
    let i = []
    let prob = false
    event.map((section) => {
      i.push(section._id)
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
      let headname
      let p = false
      headdirections.map(h => {
        if (h._id === section.headsection) {
          headname = h.name
          if (h.probirka) {
            prob = true
            p = true
          }
        }
      })
      s.push({
        name: section.section,
        subname: section.subsection,
        shortname: section.shortname,
        headsection: headname,
        price: section.price,
        priceCashier: 0,
        commentCashier: " ",
        comment: " ",
        summary: " ",
        done: "tasdiqlanmagan",
        payment: "kutilmoqda",
        turn: p ? turnlab : turn + 1,
        bron: "offline",
        bronDay: new Date(),
        bronTime: " ",
        position: "offline",
        checkup: "chaqirilmagan",
        doctor: " ",
        counteragent: " ",
        paymentMethod: " ",
        source: source,
        nameid: section._id,
        headsectionid: section.headsection,
        accept: false,
        probirka: p
      })

    })
    setSections(s)
    setIds(i)
    setCheckProbirka(prob)
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
      const data = await request("/api/clients/reseption/register", "POST", { ...client }, {
        Authorization: `Bearer ${auth.token}`
      })
      createConnector(data._id)
    } catch (e) {
      notify(e)
    }
  }

  const [probirka, setProbirka] = useState()
  const [checkProbirka, setCheckProbirka] = useState(false)

  const getProbirka = useCallback(async () => {
    try {
      const fetch = await request("/api/connector/probirka", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setProbirka(fetch + 1)
    } catch (e) {
      notify(e)
    }
  }, [request, auth, setProbirka])

  const createConnector = async (client) => {
    try {
      const connector = await request("/api/connector/register", "POST", {
        client,
        source,
        counteragent: counteragent ? counteragent.counteragent : " ",
        type: "offline",
        position: " ",
        doctor: " ",
        diagnosis: " ",
        bronDay: new Date(),
        prepaymentCashier: 0,
        accept: false,
        probirka: checkProbirka && probirka ? probirka : 0
      }, {
        Authorization: `Bearer ${auth.token}`
      })
      createAllSections(client, connector._id)
      createAllServices(client, connector._id)
      counteragent && createPaymentCounteragent(client, connector._id)
    } catch (e) {
      notify(e.message)
    }
  }

  const createAllSections = (id, connector) => {
    sections && sections.map((section) => {
      create(id, section, connector)
    })
    WareUseds(connector)
    toast.success("Mijoz yaratildi.")
    history.push(`/reseption/reciept/${id}/${connector}`)
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

  // =================================================================================
  // =================================================================================
  //Omborxona

  const [wareconnectors, setWareConnectors] = useState()
  const getWareConnectors = useCallback(async () => {
    try {
      const fetch = await request("/api/wareconnector", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setWareConnectors(fetch)
    } catch (e) {
      notify(e)
    }
  }, [request, auth, setWareConnectors])

  const WareUseds = (bind) => {
    let wareuseds = []
    ids && ids.map((id) => {
      wareconnectors && wareconnectors.map((wareconnector) => {
        if (id === wareconnector.section) {
          wareuseds.push({
            section: wareconnector.section,
            sectionname: wareconnector.sectionname,
            warehouse: wareconnector.warehouse,
            warehousename: wareconnector.warehousename,
            count: wareconnector.count,
            connector: bind,
            day: new Date()
          })
        }
      })
    })
    createWareUseds(wareuseds)
  }

  const createWareUseds = useCallback(async (wareuseds) => {
    try {
      const fetch = await request(`/api/wareused/register`, "POST", wareuseds, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }, [request, auth])
  // =================================================================================
  // =================================================================================

  const [turnlab, setTurnlab] = useState()
  const getTurnlab = useCallback(async () => {
    try {
      const fetch = await request(`/api/connector/turnlab`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setTurnlab(fetch)
    } catch (e) {
      notify(e.message)
    }
  }, [request, auth, setTurnlab])

  const [t, setT] = useState()
  useEffect(() => {
    if (!t) {
      getTurnlab()
      getOptions()
      getSources()
      getCounterAgents()
      allClients()
      getWarehouse()
      getWareConnectors()
      getHeadDirections()
      getProbirka()
      setT(1)
    }
    if (error) {
      notify(error.message)
      clearError()
    }
  }, [notify, clearError, setT])

  return (
    <div>
      <div className="row" >
        <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
          <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
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
            defaultValue={new Date(client.born).getFullYear().toString() + '-' + (new Date(client.born).getMonth() < 9 ? "0" + (new Date(client.born).getMonth() + 1).toString() : (new Date(client.born).getMonth() + 1).toString()) + '-' + (new Date(client.born).getDate() < 10 ? "0" + (new Date(client.born).getDate()).toString() : (new Date(client.born).getDate()).toString())}
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

      <div className="text-end">
        {
          advertisement ?
            <button onClick={() => setAdvertisement(false)} className="adver">-</button> : <button onClick={() => setAdvertisement(true)} className="adver">+</button>
        }
      </div>
      <div className={advertisement ? "row m-0 p-1 border rounded" : "d-none"}>
        <Select
          placeholder="Kontragentni tanglang"
          className="m-0 p-0"
          onChange={(event) => changeCounterAgent(event)}
          components={animatedComponents}
          options={counteragents && counteragents}
          escapeClearsValue="true"
        />
        <div className="mt-3 text-center p-0" >
          {
            sources && sources.map((adver, key) => {
              if (adver.name === source) {
                return <button onClick={() => changeSource(adver.name)} className="button-change"> {adver.name} </button>
              } else {
                return <button onClick={() => changeSource(adver.name)} className="button">{adver.name}</button>
              }
            })
          }
          <button onClick={() => { setSource(" ") }} className="button" style={{ backgroundColor: "Red" }}>X</button>
        </div>
      </div>

      <div className="row pt-3">
        <div className="col-12" >
          <p className="m-0 ps-2">Bo'limni tanlang</p>
          <Select
            className=""
            onChange={changeTypeOptions}
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={typeoptions && typeoptions}
          />
          <p className="m-0 ps-2 mt-4">Bo'limni xizmatlarini tanlang</p>
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
                    value={section.subname}
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
        <button disabled={loading} onClick={checkData} className="btn btn-primary profile-button mb-5">
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
                  sections && sections.map((section, key) => {
                    allPrice = allPrice + section.price
                    return (
                      <tr key={key}>
                        <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                        <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                          {section.headsection} {section.name} {section.subname}
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
                <button onClick={createHandler} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
