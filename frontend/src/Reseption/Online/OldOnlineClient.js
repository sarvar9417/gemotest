import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { AuthContext } from '../context/AuthContext'
import { CheckClentData } from './CheckClentData'
const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

toast.configure()
export const OldOnlineClient = () => {
    const auth = useContext(AuthContext)
    let s = []
    const { loading, request, error, clearError } = useHttp()
    const [turns, seTurns] = useState([])
    const [sections, setSections] = useState()

    const [clients, setClients] = useState()
    const notify = (e) => {
        toast.error(e)
    }

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

    // Modal oyna funksiyalari
    let allPrice = 0
    const [modal, setModal] = useState(false)

    // Bo'limlar
    const [options, setOptions] = useState()
    const [alloptions, setAllOptions] = useState()
    const [typeoptions, setTypeOptions] = useState()
    const getOptions = useCallback(async () => {
        try {
            const data = await request("/api/direction/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = []
            data.map((d) => {
                s.push({
                    label: d.section,
                    value: d.section,
                })
            })
            const ids = s.map(o => o.label)
            const filtered = s.filter(({ label }, index) => !ids.includes(label, index + 1))
            setTypeOptions(filtered)
            setAllOptions(data)
            setOptions(data)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setAllOptions, setTypeOptions])

    const changeTypeOptions = (event) => {
        let s = []
        alloptions &&  alloptions.map(op => {
            if (op.section === event.value) {
                s.push(op)
            }
        })
        setOptions(s)
    }


    const history = useHistory()
    const [client, setClient] = useState({
        _id: '',
        firstname: '',
        lastname: '',
        fathername: '',
        gender: '',
        phone: '',
        id: "",
        born: '',
        address: ""
    })

    const changeHandlar = event => {
        setClient({ ...client, [event.target.name]: event.target.value })

    }

    const changeTime = (event) => {
        console.log(event.target.value);
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], bronTime: event.target.value } }))
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
                client: client._id,
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

    const createSections = event => {
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], price: event.target.value } }), () => setSections(Object.values({ ...sections, [key]: { ...sections[key], turn: parseInt(event.target.name) } })))
    }

    const getClient = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/clients/reseption/id/${id}`, "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const searchClient = (id) => {
        if (id > 1000000) {
            getClient(id)
        }
    }

    const createConnector = async () => {
        try {
            const connector = await request("/api/connector/register", "POST", {
                client: client._id,
                source,
                counteragent: counteragent ? counteragent.counteragent : " ",
                type: "online",
                position: " ",
                doctor: " ",
                diagnosis: " ",
                bronDay: sections ? sections[0].bronDay : new Date(),
                prepaymentCashier: 0,
                accept: false,
                probirka: probirka && probirka
            }, {
                Authorization: `Bearer ${auth.token}`
            })
            createAllSections(connector._id)
        } catch (e) {
            notify(e)
        }
    }

    const createAllSections = (connector) => {
        sections && sections.map((section) => {
            create(section, connector)
        })
        WareUseds(connector)
        counteragent && createPaymentCounteragent(client && client._id, connector)
        history.push(`/reseption/onlineclients`)
    }

    const create = async (section, connector) => {
        try {
            const data = await request(`/api/section/reseption/register/${client._id}`, "POST", { ...section, connector }, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(data)
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
        getClient()
        if (error) {
            notify(error)
            clearError()
        }
        if (!sources) {
            getSources()
        }
        if (!wareconnectors) {
            getWareConnectors()
        }
    }, [getClient])


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
        <>
            <div className="row">
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 input_box mb-2">
                    <input
                        defaultValue={client.id}
                        onChange={(event) => searchClient(parseInt(event.target.value))}
                        name='ID'
                        type="number"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels" >Mijoznig ID raqami</label>
                </div>
                <div className="col-md-6 input_box ">
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
            </div>
            <div className="row" style={{ padding: "15px 0" }}>
                <div className="col-md-6 input_box mb-2">
                    <input
                        value={client.lastname}
                        disabled
                        name='lastname'
                        type="text"
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
                </div>
                <div className="col-md-6 input_box">
                    <input
                        disabled
                        value={client.firstname}
                        name="firstname"
                        type="text"
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 input_box mb-2">
                    <input
                        disabled
                        value={client.fathername}
                        name="fathername"
                        type="text"
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Otasining ismi</label>
                </div>
                <div className="col-md-6 input_box">
                    <input
                        disabled
                        value={new Date(client.born).getFullYear().toString() + '-' + (new Date(client.born).getMonth() < 9 ? "0" + (new Date(client.born).getMonth() + 1).toString() : (new Date(client.born).getMonth() + 1).toString()) + '-' + (new Date(client.born).getDate() < 10 ? "0" + (new Date(client.born).getDate()).toString() : (new Date(client.born).getDate()).toString())}
                        type="date"
                        name='born'
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff", color: "#999" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan sanasi</label>
                </div>
                <div className="col-12 mt-3">
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
            <div className="row">
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

            <div className="row mt-3" >
                <div className="col-md-12" >
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
                        onChange={(event) => changeSections(event)}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                    />
                </div>
            </div>
            <div className="row">
                {
                    sections && sections.map((section, key) => {
                        return (
                            <>
                                <div className="col-md-4 col-sm-6 mt-2" >
                                    <label className=""></label>
                                    <input
                                        disabled
                                        value={section.price}
                                        onChange={createSections}
                                        id={key}
                                        type="number"
                                        name={section.name}
                                        className="form-control"
                                        placeholder={section.name + " summasi"}
                                    />
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <label style={{ fontWeight: "100" }} > Kuni
                                    </label>
                                    <input
                                        id={key}
                                        onChange={changeBronDate}
                                        type="date"
                                        name='bronDay'
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4 col-sm-6">
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
                            <div className="col-12 text-center">
                                <button onClick={createConnector} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
