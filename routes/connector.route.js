const { Router } = require('express')
const router = Router()
const { Connector, validateConnector } = require('../models/Connector')
const { Clients } = require('../models/Clients')
const { Section } = require('../models/Section')
const { Service } = require('../models/Service')
const { Source } = require('../models/Source')
const { Doctor } = require('../models/Doctor')
const { Direction } = require('../models/Direction')
const { UsedRoom } = require('../models/UsedRoom')
const { Room } = require('../models/Rooms')
const { TableSection } = require('../models/TableSection')
const { HeadSection } = require('../models/HeadSection')
const { TableColumn } = require('../models/Tablecolumn')
const { FileSave } = require('../models/FileSave')

const { Payment } = require('../models/Payment')
const { Sale } = require('../models/Sale')
const {map, filter} = require('lodash')

// /api/auth/connector/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateConnector(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        let {
            client,
            source,
            counteragent,
            type,
            position,
            doctor,
            prepaymentCashier,
            diagnosis,
            bronDay,
            probirka,
            accept
        } = req.body

        if (probirka) {
            const connectors = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lt: new Date(new Date().getFullYear(),
                        new Date().getMonth(), new Date().getDate() + 1)
                },
                probirka: { $gt: 0 }
            })
            probirka = connectors.length + 1
        }
        const connector = new Connector({
            client,
            source,
            counteragent,
            type,
            position,
            doctor,
            prepaymentCashier,
            diagnosis,
            bronDay,
            probirka,
            accept
        })
        await connector.save()
        res.status(201).send(connector)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/doctorid/:start/:end/:section/:id', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const id = req.params.id
        const client = await Clients.findOne({
            id: id
        })
        if (client.length === 0) {
            res.status(500).json({ message: "Bunday ID raqamli mijoz tizimda ro'yxatga olinmagan!" })
        }
        const connectors = await Connector.find({
            client: client._id,
            bronDay: {
                $gte:
                    new Date(start),
                $lt: new Date(end)
            },
        })
            .populate('client', 'born firstname lastname id')
            .sort({ _id: -1 })
            .select('bronDay client probirka')

        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                headsectionid: headsection._id,
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })

            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/doctor/:start/:end/:section/:probirka', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            probirka: req.params.probirka,
            bronDay: {
                $gte:
                    new Date(start),
                $lt: new Date(end)
            },
        })
            .populate('client', 'born firstname lastname id')
            .sort({ _id: -1 })
            .select('bronDay client probirka')

        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                headsectionid: headsection._id,
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })

            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/doctorfish/:start/:end/:section/:fish', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")

        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []

        for (const client of clientss) {
            const connector = await Connector.findOne({
                client: client._id,
                bronDay: {
                    $gte:
                        new Date(req.params.start),
                    $lt: new Date(req.params.end)
                },
            })
                .or([{ probirka: { $eq: 0 } }, { accept: true }])
                .populate('client', 'born firstname lastname id')
                .sort({ _id: -1 })
                .select('bronDay client probirka diagnosis')
            if (connector) {
                connectors.push(connector)
            }
        }

        let countsection = []

        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                headsectionid: headsection._id,
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/directorprobirka/:start/:end/:probirka', async (req, res) => {
    try {
        const connectors = await Connector.find({
            probirka: req.params.probirka,
            bronDay: {
                $gte:
                    new Date(req.params.start),
                $lt: new Date(req.params.end)
            },
        })
            .or([{ accept: true }])
            .populate('client', 'born firstname lastname id')
            .sort({ _id: -1 })
            .select('bronDay client probirka diagnosis')

        let countsection = []

        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/directorid/:start/:end/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.findOne({
            id: id
        })
        if (client.length === 0) {
            res.status(500).json({ message: "Bunday ID raqamli mijoz tizimda ro'yxatga olinmagan!" })
        }
        const connectors = await Connector.find({
            client: client._id,
            bronDay: {
                $gte:
                    new Date(req.params.start),
                $lt: new Date(req.params.end)
            },
        })
            .or([{ probirka: { $eq: 0 } }, { accept: true }])
            .populate('client', 'born firstname lastname id')
            .sort({ _id: -1 })
            .select('bronDay client probirka diagnosis')

        let countsection = []

        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/doctor/:start/:end/:section', async (req, res) => {
    try {
        const start = new Date(new Date(req.params.start).setHours(0, 0, 0, 0)).toISOString()
        const end = new Date(new Date(req.params.end).setHours(23, 59, 59, 999)).toISOString()
        const sections = await Section.find({
            bronDay: {
                $gte: start,
                $lt: end
            },
            headsectionid: req.params.section,
            priceCashier: { $gt: 0 }
        }).sort({connector: -1})
            .populate('client', 'born firstname lastname id')
            .populate('connector', 'probirka bronDay')
            .then(sections => {
                let connectors = []
                let countsection = []
                let i = -1
                map(sections, (section, index) => {
                    if(index === 0 || section.connector._id.toString() !== sections[index - 1].connector._id.toString()) {
                        connectors.push({
                            client: section.client,
                            bronDay: section.connector.bronDay,
                            probirka: section.connector.probirka,
                            _id: section.connector._id,
                        })
                        countsection.push({
                            accept: section.accept ? 1 : 0,
                            all: 1
                        })
                        i++
                    } else {
                        countsection[i].all++
                        if(section.accept) {
                            countsection[i].accept++
                        }
                    }
                })
                return {connectors, countsection}
            })

        // const connectors = await Connector.find({
        //     bronDay: {
        //         $gte:
        //             new Date(start),
        //         $lt: new Date(end)
        //     },
        // })
        //     .populate('client', 'born firstname lastname id')
        //     .sort({ _id: -1 })
        //     .select('bronDay client probirka')
        //     .then(async (connectors) =>
        //         await map(connectors, async (connector) => {
        //              const sections =  await Section.find({
        //                  connector: connector._id,
        //                  headsectionid: headsection._id
        //              }).count()
        //              const accept = await Section.find({
        //                  connector: connector._id,
        //                  headsectionid: headsection._id,
        //                  accept: true
        //              }).count()
        //              const data = {
        //                  client: connector?.client,
        //                  bronDay: connector?.bronDay,
        //                  probirka: connector?.probirka,
        //                  sections ,
        //                  accept
        //              }
        //             return data
        //         })
        //        )
        // let countsection = []
        //
        // for (let i = 0; i < connectors.length; i++) {
        //     const sections = await Section.find({
        //         headsectionid: headsection._id,
        //         connector: connectors[i]._id,
        //         priceCashier: { $gt: 0 }
        //     })
        //
        //     let c = {
        //         accept: 0,
        //         all: 0
        //     }
        //     sections.map(section => {
        //         c.all = c.all + 1
        //         if (section.accept) {
        //             c.accept = c.accept + 1
        //         }
        //     })
        //     countsection.push(c)
        // }
        res.json(sections)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/directordoctor/:start/:end/:section', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.section)
        const headsection = await HeadSection.findById(doctor.section)
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const sections = await Section.find({
            headsectionid: headsection._id,
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
        let connectors = []
        let directions = []
        let clients = []
        for (let i = 0; i < sections.length; i++) {
            const connector = await Connector.findById(sections[i].connector)
            let k = true
            if (headsection.probirka && !connector.accept) {
                k = false
            }
            connectors.map((c) => {
                if ((connector._id).toString() === (c._id).toString()) {
                    k = false
                }
            })
            if (k) {
                connectors.push(connector)
            }
            const direction = await Direction.findOne({ subsection: sections[i].subname })
            directions.push(direction)
            const client = await Clients.findById(sections[i].client)
            clients.push(client)
        }
        let countsection = []

        for (let i = 0; i < connectors.length; i++) {

            const sections = await Section.find({
                connector: connectors[i]._id,
                headsectionid: req.params.section,
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ clients, connectors, countsection, sections, directions })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/director/:start/:end/:section', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const section = req.params.section
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })

        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id,
                name: section,
                priceCashier: { $gt: 0 }
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id,
                name: section
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseption/:start/:end/:section', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const section = req.params.section
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id,
                name: section,
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
                .sort({ _id: 1 })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            let c = {
                accept: 0,
                all: 0
            }
            sec.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/directorfish/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")

        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []

        for (const client of clientss) {
            const connector = await Connector.findOne({
                client: client._id,
                bronDay: {
                    $gte:
                        new Date(req.params.start),
                    $lt: new Date(req.params.end)
                },
            })
                .or([{ probirka: { $eq: 0 } }, { accept: true }])
                .populate('client', 'born firstname lastname id')
                .sort({ _id: -1 })
                .select('bronDay client probirka diagnosis')
            if (connector) {
                connectors.push(connector)
            }
        }

        let countsection = []

        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptionoffline/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                client: clientss[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        let sections = []
        let services = []
        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
                .sort({ _id: 1 })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            let c = {
                accept: 0,
                all: 0
            }
            sec.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/debtorname/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
            .sort({ _id: -1 })
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                client: clientss[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            let client = {
                client: "",
                id: "",
                born: "",
                phone: "",
                connector: '',
                firstname: "",
                lastname: "",
                bronDay: connectors[i].bronDay,
                sectionscount: 0,
                sectionssumma: 0,
                sale: 0,
                payment: 0,
                debt: 0
            }
            const client1 = await Clients.findById(connectors[i].client)
            const sections = await Section.find({
                connector: connectors[i]._id
            })
                .sort({ _id: 1 })
            const summsections = sections.reduce((sum, section) => {
                return sum + section.priceCashier
            }, 0)

            const services = await Service.find({
                connector: connectors[i]._id
            })
            const summservices = services.reduce((sum, service) => {
                return sum + service.priceCashier
            }, 0)

            const payments = await Payment.find({
                connector: connectors[i]._id
            })
            const summpayments = payments.reduce((sum, payment) => {
                return sum + payment.card + payment.cash + payment.transfer
            }, 0)

            const sale = await Sale.findOne({
                connector: connectors[i]._id
            })

            if (sale && summsections + summservices !== summpayments + sale.summa) {
                client.client = client1._id
                client.id = client1.id
                client.born = client1.born
                client.phone = client1.phone
                client.connector = connectors[i]._id
                client.firstname = client1.firstname
                client.lastname = client1.lastname
                client.bronDay = connectors[i].bronDay
                client.sectionscount = sections.length + services.length
                client.sectionssumma = summsections + summservices
                client.sale = sale && sale.summa
                client.payment = summpayments
                client.debt = sale && summsections + summservices - summpayments - sale.summa
                clients.push(client)
            }

        }
        res.json(clients)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/salename/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
            .sort({ _id: -1 })
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                client: clientss[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            let client = {
                client: "",
                id: "",
                born: "",
                phone: "",
                connector: '',
                firstname: "",
                lastname: "",
                bronDay: connectors[i].bronDay,
                comment: "",
                sectionssumma: 0,
                sale: 0,
                payment: 0,
                procient: 0
            }
            const client1 = await Clients.findById(connectors[i].client)
            const sections = await Section.find({
                connector: connectors[i]._id
            })
                .sort({ _id: 1 })
            const summsections = sections.reduce((sum, section) => {
                return sum + section.priceCashier
            }, 0)

            const services = await Service.find({
                connector: connectors[i]._id
            })
            const summservices = services.reduce((sum, service) => {
                return sum + service.priceCashier
            }, 0)

            const payments = await Payment.find({
                connector: connectors[i]._id
            })
            const summpayments = payments.reduce((sum, payment) => {
                return sum + payment.card + payment.cash + payment.transfer
            }, 0)

            const sale = await Sale.findOne({
                connector: connectors[i]._id
            })

            if (sale && sale.summa > 0) {
                client.client = client1._id
                client.id = client1.id
                client.born = client1.born
                client.phone = client1.phone
                client.connector = connectors[i]._id
                client.firstname = client1.firstname
                client.lastname = client1.lastname
                client.bronDay = connectors[i].bronDay
                client.comment = sale.comment
                client.sectionssumma = summsections + summservices
                client.sale = sale && sale.summa
                client.payment = summpayments
                client.procient = sale.procient
                clients.push(client)
            }

        }
        res.json(clients)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/labaratoriya/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                probirka: { $gt: 0 },
                client: clientss[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/labaratoriyatype/:start/:end/:type', async (req, res) => {
    try {
        const type = req.params.type
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            probirka: { $gt: 0 },
            accept: type
        }).sort({ _id: -1 })
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/labaratoriyaprobirka/:start/:end/:probirka', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            probirka: req.params.probirka
        }).sort({ _id: -1 })
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptiononline/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                client: clientss[i]._id
            })
                .or([{ type: "online" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        let sections = []
        let services = []
        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            let c = {
                accept: 0,
                all: 0
            }
            sec.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/director/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const sections = await Section.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            priceCashier: { $gt: 0 }
        })
            .sort({ _id: -1 })
        let connectors = []
        for (let i = 0; i < sections.length; i++) {
            const connector = await Connector.findById(sections[i].connector)
            let k = true
            connectors.map((c) => {
                if ((connector._id).toString() === (c._id).toString()) {
                    k = false
                }
            })
            if (k) {
                if (!connector.probirka) {
                    connectors.push(connector)
                } else {
                    if (connector.accept) {
                        connectors.push(connector)
                    }
                }
            }
        }
        let countsection = []
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ clients, connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/reseption/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
                .sort({ _id: 1 })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            let c = {
                accept: 0,
                all: 0
            }
            sec.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/debtors/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .sort({ _id: -1 })
        let clients = []

        for (let i = 0; i < connectors.length; i++) {
            let client = {
                client: "",
                id: "",
                born: "",
                phone: "",
                connector: '',
                firstname: "",
                lastname: "",
                bronDay: connectors[i].bronDay,
                sectionscount: 0,
                sectionssumma: 0,
                sale: 0,
                payment: 0,
                debt: 0
            }
            const client1 = await Clients.findById(connectors[i].client)
            const sections = await Section.find({
                connector: connectors[i]._id
            })
                .sort({ _id: 1 })
            const summsections = sections.reduce((sum, section) => {
                return sum + section.priceCashier
            }, 0)

            const services = await Service.find({
                connector: connectors[i]._id
            })
            const summservices = services.reduce((sum, service) => {
                return sum + service.priceCashier
            }, 0)

            const payments = await Payment.find({
                connector: connectors[i]._id
            })
            const summpayments = payments.reduce((sum, payment) => {
                return sum + payment.card + payment.cash + payment.transfer
            }, 0)

            const sale = await Sale.findOne({
                connector: connectors[i]._id
            })

            if (sale && summsections + summservices !== summpayments + sale.summa) {
                client.client = client1._id
                client.id = client1.id
                client.born = client1.born
                client.phone = client1.phone
                client.connector = connectors[i]._id
                client.firstname = client1.firstname
                client.lastname = client1.lastname
                client.bronDay = connectors[i].bronDay
                client.sectionscount = sections.length + services.length
                client.sectionssumma = summsections + summservices
                client.sale = sale && sale.summa
                client.payment = summpayments
                client.debt = sale && summsections + summservices - summpayments - sale.summa
                clients.push(client)
            }

        }
        res.json(clients)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/sales/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .sort({ _id: -1 })
        let clients = []

        for (let i = 0; i < connectors.length; i++) {
            let client = {
                client: "",
                id: "",
                born: "",
                phone: "",
                connector: '',
                firstname: "",
                lastname: "",
                bronDay: connectors[i].bronDay,
                comment: "",
                sectionssumma: 0,
                sale: 0,
                procient: 0,
                payment: 0,
            }
            const client1 = await Clients.findById(connectors[i].client)
            const sections = await Section.find({
                connector: connectors[i]._id
            })
                .sort({ _id: 1 })
            const summsections = sections.reduce((sum, section) => {
                return sum + section.priceCashier
            }, 0)

            const services = await Service.find({
                connector: connectors[i]._id
            })
            const summservices = services.reduce((sum, service) => {
                return sum + service.priceCashier
            }, 0)

            const payments = await Payment.find({
                connector: connectors[i]._id
            })
            const summpayments = payments.reduce((sum, payment) => {
                return sum + payment.card + payment.cash + payment.transfer
            }, 0)

            const sale = await Sale.findOne({
                connector: connectors[i]._id
            })

            if (sale && sale.summa > 0) {
                client.client = client1._id
                client.id = client1.id
                client.born = client1.born
                client.phone = client1.phone
                client.connector = connectors[i]._id
                client.firstname = client1.firstname
                client.lastname = client1.lastname
                client.bronDay = connectors[i].bronDay
                client.comment = sale.comment
                client.sectionssumma = summsections + summservices
                client.sale = sale && sale.summa
                client.payment = summpayments
                client.procient = sale.procient
                clients.push(client)
            }

        }
        res.json(clients)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/directorclients/:startDate/:endDate', async (req, res) => {
    try {
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(req.params.startDate),
                $lt: new Date(req.params.endDate)
            },
        })
            .or([{ probirka: { $eq: 0 } }, { accept: true }])
            .populate('client', 'born firstname lastname id')
            .sort({ _id: -1 })
            .select('bronDay client probirka diagnosis')

        let countsection = []

        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/labaratoriya
router.get('/labaratoriya/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            probirka: { $gt: 0 }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptiononline/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            type: "online"
        })
            .sort({ _id: -1 })

        let clients = []
        let sections = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/connector
router.get('/allresults/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .sort({ _id: -1 })
        let all = []
        let t = 0
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 },
                // accept: true
            })
                .sort({ _id: 1 })
            let tablesections = []
            let tablecolumns = []
            let sectionFiles = []
            for (let j = 0; j < sections.length; j++) {
                const t = await TableSection.find({
                    sectionid: sections[j]._id
                })
                tablesections.push(t)
                const tablecolumn = await TableColumn.findOne({
                    direction: sections[j].nameid
                })
                const f = await FileSave.find({
                    section: sections[j]._id
                })
                sectionFiles.push(f)
                tablecolumns.push(tablecolumn)
            }
            all.push({
                client,
                connector: connectors[i],
                sections,
                tablesections,
                tablecolumns,
                sectionFiles
            })
        }

        res.send(all)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/statsionar/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            type: "statsionar"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/cashierstatsionar/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            type: "statsionar",

        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/marketing/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            source: { $ne: " " },

        })
            .sort({ _id: -1 })
        const sources = await Source.find()
        res.json({ connectors, sources })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/doctorborn/:section/:born', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const born = new Date(req.params.born)
        const clientss = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })

        let connectors = []
        for (const client of clientss) {
            const connector = await Connector.findOne({ client: client._id }).populate('client', 'born firstname lastname id')
                .sort({ _id: -1 })
                .select('bronDay client probirka')
            if (connector) {
                connectors.push(connector)
            }
        }

        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                headsectionid: headsection._id,
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })

            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



// /api/auth/connector/
router.get('/doctorconnector/:section/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connector = await Connector.findById(id)
        const sections = await Section.find({
            headsectionid: req.params.section,
            connector: connector._id,
            priceCashier: { $gt: 0 }
        })
            .sort({
                _id: 1
            })
        let tablesections = []
        let tablecolumns = []
        let sectionFiles = []
        for (let i = 0; i < sections.length; i++) {
            const tablesection = await TableSection.find({
                sectionid: sections[i]._id
            })
            tablesections.push(tablesection)
            const tablecolumn = await TableColumn.findOne({
                direction: sections[i].nameid
            })
            tablecolumns.push(tablecolumn)
            const f = await FileSave.find({
                section: sections[i]._id
            })
            sectionFiles.push(f)
        }
        res.json({ connector, sections, tablesections, tablecolumns, sectionFiles })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/client/:id/:born', async (req, res) => {
    try {
        const id = req.params.id
        const born = new Date(req.params.born)
        const client = await Clients.findOne({
            id: id,
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })

        if (!client) {
            return res.status(400).json({ message: "Ushbu kiritilgan ma'lumotlarga ega mijoz topilmadi. Iltimos ma'lumotlaringiz to'g'ri kiritilganligiga ishonch hosil qiling." })
        }
        res.send(client)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/directorconnector/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connector = await Connector.findById(id)
        const sections = await Section.find({
            connector: connector._id,
            priceCashier: { $gt: 0 }
        })
            .sort({ _id: 1 })

        let tablesections = []
        let tablecolumns = []
        for (let i = 0; i < sections.length; i++) {
            const tablesection = await TableSection.find({
                sectionid: sections[i]._id
            })
            tablesections.push(tablesection)
            const tablecolumn = await TableColumn.findOne({
                direction: sections[i].nameid
            })
            tablecolumns.push(tablecolumn)
        }
        res.json({ connector, sections, tablesections, tablecolumns })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/reseption/:id', async (req, res) => {
    try {
        const id = req.params.id
        let client
        let connectors
        if (id.length > 6) {
            client = await Clients.find({
                id: id
            })
        }
        if (client) {
            connectors = await Connector.find({
                client: client[0]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
        } else {
            connectors = await Connector.find({
                probirka: id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
        }

        let clients = []
        let sections = []
        let services = []
        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
                .sort({ _id: 1 })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            let c = {
                accept: 0,
                all: 0
            }
            sec.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/debtorid/:id', async (req, res) => {
    try {

        const id = req.params.id
        const client1 = await Clients.findOne({
            id: id
        })

        if (!client1) {
            return res.status(500).json({ message: 'Bunday ID li foydalanuvchi topilmadi' })
        }
        const connector = await Connector.findOne({
            client: client1._id
        })
        let client = {
            client: "",
            id: "",
            born: "",
            phone: "",
            connector: '',
            firstname: "",
            lastname: "",
            bronDay: connector.bronDay,
            sectionscount: 0,
            sectionssumma: 0,
            sale: 0,
            payment: 0,
            debt: 0
        }
        const sections = await Section.find({
            client: client1._id
        })
            .sort({ _id: 1 })

        const summsections = sections.reduce((sum, section) => {
            return sum + section.priceCashier
        }, 0)

        const services = await Service.find({
            client: client1._id
        })
        const summservices = services.reduce((sum, service) => {
            return sum + service.priceCashier
        }, 0)

        const payments = await Payment.find({
            client: client1._id
        })
        const summpayments = payments.reduce((sum, payment) => {
            return sum + payment.card + payment.cash + payment.transfer
        }, 0)

        const sale = await Sale.findOne({
            client: client1._id
        })

        if (!sale) {
            return res.status(500).json({ message: 'Bunday ID li foydalanuvchi ma\'lumotlari topilmadi' })
        }


        if (sale && summsections + summservices !== summpayments + sale.summa) {
            client.client = client1._id
            client.id = client1.id
            client.born = client1.born
            client.phone = client1.phone
            client.connector = connector._id
            client.firstname = client1.firstname
            client.lastname = client1.lastname
            client.bronDay = connector.bronDay
            client.sectionscount = sections.length + services.length
            client.sectionssumma = summsections + summservices
            client.sale = sale && sale.summa
            client.payment = summpayments
            client.debt = sale && summsections + summservices - summpayments - sale.summa
        }

        res.json([client])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/debtorprobirka/:probirka', async (req, res) => {
    try {

        const probirka = req.params.probirka
        const connector = await Connector.findOne({
            probirka: probirka
        })

        if (!connector) {
            return res.status(500).json({ message: 'Bunday PROBIRKAli foydalanuvchi topilmadi' })
        }

        const client1 = await Clients.findById(connector.client)

        let client = {
            client: "",
            id: "",
            born: "",
            phone: "",
            connector: '',
            firstname: "",
            lastname: "",
            bronDay: connector.bronDay,
            sectionscount: 0,
            sectionssumma: 0,
            sale: 0,
            payment: 0,
            debt: 0
        }
        const sections = await Section.find({
            client: client1._id
        })
            .sort({ _id: 1 })

        const summsections = sections.reduce((sum, section) => {
            return sum + section.priceCashier
        }, 0)

        const services = await Service.find({
            client: client1._id
        })
        const summservices = services.reduce((sum, service) => {
            return sum + service.priceCashier
        }, 0)

        const payments = await Payment.find({
            client: client1._id
        })

        const summpayments = payments.reduce((sum, payment) => {
            return sum + payment.card + payment.cash + payment.transfer
        }, 0)


        const sale = await Sale.findOne({
            client: client1._id
        })

        if (!sale) {
            return res.status(500).json({ message: 'Bunday PROBIRKAli foydalanuvchi ma\'lumotlari topilmadi' })
        }


        if (sale && summsections + summservices !== summpayments + sale.summa) {
            client.client = client1._id
            client.id = client1.id
            client.born = client1.born
            client.phone = client1.phone
            client.connector = connector._id
            client.firstname = client1.firstname
            client.lastname = client1.lastname
            client.bronDay = connector.bronDay
            client.sectionscount = sections.length + services.length
            client.sectionssumma = summsections + summservices
            client.sale = sale && sale.summa
            client.payment = summpayments
            client.debt = sale && summsections + summservices - summpayments - sale.summa
        }

        res.json([client])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/saleid/:id', async (req, res) => {
    try {

        const id = req.params.id
        const client1 = await Clients.findOne({
            id: id
        })

        if (!client1) {
            return res.status(500).json({ message: 'Bunday ID li foydalanuvchi topilmadi' })
        }
        const connector = await Connector.findOne({
            client: client1._id
        })
        let client = {
            client: "",
            id: "",
            born: "",
            phone: "",
            connector: '',
            firstname: "",
            lastname: "",
            bronDay: connector.bronDay,
            comment: "",
            sectionssumma: 0,
            sale: 0,
            payment: 0,
            procient: 0
        }
        const sections = await Section.find({
            client: client1._id
        })
            .sort({ _id: 1 })

        const summsections = sections.reduce((sum, section) => {
            return sum + section.priceCashier
        }, 0)

        const services = await Service.find({
            client: client1._id
        })
        const summservices = services.reduce((sum, service) => {
            return sum + service.priceCashier
        }, 0)

        const payments = await Payment.find({
            client: client1._id
        })
        const summpayments = payments.reduce((sum, payment) => {
            return sum + payment.card + payment.cash + payment.transfer
        }, 0)

        const sale = await Sale.findOne({
            client: client1._id
        })

        if (!sale) {
            return res.status(500).json({ message: 'Bunday ID li foydalanuvchi ma\'lumotlari topilmadi' })
        }


        if (sale && sale.summa > 0) {
            client.client = client1._id
            client.id = client1.id
            client.born = client1.born
            client.phone = client1.phone
            client.connector = connector._id
            client.firstname = client1.firstname
            client.lastname = client1.lastname
            client.bronDay = connector.bronDay
            client.comment = sale.comment
            client.sectionssumma = summsections + summservices
            client.sale = sale && sale.summa
            client.payment = summpayments
            client.procient = sale.summa.procient
        }

        res.json([client])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/debtorborn/:born', async (req, res) => {
    try {

        const born = req.params.born
        const clients = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })

        if (!clients) {
            return res.status(500).json({ message: 'Bunday ID li foydalanuvchi topilmadi' })
        }

        let allclients = []
        for (let i = 0; i < clients.length; i++) {
            const connector = await Connector.findOne({
                client: clients[i]._id
            })

            let client = {
                client: "",
                id: "",
                born: "",
                phone: "",
                connector: '',
                firstname: "",
                lastname: "",
                bronDay: connector && connector.bronDay,
                sectionscount: 0,
                sectionssumma: 0,
                sale: 0,
                payment: 0,
                debt: 0
            }
            const sections = await Section.find({
                client: clients[i]._id
            })
                .sort({ _id: 1 })

            const summsections = sections.reduce((sum, section) => {
                return sum + section.priceCashier
            }, 0)

            const services = await Service.find({
                client: clients[i]._id
            })
            const summservices = services.reduce((sum, service) => {
                return sum + service.priceCashier
            }, 0)

            const payments = await Payment.find({
                client: clients[i]._id
            })
            const summpayments = payments.reduce((sum, payment) => {
                return sum + payment.card + payment.cash + payment.transfer
            }, 0)

            const sale = await Sale.findOne({
                client: clients[i]._id
            })

            if (sale && summsections + summservices !== summpayments + sale.summa) {
                client.client = clients[i]._id
                client.id = clients[i].id
                client.born = clients[i].born
                client.phone = clients[i].phone
                client.connector = connector && connector._id
                client.firstname = clients[i].firstname
                client.lastname = clients[i].lastname
                client.bronDay = connector && connector.bronDay
                client.sectionscount = sections.length + services.length
                client.sectionssumma = summsections + summservices
                client.sale = sale && sale.summa
                client.payment = summpayments
                client.debt = sale && summsections + summservices - summpayments - sale.summa
                allclients.push(client)
            }
        }


        // console.log(clients);
        res.json(allclients)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/saleborn/:born', async (req, res) => {
    try {

        const born = req.params.born
        const clients = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })

        if (!clients) {
            return res.status(500).json({ message: 'Bunday ID li foydalanuvchi topilmadi' })
        }

        let allclients = []
        for (let i = 0; i < clients.length; i++) {
            const connector = await Connector.findOne({
                client: clients[i]._id
            })

            let client = {
                client: "",
                id: "",
                born: "",
                phone: "",
                connector: '',
                firstname: "",
                lastname: "",
                bronDay: connector && connector.bronDay,
                comment: "",
                sectionssumma: 0,
                sale: 0,
                payment: 0,
                procient: 0
            }
            const sections = await Section.find({
                client: clients[i]._id
            })
                .sort({ _id: 1 })

            const summsections = sections.reduce((sum, section) => {
                return sum + section.priceCashier
            }, 0)

            const services = await Service.find({
                client: clients[i]._id
            })
            const summservices = services.reduce((sum, service) => {
                return sum + service.priceCashier
            }, 0)

            const payments = await Payment.find({
                client: clients[i]._id
            })
            const summpayments = payments.reduce((sum, payment) => {
                return sum + payment.card + payment.cash + payment.transfer
            }, 0)

            const sale = await Sale.findOne({
                client: clients[i]._id
            })

            if (sale && sale.summa > 0) {
                client.client = clients[i]._id
                client.id = clients[i].id
                client.born = clients[i].born
                client.phone = clients[i].phone
                client.connector = connector && connector._id
                client.firstname = clients[i].firstname
                client.lastname = clients[i].lastname
                client.bronDay = connector && connector.bronDay
                client.comment = sale.comment
                client.sectionssumma = summsections + summservices
                client.sale = sale && sale.summa
                client.payment = summpayments
                client.procient = sale.procient
                allclients.push(client)
            }
        }


        // console.log(clients);
        res.json(allclients)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/labaratoriya/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id,
            probirka: { $gt: 0 }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/doctor/:section', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const sections = await Section.find({
            headsectionid: req.params.section,
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            },
            priceCashier: { $gt: 0 }
        })
            .sort({ _id: -1 })
        let connectors = []

        for (let i = 0; i < sections.length; i++) {
            const connector = await Connector.findById(sections[i].connector)
            let k = true
            if (headsection.probirka && !connector.accept) {
                k = false
            }
            connectors.map((c) => {
                if ((connector._id).toString() === (c._id).toString()) {
                    k = false
                }
            })
            if (k) {
                connectors.push(connector)
            }
        }
        let countsection = []
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
            const sections = await Section.find({
                connector: connectors[i]._id,
                headsectionid: req.params.section,
                priceCashier: { $gt: 0 }
            })
                .sort({ _id: 1 })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ clients, connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/statsionar/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id,
            type: "statsionar"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptiononline/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id,
            type: "online"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.get('/reseptionborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        let sections = []
        let services = []
        let countsection = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
                .sort({ _id: 1 })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            let c = {
                accept: 0,
                all: 0
            }
            sec.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/directorborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const clientss = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })

        let connectors = []

        for (const client of clientss) {
            const connector = await Connector.findOne({
                client: client._id
            })
                .or([{ probirka: { $eq: 0 } }, { accept: true }])
                .populate('client', 'born firstname lastname id')
                .sort({ _id: -1 })
                .select('bronDay client probirka diagnosis')
            if (connector) {
                connectors.push(connector)
            }
        }

        let countsection = []

        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            let c = {
                accept: 0,
                all: 0
            }
            sections.map(section => {
                c.all = c.all + 1
                if (section.accept) {
                    c.accept = c.accept + 1
                }
            })
            countsection.push(c)
        }
        res.json({ connectors, countsection })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/labaratoriyaborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id,
                probirka: { $gt: 0 }
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/statsionarborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: { $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()), $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1) }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id,
                type: "statsionar"
            })
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/reseptionbornonline/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: { $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()), $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1) }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id,
                type: "online"
            })
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        let sections = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/statsionarid/:id', async (req, res) => {
    try {
        const edit = await Connector.findById(req.params.id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/endstatsionar/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connector = await Connector.findById(id)
        connector.position = "yakunlangan"
        connector.endDay = new Date()
        const usedroom = await UsedRoom.findOne({
            connector: id
        })
        usedroom.position = "yakunlangan"
        usedroom.endDay = new Date()
        const room = await Room.findById(usedroom.room)
        room.position = "bo'sh"
        await room.save()
        await usedroom.save()
        await connector.save()
        res.json(connector)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/connector
router.get('/clientallhistory/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connectors = await Connector.find({
            client: id
        })
            .sort({ _id: 1 })

        const sections = await Section.find({
                     priceCashier: { $gt: 0 },
                    client: id
                 }).select('nameid connector probirka accept summary subname comment name source').sort({ _id: 1 })

        const tablesections = await TableSection.find({
            clientid: id
        }).sort({ sectionid: 1 })

        const tablecolumns = await TableColumn.find({
        }).sort({ direction: 1 })

        const files = await FileSave.find({})

        let allsections = []
        let alltablesections = []
        let alltablecolumns = []
        let allsectionFiles = []

        for (const connector of connectors) {
            const fsections = filter(sections, {'connector':connector._id})
            let ftablesections = []
            let ftablecolumns = []
            let fsectionFiles = []
            for (const section of fsections){
                ftablesections.push(filter(tablesections, {'sectionid': section._id} ))
                ftablecolumns.push(...filter(tablecolumns, {'direction':section.nameid}))
                fsectionFiles.push(filter(files, {'section': section._id}))
            }
            allsections.push(fsections)
            alltablesections.push(ftablesections)
            alltablecolumns.push(ftablecolumns)
            allsectionFiles.push(fsectionFiles)
        }

        // for (let i = 0; i < connectors.length; i++) {
        //     const sections = await Section.find({
        //         connector: connectors[i]._id,
        //         priceCashier: { $gt: 0 }
        //     })
        //         .sort({ _id: 1 })
        //     let tablesections = []
        //     let tablecolumns = []
        //     let sectionFiles = []
        //     for (let j = 0; j < sections.length; j++) {
        //         const t = await TableSection.find({
        //             sectionid: sections[j]._id
        //         })
        //         tablesections.push(t)
        //         const tablecolumn = await TableColumn.findOne({
        //             direction: sections[j].nameid
        //         })
        //         const f = await FileSave.find({
        //             section: sections[j]._id
        //         })
        //         sectionFiles.push(f)
        //         tablecolumns.push(tablecolumn)
        //     }
        //     allsections.push(sections)
        //     alltablesections.push(tablesections)
        //     alltablecolumns.push(tablecolumns)
        //     allsectionFiles.push(sectionFiles)
        // }
        res.send({ connectors, allsections, alltablesections, alltablecolumns, allsectionFiles })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/connector
router.get('/clienthistory/:id', async (req, res) => {
    try {

        const id = req.params.id
        const connectors = await Connector.find({
            client: id
        })
            .sort({ _id: 1 })
        let allsections = []
        let alltablesections = []
        let alltablecolumns = []
        let allsectionFiles = []
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 },
            })
            let k = 0

            sections.map((section) => {
                if (section.done === "tasdiqlanmagan") {
                    k = 1
                }
            })
            if (k) {
                return res.status(500).json({ message: 'Xurmatli mijoz! Tahlil natijalaringiz hozirda tekshiruvda. Tayyor bo\'lishi bilan olish imkoniyatiga ega bo\'lasiz. Noqulaylik uzr so\'raymiz.' })
            }

            const summsections = sections.reduce((summ, section) => {
                return summ + section.priceCashier
            }, 0)
            const payments = await Payment.find({
                connector: connectors[i]._id
            })
            const sales = await Sale.findOne({
                connector: connectors[i]._id
            })
            const summpayments = payments.reduce((s, payment) => {
                return s + payment.card + payment.cash + payment.transfer
            }, 0)

            if (summsections > summpayments + sales.summa) {
                return res.status(500).json({ message: 'Xurmatli mijoz! Xizmatlar to\'lovlarini to\'liq to\'lamaguningizcha javoblarni online olish imkoniga ega emassiz. Noqulaylik uchun uzr.' })
            }
        }
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 },
                done: "tasdiqlangan"
            })
                .sort({ _id: 1 })

            let tablesections = []
            let tablecolumns = []
            let sectionFiles = []
            for (let j = 0; j < sections.length; j++) {
                const t = await TableSection.find({
                    sectionid: sections[j]._id
                })
                tablesections.push(t)
                const tablecolumn = await TableColumn.findOne({
                    direction: sections[j].nameid
                })
                const f = await FileSave.find({
                    section: sections[j]._id
                })
                sectionFiles.push(f)
                tablecolumns.push(tablecolumn)
            }
            allsections.push(sections)
            alltablesections.push(tablesections)
            alltablecolumns.push(tablecolumns)
            allsectionFiles.push(sectionFiles)
        }
        res.send({ connectors, allsections, alltablesections, alltablecolumns, allsectionFiles })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/reseption/:id', async (req, res) => {
    try {
        const edit = await Connector.findByIdAndDelete(req.params.id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/statsionardelete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const room = await UsedRoom.findOne({
            connector: id
        })
        const del = await UsedRoom.findByIdAndDelete(room._id)
        const sections = await Section.find({
            connector: id
        })
        sections.map(async (section) => {
            const del = await Section.findByIdAndDelete(section._id)
        })
        const services = await Service.find({
            connector: id
        })
        services.map(async (service) => {
            const del = await Service.findByIdAndDelete(service._id)
        })
        const edit = await Connector.findByIdAndDelete(req.params.id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



// /api/auth/connector/
router.get('/director', async (req, res) => {
    try {
        let connectors = []
        for (let i = 0; i < 12; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), i, 1),
                    $lt:
                        new Date(new Date().getFullYear(), i, 32)
                }
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors.push(connector.length)

        }
        res.json(connectors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/directorstatsionar', async (req, res) => {
    try {
        let connectors = []
        for (let i = 0; i < 12; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), i, 1),
                    $lt:
                        new Date(new Date().getFullYear(), i, 32)
                },
                type: "statsionar"
            })
                .sort({ _id: -1 })
            connectors.push(connector.length)

        }
        res.json(connectors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/statsionar', async (req, res) => {
    try {
        const connectors = await Connector.find({
            type: "statsionar",
            position: "davolanishda"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/cashierstatsionar', async (req, res) => {
    try {
        const rooms = await UsedRoom.find({})
            .or([{
                position: "band"
            },
            {
                endDay: {
                    $gte:
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    $lt: new Date(new Date().getFullYear(),
                        new Date().getMonth(), new Date().getDate() + 1)
                }
            }])
        let connectors = []
        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < rooms.length; i++) {
            const connector = await Connector.findById(rooms[i].connector)
            connectors.push(connector)
        }
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseption', async (req, res) => {
    try {
        // const pagenumber = 1
        // const connectors = await Connector.find({
        //     bronDay: {
        //         $gte:
        //             new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        //         $lt: new Date(new Date().getFullYear(),
        //             new Date().getMonth(), new Date().getDate() + 1)
        //     }
        // })
        //     .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
        //     .sort({ _id: -1 })
        //     .skip((pagenumber - 1) * 15)
        //     .limit(15)

        const sections = await Section.find({
            bronDay: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
                $lt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
            }
        }).or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            .populate('client')
            .populate('connector')
            .sort({connector: -1})
            .then(async (sections) => {
                let connectors = []
                let countsection = []
                let clients = []
                let i = -1
                let s = []
                let ss = []
                map(sections, (section, index) => {
                    if(index === 0 || section.connector._id.toString() !== sections[index - 1].connector._id.toString()) {
                        connectors.push(section.connector)
                        countsection.push({
                            accept: section.accept ? 1 : 0,
                            all: 1
                        })
                        clients.push(section.client)
                        if(index !== 0) {
                            ss.push(s)
                            s=[]
                        }
                        i++

                    } else {
                        countsection[i].all++
                        if(section.accept) {
                            countsection[i].accept++
                        }
                    }
                    section.connector = section.connector._id
                    s.push(section)
                })
                if(s.length > 0) {
                    ss.push(s)
                }
                return {connectors, countsection, clients, sections: ss}
            })


        let services  = []
        for (const connector of sections.connectors) {
            const service = await Service.find({
                connector: connector._id
            })
            services.push(service)
        }
        // let clients = []
        // let sections = []
        // let services = []
        // let countsection = []
        // for (let i = 0; i < connectors.length; i++) {
        //     const client = await Clients.findById(connectors[i].client)
        //     const sec = await Section.find({
        //         connector: connectors[i]._id
        //     })
        //         .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
        //         .sort({ _id: 1 })
        //     const service = await Service.find({
        //         connector: connectors[i]._id
        //     })
        //     let c = {
        //         accept: 0,
        //         all: 0
        //     }
        //     sec.map(section => {
        //         c.all = c.all + 1
        //         if (section.accept) {
        //             c.accept = c.accept + 1
        //         }
        //     })
        //     countsection.push(c)
        //     services.push(service)
        //     clients.push(client)
        //     sections.push(sec)
        // }

        res.json({ ...sections, services})
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/labaratoriya', async (req, res) => {
    try {
        const pagenumber = 1
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            },
            probirka: { $gt: 0 }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
            .skip((pagenumber - 1) * 15)
            .limit(15)
        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }
        res.json({ connectors, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/probirka', async (req, res) => {
    try {
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            },
            probirka: { $gt: 0 }
        }).sort({ _id: -1 })
        res.json(connectors.length);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/turnlab', async (req, res) => {
    try {
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            },
            probirka: { $gt: 0 }
        }).sort({ _id: -1 })
        res.json(connectors.length + 1);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/:id', async (req, res) => {
    try {
        const connectors = await Connector.findById(req.params.id)
        res.json(connectors);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/', async (req, res) => {
    try {
        const connectors = await Connector.find({}).sort({ _id: -1 })
        res.json(connectors);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/labaratoriya/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Connector.findById(id, req.body)
        edit.accept = true
        edit.position = " "
        await edit.save()
        const sections = await Section.find({
            probirka: true,
            connector: id,
        })
        for (let i = 0; i < sections.length; i++) {
            const section = await Section.findById(sections[i]._id)
            section.checkup = "chaqirilgan"
            await section.save()
        }
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/labaratoriyadontcome/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Connector.findById(id, req.body)
        edit.accept = false
        edit.position = "kelmagan"
        await edit.save()
        const sections = await Section.find({
            probirka: true,
            connector: id,

        })
        for (let i = 0; i < sections.length; i++) {
            const section = await Section.findById(sections[i]._id)
            section.checkup = "kelmagan"
            await section.save()
        }
        res.json(edit);
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/cashier/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Connector.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        let connector = req.body
        const pro = await Connector.findById(req.params.id)
        if ((pro.probirka === 0 || pro.probirka === null) && connector.probirka > 0) {
            const connectors = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lt: new Date(new Date().getFullYear(),
                        new Date().getMonth(), new Date().getDate() + 1)
                },
                probirka: { $gt: 0 }
            })
            connector.probirka = connectors.length + 1
            const edit = await Connector.findByIdAndUpdate(req.params.id, connector)
            return res.json(edit);
        }

        res.json(connector);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/', async (req, res) => {
    try {
        const edit = await Connector.findByIdAndUpdate(req.body._id, req.body)
        res.json({ message: "Izoh muvaffaqqiyatli saqlandi" });
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router
