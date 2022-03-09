var express = require('express')
var axios = require('axios')
var app = express()

const dotenv = require('dotenv')
dotenv.config()

const token = '${USERNAME}:${PASSWORD}';
const encodedToken = Buffer.from(token).toString('base64');

const ChangeLogData = async (req,res) => {
    const response = await axios({
        method:"GET",
        url:process.env.SAPURL,
        params:{
            $format:"json"
        },
        host : 'localhost',        
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization': 'Basic '+encodedToken,
            "x-csrf-token" : "Fetch",
            "Access-Control-Allow-Origin": true
        },
        auth:{
            username: process.env.SAPUSER,
            password: process.env.SAPPASSWORD
        }
    })

    res.send(response.data.d.results)
}

app.get(process.env.DATAPATH, ChangeLogData)

app.listen(process.env.PORT, () => {
    console.log("Listening")
})