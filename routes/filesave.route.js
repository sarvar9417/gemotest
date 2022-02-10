const { Router } = require('express')
const router = Router()
const { FileSave } = require('../models/FileSave')

// /api/auth/callcenter/register
router.post('/', async (req, res) => {
    try {
        const files = req.body
        files.map(async (file) => {
            const old = await FileSave.findById(file._id)
            if (!old) {
                const f = new FileSave({
                    section: file.section,
                    imageurl: file.imageurl,
                    imageid: file.imageid
                })
                await f.save()

            }

        })

        res.json({ message: "Ma'lumotlar saqlandi" })


    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const file = await FileSave.findByIdAndDelete(req.params.id)
        res.json({ message: "Ma'lumot o'chirildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router