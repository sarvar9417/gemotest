const { Router } = require('express')
const router = Router()
const { TableColumn, validateTableColumn } = require('../models/TableColumn')

// /api/auth/tablecolumn/register
router.post('/register', async (req, res) => {
    try {
        const col = req.body
        if (!col._id) {
            const { error } = validateTableColumn(req.body)
            if (error) {
                return res.status(400).json({
                    error: error,
                    message: error.message
                })
            }
            const { direction, col1, col2, col3, col4, col5 } = req.body
            const tablecolumn = new TableColumn({ direction, col1, col2, col3, col4, col5 })
            await tablecolumn.save()
            return res.status(201).send(tablecolumn)
        }

        const tablecolumn = await TableColumn.findByIdAndUpdate(col._id, col)
        const column = await TableColumn.findById(col._id)
        res.status(201).send(column)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const tablecolumn = await TableColumn.findOne({
            direction: req.params.id
        })
        console.log(tablecolumn);
        res.json(tablecolumn)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router