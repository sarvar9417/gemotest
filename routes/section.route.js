const { Router } = require('express')
const router = Router()
const { Section, validateSection } = require('../models/Section')
const { Service, validateService } = require('../models/Service')
const { Payment, validatePayment } = require('../models/Payment')
const auth = require('../middleware/auth.middleware')
const { TableDirection } = require('../models/TableDirection')
const { TableSection } = require('../models/TableSection')
const { Direction } = require('../models/Direction')
const { Connector } = require('../models/Connector')
const { Clients } = require('../models/Clients')
const { Sale } = require('../models/Sale')

// ===================================================================================
// ===================================================================================
// RESEPTION routes
// /api/section/reseption/register/
router.post('/reseption/register/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const { error } = validateSection(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }


        const {
            headsection,
            name,
            subname,
            shortname,
            price,
            priceCashier,
            commentCashier,
            comment,
            summary,
            done,
            payment,
            turn,
            bron,
            bronDay,
            bronTime,
            position,
            checkup,
            connector,
            doctor,
            source,
            counteragent,
            paymentMethod,
            nameid,
            headsectionid,
            accept,
            probirka
        } = req.body

        const sections = await Section.find({
            headsectionid: headsectionid,
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            }
        })

        let Turn = 0

        const sorted = []
        for (let i = 0; i < sections.length; i++) {
            let k = true
            for (let j = 0; j < sorted.length; j++) {
                if ((sections[i].connector).toString() === (sorted[j].connector).toString()) {
                    k = false
                }
            }
            if ((sections[i].connector).toString() === (connector).toString()) {
                Turn = sections[i].turn
            }
            if (k && (sections[i].connector).toString() !== (connector).toString()) {
                sorted.push(sections[i])
            }
        }

        const section = new Section({
            client: id,
            headsection,
            name,
            subname,
            shortname,
            price,
            priceCashier,
            commentCashier,
            comment,
            summary,
            done,
            payment,
            turn: Turn > 0 ? Turn : sorted.length + 1,
            bron,
            bronDay,
            bronTime,
            position,
            checkup,
            connector,
            doctor,
            source,
            counteragent,
            paymentMethod,
            nameid,
            headsectionid,
            accept,
            probirka
        })

        const tabledirection = await TableDirection.find({
            directionid: nameid
        })

        for (let i = 0; i < tabledirection.length; i++) {
            const sectiontable = new TableSection({
                sectionid: section._id,
                connectorid: connector,
                clientid: id,
                name: tabledirection[i].name,
                norma: tabledirection[i].norma,
                result: tabledirection[i].result,
                additionalone: tabledirection[i].additionalone,
                additionaltwo: tabledirection[i].additionaltwo,
                accept: tabledirection[i].accept
            })
            await sectiontable.save()
        }

        await section.save()
        res.status(201).json({ message: "Mijoz yaratildi." })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/reseption/turn', auth, async (req, res) => {
    try {
        const section = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) }
        }).sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/reseption', auth, async (req, res) => {
    try {
        const section = await Section.find().sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/section/reseption
router.get('/reseption/:id', async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.findById(id)
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption/clientId //
router.get('/reseptionid/:id', async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({ client: id })
            .sort({ _id: 1 })
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption/clientId //
router.get('/reseptionid/:id/:connector', auth, async (req, res) => {
    try {
        const id = req.params.id
        const connector = req.params.connector
        const sections = await Section.find({ client: id, connector: connector })
            .sort({ _id: 1 })
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.put('/reseption/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.position = req.body.position
        await edit.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/reseption/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})
// END RESEPTION routes
// ===================================================================================
// ===================================================================================



// ===================================================================================
// ===================================================================================
// CASHIER routes
// /api/section/reseption
router.get('/cashier', auth, async (req, res) => {
    try {
        const section = await Section.find().sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/
router.get('/cashierconnector/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({
            connector: id,
        }).sort({ _id: 1 })
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/
router.get('/cashierconnectorstatsionar/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({
            connector: id
        }).sort({ _id: -1 })
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/section/
router.get('/cashieredit/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({
            connector: id,
        }).sort({ _id: -1 })
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/section/
router.get('/cashier/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({ client: id }).sort({ _id: -1 })
        res.json(sections);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/cashier/
router.patch('/cashier/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/cashier/
router.patch('/cashier', auth, async (req, res) => {
    try {
        const sections = req.body.sections
        const services = req.body.services
        const payment = req.body.payment
        const sale = req.body.sale
        let p = 0

        for (let i = 0; i < sections.length; i++) {
            const section = await Section.findByIdAndUpdate(sections[i]._id, sections[i])
        }
        for (let i = 0; i < services.length; i++) {
            const service = await Service.findByIdAndUpdate(services[i]._id, services[i])
        }

        const {
            client,
            connector,
            total,
            type,
            card,
            transfer,
            cash,
            position
        } = payment
        const newpayment = new Payment({
            client,
            connector,
            total,
            type,
            card,
            transfer,
            cash,
            position
        })

        if (sale._id) {
            const oldsale = await Sale.findByIdAndUpdate(sale._id, sale)
        } else {
            const newsale = new Sale({
                client: sale.client,
                connector: sale.connector,
                summa: sale.summa,
                procient: sale.procient,
                comment: sale.comment,
                day: sale.day
            })
            await newsale.save()
        }
        await newpayment.save()
        res.json(newpayment)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// END CASHIER routes
// ===================================================================================
// ===================================================================================



// ===================================================================================
// ===================================================================================
// DOCTOR routes

// Get online sections
router.get('/doctoronline/:section', auth, async (req, res) => {
    try {
        const sections = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "online",
            checkup: "chaqirilmagan",
            name: req.params.section,
            position: "kelgan",
            payment: { $ne: "to'lanmagan" }
        })
            .or([{ payment: "to'langan" }, { commentCashier: { $ne: " " } }])
            .and([{ payment: { $ne: "to'lanmagan" } }, {}])
            .sort({ bronTime: 1 })
        let c = []
        sections.map((section) => {
            if (new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()) {
                c.push(section)
            }
        })
        res.json(c[0])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// Get offline sections
router.get('/doctoroffline/:section', auth, async (req, res) => {
    try {
        const sections = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "offline",
            checkup: "chaqirilmagan",
            name: req.params.section,
            payment: { $ne: "to'lanmagan" },
            priceCashier: { $ne: 0 }
        })
            .or([{ payment: "to'langan" }, { commentCashier: { $ne: " " } }])
            .sort({ turn: 1 })
        let c = []
        sections.map((section) => {
            if (new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()) {
                c.push(section)
            }
        })
        res.json(c[0])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/section/doctor
router.get('/doctor/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.findById(id)
        res.json(sections);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.put('/doctordontcome/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.checkup = req.body.checkUp
        await edit.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// Get sections
router.get('/doctorall/:section', auth, async (req, res) => {
    try {
        const section = await Section.find({
            name: req.params.section,
            payment: { $ne: "to'lanmagan" },

        })
            .or([{ payment: "to'langan" }, { commentCashier: { $ne: " " } }])
            .sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// Get history
router.get('/doctorhistory/:id', auth, async (req, res) => {
    try {
        const section = await Section.find({
            client: req.params.id,
            priceCashier: { $gt: 0 }
        }).sort({ turn: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.put('/doctordone/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.checkup = req.body.checkUp
        edit.comment = req.body.comment
        edit.summary = req.body.summary
        edit.done = req.body.done
        edit.doctor = req.body.doctor
        await edit.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/doctor', auth, async (req, res) => {
    try {
        const sections = req.body.sections
        const tablesections = req.body.tablesections
        for (let i = 0; i < sections.length; i++) {
            const section = await Section.findByIdAndUpdate(sections[i]._id, { ...sections[i] })
            for (let j = 0; j < tablesections[i].length; j++) {
                const tablesection = await TableSection.findByIdAndUpdate(tablesections[i][j]._id, { ...tablesections[i][j] })
            }
        }
        res.send({ message: "Ma'lumot yangilandi." })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// END DOCTOR SECTION
// ===================================================================================
// ===================================================================================


// ===================================================================================
// ===================================================================================
// DIRECTOR routes

router.get('/directorproceeds', auth, async (req, res) => {
    try {
        const sections = []
        for (let i = 0; i < 12; i++) {
            const section = await Section.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), i, 1),
                    $lt:
                        new Date(new Date().getFullYear(), i, 32)
                },
                priceCashier: { $gt: 0 }
            })
                .or([{ bron: "offline" }, { bron: "online" }, { bron: "callcenter" }])
                .sort({ _id: -1 })
            let summ = 0
            section.map(price => {
                summ = summ + price.priceCashier
            })
            sections.push(summ)
        }

        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/directorproceedsstatsionar', auth, async (req, res) => {
    try {
        const sections = []
        for (let i = 0; i < 12; i++) {
            const section = await Section.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), i, 1),
                    $lt:
                        new Date(new Date().getFullYear(), i, 32)
                },
                bron: "statsionar"
            })
                .sort({ _id: -1 })
            let summ = 0
            section.map(price => {
                summ = summ + price.priceCashier
            })
            sections.push(summ)
        }

        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/director/kunduzgi', auth, async (req, res) => {
    try {
        const sections = await Section.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
            }
        })
            .or([{ bron: "online", bron: "offline", bron: "callcenter" }, {}])
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/director/:index', auth, async (req, res) => {
    try {
        const months = parseInt(req.params.index)
        const sections = await Section.find()
        var m = 0
        var n = 0
        sections.map((section) => {
            if (parseInt(new Date(section.bronDay).getMonth()) === months) {
                m++
                n = n + section.priceCashier
            }
        })
        res.json({ count: m, price: n })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// END DIRECTOR SECTION
// ===================================================================================
// ===================================================================================

// ===================================================================================
// ===================================================================================
// Counteragent routes
router.get('/counteragent/:agent', async (req, res) => {
    try {
        const sections = await Section.find({
            counterAgent: req.params.agent
        }).sort({ bronDay: -1 })
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// END COUNTERAGENT SECTION
// ===================================================================================
// ===================================================================================

// ===================================================================================
// ===================================================================================
// Advertisement routes
router.get('/advertisement/:agent', async (req, res) => {
    try {
        const sections = await Section.find({
            source: req.params.agent
        }).sort({ bronDay: -1 })
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// END Advertisement SECTION
// ===================================================================================
// ===================================================================================

router.get('/table/:start/:end/:section', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const directions = await Direction.find({
            section: req.params.section,
            table: true,
            tableturn: { $gt: 0 }
        })
            .sort({ tableturn: 1 })

        let allsections = []
        for (let i = 0; i < directions.length; i++) {
            const sections = await Section.find({
                name: directions[i].section,
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt:
                        new Date(new Date(end).getFullYear(), new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                priceCashier: { $gt: 0 }
            })
            allsections = allsections.concat(sections)
        }
        let connectors = []
        for (let i = 0; i < allsections.length; i++) {
            const connector = await Connector.findById(allsections[i].connector)
            let k = true
            if (!connector.accept) {
                k = false
            }

            connectors.map(c => {
                (c._id).toString() === (connector._id).toString() ?
                    k = false :
                    ""
            })
            if (k) {
                connectors.push(connector)
            }
        }

        let clients = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            clients.push(client)
        }

        let datas = []
        let tables = []
        let sec = []
        for (let i = 0; i < connectors.length; i++) {
            let data = []
            let table = []
            const sections = await Section.find({
                connector: connectors[i]._id,
                priceCashier: { $gt: 0 }
            })
            for (let j = 0; j < directions.length; j++) {
                let yes
                let t
                for (let k = 0; k < sections.length; k++) {
                    if (directions[j].subsection === sections[k].subname) {
                        yes = 1
                        t = await TableSection.findOne({
                            sectionid: sections[k]._id
                        })
                        sec.push(sections[k])
                    }
                }
                data.push(yes)
                table.push(t)
            }
            datas.push(data)
            tables.push(table)
        }


        res.send({ clients, datas, directions, tables, connectors, sec })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// ===================================================================================
// ===================================================================================
// TURN routes

router.get('/turn/:section', async (req, res) => {
    try {
        const section = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "offline",
            checkup: "chaqirilmagan",
            name: req.params.section,
            payment: { $ne: "to'lanmagan" }
        }).sort({ turn: 1 })
        res.json(section[0])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/turnid/:id', async (req, res) => {
    try {
        const section = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "offline",
            checkup: "chaqirilmagan",
            headsectionid: req.params.id
            // payment: { $ne: "to'lanmagan" }
        }).sort({ turn: 1 })
        if (section.length === 0) {
            return res.json(null)
        }
        const direction = await Direction.findById(section[0].nameid)
        if (!direction) {
            return res.json(null)
        }
        res.json({ section: section[0], room: direction.room })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// END TURN
// ===================================================================================
// ===================================================================================



// /api/section/
router.get('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({ client: id }).sort({ _id: -1 })
        res.json(sections);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.put('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.position = req.body.position
        await edit.save()
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/table', auth, async (req, res) => {
    try {
        const alltables = [...req.body]
        alltables.map(async (tables) => {
            tables.map(async (table) => {
                if (table) {
                    const section = await Section.findById(table.sectionid)
                    section.accept = true
                    await section.save()
                    const t = await TableSection.findByIdAndUpdate(table._id, table)
                }
            })
        })
        res.json({ message: "Ma'lumotlar muvaffaqqiyatli saqlandi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/sections', auth, async (req, res) => {
    try {
        const sections = [...req.body]
        sections.map(async (section) => {
            const s = await Section.findByIdAndUpdate(section._id, section)
        })
        res.json({ message: "Ma'lumotlar muvaffaqqiyatli saqlandi" })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndDelete(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router
