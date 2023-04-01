const { Router } = require('express')
const router = Router()
const { Sale, validateSale } = require('../models/Sale')
const auth = require('../middleware/auth.middleware')
const mongoose = require('mongoose')
const { Clients } = require('../models/Clients')

// /api/Sale/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateSale(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            client,
            connector,
            summa,
            procient,
            comment,
            day
        } = req.body
        const Sale = new Sale({
            client,
            connector,
            summa,
            procient,
            comment,
            day
        })
        await Sale.save()
        res.status(201).send(Sale)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const sale = await Sale.find({
            connector: req.params.id
        })
        console.log(sale);
        res.json(sale)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router
