import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { CheckClentData } from './CheckClentData'
import '../CSS/radio.css'
import { AuthContext } from '../context/AuthContext'
const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

toast.configure()
export const NewOnlineClient = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    let s = []
    const { loading, request, error, clearError } = useHttp()
    const [turns, seTurns] = useState([])
    const [sections, setSections] = useState()
    const notify = (e) => {
        toast.error(e)
    }
    const history = useHistory()

    // Modal oyna funksiyalari
    let allPrice = 0
    const [modal, setModal] = useState(false)

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
            notify(error)
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
            notify(error)
        }
    }, [auth, request, setSources])

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

    const [client, setClient] = useState({
        firstname: '',
        lastname: '',
        fathername: ' ',
        gender: '',
        phone: '998',
        id: 0,
        born: '',
        address: " "
    })

    const changeHandlar = event => {
        setClient({ ...client, [event.target.name]: event.target.value })

    }

    const changeTime = (event) => {
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], bronTime: event.target.value } }))
    }

    const changeDate = (event) => {
        setClient({ ...client, born: new Date(event.target.value) })
    }

    const changeBronDate = (event) => {
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], bronDay: new Date(event.target.value) } }))
        setCounterAgent({ ...counteragent, paymentDay: new Date(event.target.value) })
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
        event.map((section) => {
            i.push(section._id)
            let turn = 0
            turns.map((sec) => {
                if (checkTurn(sec, section.section)) {
                    turn++
                }
            })
            let headname
            let p = false
            headdirections.map(h => {
                if (h._id === section.headsection) {
                    headname = h.name
                    if (h.probirka) {
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
                turn: 0,
                bron: 'online',
                bronDay: new Date(),
                bronTime: " ",
                position: 'kutilmoqda',
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
    }

    const createSections = event => {
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], price: event.target.value } }), () => setSections(Object.values({ ...sections, [key]: { ...sections[key], turn: parseInt(event.target.name) } })))
    }


    const checkData = () => {
        if (CheckClentData(client)) {
            return notify(CheckClentData(client))
        }
        sections && sections.map((section) => {
            if (section.bronTime === " ") {
                return notify("Mijozning bron vaqtini kiriting iltimos!")
            }
        })
        window.scrollTo({ top: 0 })
        setModal(true)
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/clients/reseption/register', 'POST', { ...client }, {
                Authorization: `Bearer ${auth.token}`
            })
            createConnector(data._id)
        } catch (e) { }
    }

    const createConnector = async (client) => {
        try {
            const connector = await request("/api/connector/register", "POST", {
                client,
                source,
                counteragent: counteragent ? counteragent.counteragent : " ",
                type: "online",
                position: " ",
                doctor: " ",
                diagnosis: " ",
                bronDay: new Date(),
                prepaymentCashier: 0,
                accept: false,
                probirka: probirka && probirka
            }, {
                Authorization: `Bearer ${auth.token}`
            })

            createAllSections(client, connector._id)

        } catch (e) {
            notify(e)
        }
    }

    const createAllSections = (id, connector) => {
        sections && sections.map((section) => {
            create(id, section, connector)
        })
        WareUseds(connector)
        counteragent && createPaymentCounteragent(id, connector)
        toast.success("Mijoz ro'yxatga olindi.")
        history.push(`/reseption/onlineclients`)
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

    const [probirka, setProbirka] = useState()

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

    useEffect(() => {
        if (!probirka) {
            getProbirka()
        }
        if (!headdirections) {
            getHeadDirections()
        }
        if (!options) {
            getOptions()
        }
        if (!counteragents) {
            getCounterAgents()
        }
        if (!sources) {
            getSources()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!wareconnectors) {
            getWareConnectors()
        }
    }, [getHeadDirections])


    const checkTurn = (turn, name) => {
        if (
            mongoose.Types.ObjectId(turn._id).getTimestamp().getFullYear() === new Date().getFullYear() &&
            mongoose.Types.ObjectId(turn._id).getTimestamp().getMonth() === new Date().getMonth() &&
            mongoose.Types.ObjectId(turn._id).getTimestamp().getDate() === new Date().getDate() &&
            turn.name === name
        ) return true
        return false
    }


    return (
        <div>
            <div className="row">
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 input_box mb-2" >
                    <input
                        defaultValue={client.lastname}
                        onChange={changeHandlar}
                        name='lastname'
                        type="text"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
                </div>
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={client.firstname}
                        onChange={changeHandlar}
                        name="firstname"
                        type="text"
                        className="form-control inp"
                        placeholder="" />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
                </div>
            </div>
            <div className="row" style={{ padding: "15px 0" }}>
                <div className="col-md-6 input_box mb-2" >
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
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={new Date(client.born).getFullYear().toString() +
                            "-" +
                            (new Date(client.born).getMonth() < 9
                                ? "0" + (new Date(client.born).getMonth() + 1).toString()
                                : (new Date(client.born).getMonth() + 1).toString()) +
                            "-" +
                            (new Date(client.born).getDate() < 10
                                ? "0" + new Date(client.born).getDate().toString()
                                : new Date(client.born).getDate().toString())}
                        onChange={changeDate}
                        type="date"
                        name='born'
                        className="form-control inp"
                        placeholder=""
                        style={{ color: "#999" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan kuni</label>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6" >
                    <div className="form-group">
                        <div className="btn-group" >
                            <div className="wrapp">
                                <input
                                    className="input"
                                    id="erkak"
                                    onChange={changeHandlar}
                                    name="gender"
                                    type="radio"
                                    defaultValue="man"
                                    check={client.gender === "man" ? true : false}
                                />
                                <label
                                    className={client.gender === "man" ? "label clabel" : "label"}
                                    for="erkak"
                                >
                                    Erkak
                                </label>
                                <input
                                    check={client.gender === "woman" ? true : false}
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
                                    for="ayol"
                                >
                                    Ayol
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={client.phone}
                        onChange={changeHandlar}
                        type="number"
                        name='phone'
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
                        <button onClick={() => setAdvertisement(false)} className="adver">-</button>
                        :
                        <button onClick={() => setAdvertisement(true)} className="adver">+</button>
                }
            </div>
            <div className={advertisement ? "row m-0 p-1 border rounded" : "d-none"}>
                <Select
                    placeholder="Kontragentni tanglang"
                    className="m-0 p-0"
                    onChange={(event) => changeCounterAgent(event)}
                    components={animatedComponents}
                    options={counteragents && counteragents}
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

            <div className="row" >
                <div className="col-md-12"  >
                    <p className="m-0 ps-2 mt-3">Bo'limni tanlang</p>
                    <Select
                        className=""
                        onChange={(event) => changeSections(event)}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options && options}
                    />
                </div>
            </div>
            <div className="row">
                {
                    sections && sections.map((section, key) => {
                        return (
                            <>
                                <div className="col-4" >
                                    <label className=""></label>
                                    <input
                                        disabled
                                        defaultValue={section.price}
                                        onChange={createSections}
                                        id={key}
                                        type="number"
                                        name={section.name}
                                        className="form-control mt-2"
                                        placeholder={section.name + " summasi"}
                                    />
                                </div>
                                <div className="col-4">
                                    <label style={{ fontWeight: "100" }}> Kuni</label>
                                    <input
                                        id={key}
                                        onChange={changeBronDate}
                                        type="date"
                                        name='bronDay'
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-4">
                                    <label style={{ fontWeight: "100" }}>Vaqti</label>
                                    <input
                                        id={key}
                                        value={section.bronTime}
                                        onChange={changeTime}
                                        type="time"
                                        name='bronTime'
                                        className="form-control"
                                        placeholder="Vaqtni kiriting"
                                    />
                                </div>

                            </>
                        )
                    })
                }

            </div>
            <div className="mt-5 text-center">
                <button
                    onClick={checkData}
                    className="btn btn-primary profile-button"
                >
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
                        <table className="w-100 mt-3">
                            <thead>
                                <tr style={{ borderBottom: "1px solid #999" }} >
                                    <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                                    <th style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Kuni</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Soati</th>
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
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{new Date(section.bronDay).toLocaleDateString()}</td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.bronTime}</td>
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
                            `            <div className="col-12 text-center">
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
