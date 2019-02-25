const express = require('express')
const cookieParser = require('cookie-parser');
const axios = require('axios')
const app = express()
const port = 80
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(cookieParser());

app.get('/', async (req, res) => {
    try{
        if (req.cookies.token == undefined || req.cookies.userid == undefined) {
            res.render("index.ejs")
        }
        const authorization = await axios.get('http://localhost:3141/endpoints/accounts/' + req.cookies.userid, 
        {
            "headers": {
                authorization: req.cookies.token
            }
        })
        console.log(authorization.status)
        if(authorization.status == 200) {
            res.redirect(req.cookies.userid + '/services')
        }
    }
    catch (e) {
        console.log(e)
    }
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/:clientid/services', (req, res) => {
    var clientid = req.params.clientid;

})

app.get('/:clientid/services/create', (req, res) => {
    var clientid = req.params.clientid;
    if (req.cookies.userid != clientid) {
        res.render('unavaiable.ejs')
    }
    else {
        res.render('create-service.ejs')
    }
})

app.get('/:clientid/services/:serviceid', async (req, res) => {
    var clientid = req.params.clientid;
    var serviceid = req.params.serviceid;
    if (req.cookies.userid != clientid) {
        res.render('unavailable.ejs')
    }
    else if (req.cookies.token == undefined) {
        res.render('unavailable.ejs')
    }
    else {
        try {
            const request_promise = axios('http://localhost:3141/endpoints/' + clientid + '/services/' + serviceid,
                {
                    "headers": {
                        authorization: req.cookies.token
                    }
                }
            )
            const all_services_promise = axios('http://localhost:3141/endpoints/' + clientid + '/services',
                {
                    "headers": {
                        authorization: req.cookies.token
                    }
                }
            )
            const [request, all_services] = await Promise.all([request_promise, all_services_promise]);
            console.log(all_services.data)
            res.render('service.ejs', {
                serviceid: serviceid,
                clientid: clientid,
                servicename: request.data.name,
                token: req.cookies.token,
                logservice: request.data.log_command,
                services: all_services.data
            })
        }
        catch (e) {
            console.error(e)
            res.render('unavailable.ejs')
        }
    }
})

app.listen(port, () => console.log("STARTED"))