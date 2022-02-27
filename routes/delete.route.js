const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.delete('/', auth, async (req, res) => {
    try {
        console.log("Salom");
        res.json("O'chirildi")

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router