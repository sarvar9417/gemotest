const { Router } = require("express")
const { HeadSection, validateHeadSection } = require("../models/HeadSection")
const { Direction } = require('../models/Direction')
const router = Router()

router.post("/register", async (req, res) => {
    try {

        const { error } = validateHeadSection(req.body)
        if (error) {
            res.json({ error: error })
        }
        const newheadsection = new HeadSection({
            name: req.body.name,
            probirka: req.body.probirka
        })
        await newheadsection.save()
        res.json(newheadsection)
    } catch (error) {
        res.json({ error: "Serverda xatolik yuz berdi" })
    }
})

router.get("/probirka", async (req, res) => {
    try {
        const headsections = await HeadSection.find({
            probirka: true
        }).sort({ _id: -1 })
        res.json(headsections)
    } catch (error) {
        res.json({ error: "Serverda xatolik yuz berdi" })
    }
})

router.get("/", async (req, res) => {
    try {
        const headsections = await HeadSection.find().sort({ _id: -1 })
        res.json(headsections)
    } catch (error) {
        res.json({ error: "Serverda xatolik yuz berdi" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const headsection = await HeadSection.findById(req.params.id)
        res.json(headsection)
    } catch (error) {
        res.json({ error: "Serverda xatolik yuz berdi" })
    }
})


router.patch("/:id", async (req, res) => {
    try {
        const headsections = await HeadSection.findByIdAndUpdate(req.params.id, req.body)
        res.json(headsections)
    } catch (error) {
        res.json({ error: "Serverda xatolik yuz berdi" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const directions = await Direction.find({
            headsection: req.params.id
        })

        for (let i = 0; i < directions.length; i++) {
            const direction = await Direction.findByIdAndDelete(directions[i]._id)
        }
        const headsections = await HeadSection.findByIdAndDelete(req.params.id)
        res.json(headsections)
    } catch (error) {
        res.json({ error: "Serverda xatolik yuz berdi" })
    }
})

module.exports = router