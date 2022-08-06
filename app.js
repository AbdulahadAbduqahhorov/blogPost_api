const PORT = 3000;
const express = require('express')

const app = express()

app.use(express.json())

const loggerMiddeware = (req, res, next) => {
    let d = new Date,
        dformat = [d.getDate(),
        d.getMonth() + 1,
        d.getFullYear()].join('/') + ' ' +
            [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
    next()
    let diff = new Date() - d
    console.log(`--------> ${dformat} | ${req.method}: ${req.url} | ${diff} ms`)
}

const secretKey = 'mySecretKey'
function Auth(req,res,next) {
    let key = req.headers['authorization']
    console.log(key)
    if (key == secretKey) {
        next()
        return
    }
    res.status(401).send("Unauthorized");
}

app.get('/',(req, res) => {
    res.send("Server is running...")
})
const contactRouter = require('./routes/contact')
const blogRouter = require('./routes/blog')
app.use('/api/blog',loggerMiddeware,blogRouter)
app.use('/api/contact',Auth,loggerMiddeware, contactRouter)
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})