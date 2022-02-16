const { Router } = require('express')
const router = Router()
const { TableDirection, validateTableDirection } = require('../models/TableDirection')
const auth = require('../middleware/auth.middleware')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/tabledirection/register

router.post('/register', auth, async (req, res) => {
    try {
        // const { error } = validateTableDirection(req.body)
        // if (error) {
        //     return res.status(400).json({
        //         error: error,
        //         message: error.message
        //     })
        // }
        if (req.body._id) {
            const tabledirection = await TableDirection.findByIdAndUpdate(req.body._id, req.body)
            return res.status(201).send(tabledirection)
        }

        const {
            directionid,
            headsectionid,
            name,
            norma,
            result,
            additionalone,
            additionaltwo,
            accept
        } = req.body
        const tabledirection = new TableDirection({
            directionid,
            headsectionid,
            name,
            norma,
            result,
            additionalone,
            additionaltwo,
            accept
        })
        await tabledirection.save()
        res.status(201).send(tabledirection)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const tabledirections = await TableDirection.find({
            directionid: req.params.id
        })
        res.json(tabledirections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/doctor/:section', auth, async (req, res) => {
    try {
        const tabledirections = await TableDirection.find({
            headsection: req.params.section
        })
        res.json(tabledirections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/id/:id', auth, async (req, res) => {
    try {
        const tabledirection = await TableDirection.findById(req.params.id)
        res.json(tabledirection)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/template/:id', auth, async (req, res) => {
    try {
        const tabledirection = await TableDirection.findById(req.params.id)
        res.json(tabledirection)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/fizioterapevt', async (req, res) => {
    try {
        const tabledirection = await TableDirection.find({
            section: "ФИЗИОТЕРАПИЯ"
        }).sort({ section: 1 })
        res.json(tabledirection)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/tabledirection
router.get('/:name', async (req, res) => {
    try {
        const name = new RegExp('.*' + req.params.name + ".*", "i")
        const tabledirection = await TableDirection.find({
        })
            .or([{ section: name }, { subsection: name }])
            .sort({ section: 1 })
        res.json(tabledirection)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/tabledirection
router.get('/', async (req, res) => {
    try {
        const tabledirection = await TableDirection.find().sort({ section: 1 })
        res.json(tabledirection)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})




router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await TableDirection.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await TableDirection.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router