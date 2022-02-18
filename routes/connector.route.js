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
        const client = await Clients.find({
            id: id
        })
        if (client.length === 0) {
            res.status(500).json({ message: "Bunday ID raqamli mijoz tizimda ro'yxatga olinmagan!" })
        }
        const sections = await Section.find({
            headsectionid: req.params.section,
            client: client[0]._id,
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
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
router.get('/doctor/:start/:end/:section/:probirka', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const sections = await Section.find({
            headsectionid: req.params.section,
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
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
            if (k && connector.probirka == req.params.probirka) {
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
router.get('/doctorfish/:start/:end/:section/:fish', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
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
        let sections = []
        for (let i = 0; i < clientss.length; i++) {
            const section = await Section.find({
                headsectionid: req.params.section,
                client: clientss[i]._id,
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
            })
            section.map(s => {
                sections.push(s)
            })
        }

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
router.get('/directorprobirka/:start/:end/:probirka', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const sections = await Section.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
        let connectors = []
        for (let i = 0; i < sections.length; i++) {
            const connector = await Connector.findById(sections[i].connector)
            let k = true
            connectors.map((c) => {
                if ((connector._id).toString() === (c._id).toString()) {
                    k = false
                }
            })
            if (k && connector.probirka == req.params.probirka) {
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
router.get('/directorid/:start/:end/:id', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        if (client.length === 0) {
            res.status(500).json({ message: "Bunday ID raqamli mijoz tizimda ro'yxatga olinmagan!" })
        }
        const sections = await Section.find({
            client: client[0]._id,
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
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
router.get('/doctor/:start/:end/:section', async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.section)
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const sections = await Section.find({
            headsectionid: req.params.section,
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .sort({ _id: 1 })
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
                name: section
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
                name: section
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
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let sections = []
        for (let i = 0; i < clientss.length; i++) {
            const section = await Section.find({
                client: clientss[i]._id,
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
            })
            section.map(s => {
                sections.push(s)
            })
        }

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
            }
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
        let sections = []
        for (let i = 0; i < clientss.length; i++) {
            const section = await Section.find({
                headsectionid: req.params.section,
                client: clientss[i]._id
            })
            section.map(s => {
                sections.push(s)
            })
        }

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
router.get('/doctorconnector/:section/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connector = await Connector.findById(id)
        const sections = await Section.find({
            headsectionid: req.params.section,
            connector: connector._id
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
            connector: connector._id
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
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id
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
            }
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
        let sections = []
        for (let i = 0; i < clientss.length; i++) {
            const section = await Section.find({
                client: clientss[i]._id
            })
            section.map(s => {
                sections.push(s)
            })
        }

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
        let allsections = []
        let alltablesections = []
        let alltablecolumns = []
        let allsectionFiles = []
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id
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

// /api/connector
router.get('/clienthistory/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connectors = await Connector.find({
            client: id
        })
            .sort({ _id: -1 })
        let allsections = []
        let alltablesections = []
        let alltablecolumns = []
        for (let i = 0; i < connectors.length; i++) {
            const sections = await Section.find({
                connector: connectors[i]._id,
                done: "tasdiqlangan",
                priceCashier: { $ne: 0 }
            })
            let tablesections = []
            let tablecolumns = []
            for (let j = 0; j < sections.length; j++) {
                const t = await TableSection.find({
                    sectionid: sections[j]._id
                })
                tablesections.push(t)
                const tablecolumn = await TableColumn.findOne({
                    direction: sections[j].nameid
                })
                tablecolumns.push(tablecolumn)
            }
            allsections.push(sections)
            alltablesections.push(tablesections)
            alltablecolumns.push(tablecolumns)
        }
        res.send({ connectors, allsections, alltablesections, alltablecolumns })

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
router.get('/directorclients', async (req, res) => {
    try {
        const sections = await Section.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            }
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
        const pagenumber = 1
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
            .skip((pagenumber - 1) * 15)
            .limit(15)
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