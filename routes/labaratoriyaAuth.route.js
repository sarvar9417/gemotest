const { Router } = require('express')
const router = Router()
const { Labaratoriya, validateLabaratoriya, validateLabaratoriyaLogin } = require('../models/Labaratoriya')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateLabaratoriya(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            login,
            password,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        } = req.body

        const candidate = await Labaratoriya.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const labaratoriya = new Labaratoriya({
            login,
            password: hash,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        })
        await labaratoriya.save()
        res.status(201).json({ message: "Labaratoriya yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateLabaratoriyaLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const labaratoriya = await Labaratoriya.findOne({ login })

        if (!labaratoriya) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, labaratoriya.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { labaratoriyaId: labaratoriya._id },
            config.get('jwtSecret')
        )
        res.send({ token, labaratoriyaId: labaratoriya._id })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/labaratoriya/:id
router.patch('/:id', async (req, res) => {
    try {
        const { error } = validateLabaratoriya(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            login,
            password,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image } = req.body

        // const candidate = await Director.findOne({ login })
        // if (candidate) {
        //     return res.status(400).json({ message: 'Bunday Loginli foydalanuvchi tizimda avvaldan mavjud' })
        // }
        const hash = await bcrypt.hash(password, 8)
        const labaratoriya = await Labaratoriya.findById(req.params.id)
        labaratoriya.login = login
        labaratoriya.password = hash
        labaratoriya.firstname = firstname
        labaratoriya.lastname = lastname
        labaratoriya.fathername = fathername
        labaratoriya.section = section
        labaratoriya.born = born
        labaratoriya.phone = phone
        labaratoriya.image = image
        const update = await labaratoriya.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', async (req, res) => {
    try {
        const labaratoriya = await Labaratoriya.find()
        res.json(labaratoriya)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router
