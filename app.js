const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const fileupload = require("express-fileupload");

const app = express()

const PORT = config.get("PORT")

const path = require('path')

app.use(fileupload())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
// Director
app.use('/api/auth/director', require('./routes/directorAuth.route'))
// Reseption
app.use('/api/auth/reseption', require('./routes/reseptionAuth.route'))
// Cashier
app.use('/api/auth/cashier', require('./routes/cashierAuth.route'))
// Doctor
app.use('/api/auth/doctor', require('./routes/doctorAuth.route'))
// Medsestra
app.use('/api/auth/medsestra', require('./routes/medsestraAuth.route'))
// Labaratoriya
app.use('/api/auth/labaratoriya', require('./routes/labaratoriyaAuth.route'))
// Fizioterapevt
app.use('/api/auth/fizioterapevt', require('./routes/fizioterapevtAuth.route'))
// Clients
app.use('/api/clients', require('./routes/clients.route'))
// Section
app.use('/api/section', require('./routes/section.route'))
// Sections
app.use('/api/direction', require('./routes/direction.route'))
// Connector
app.use('/api/connector', require('./routes/connector.route'))
// CompanyLogo
app.use('/api/companylogo', require('./routes/companylogo.route'))
// ClientsHistory
app.use('/api/clienthistorys', require('./routes/clientshistory.route'))
// TemplateDoctor
app.use('/api/templatedoctor', require('./routes/templateDoctor.route'))
// Source
app.use('/api/source', require('./routes/source.route'))
// CounterAgent
app.use('/api/counteragent', require('./routes/counteragent.route'))
// CounterAgent
app.use('/api/counteragentpayment', require('./routes/counteragentpayment.route'))
// CounterDoctor
app.use('/api/counterdoctor', require('./routes/counterdoctor.route'))
// CallCenter
app.use('/api/callcenter', require('./routes/callcenter.route'))
// Operator
app.use('/api/auth/operator', require('./routes/operatorAuth.route'))
// wareHouse
app.use('/api/warehouse', require('./routes/warehouse.route'))
//Ware
app.use('/api/ware', require('./routes/ware.route'))
//WareConnector
app.use('/api/wareconnector', require('./routes/wareconnector.route'))
//WareUsed
app.use('/api/wareused', require('./routes/wareused.route'))
// Rooms
app.use('/api/rooms', require('./routes/rooms.route'))
// Rooms
app.use('/api/usedroom', require('./routes/usedroom.route'))
// Service
app.use('/api/service', require('./routes/sevices.route'))
// Payment
app.use('/api/payment', require('./routes/payment.route'))
// HeadSection
app.use('/api/headsection', require('./routes/headsection.route'))
// TableDirection
app.use('/api/tabledirection', require('./routes/tabledirection.route'))
// TableColumn
app.use('/api/tablecolumn', require('./routes/tablecolumn.route'))
// FileSave
app.use('/api/file', require('./routes/filesave.route'))
// Delete
app.use('/api/tozalash', require('./routes/delete.route'))
// Sale
app.use('/api/sale', require('./routes/sale.route'))
if (process.env.NODE_ENV === "production") {
    app.use('/', express.static(path.join(__dirname, 'frontend', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}
async function start() {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useFindAndModify: false
        })
            .then(() => { console.log('Connect to MongoDB') })
            .catch(() => { console.log('Connecting error to MongoDB') })
        app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1)
    }
}
start()