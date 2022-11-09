var express = require('express')
var axios = require('axios')
var app = express()
const bodyParser = require('body-parser')

const dotenv = require('dotenv')
const { CLIENT_RENEG_LIMIT } = require('tls')
dotenv.config()

const token = '${USERNAME}:${PASSWORD}';
const encodedToken = Buffer.from(token).toString('base64');

const matTypeData = async (req,res) => {
    const response = await axios({
        method:"GET",
        url:process.env.MATTYPEURL,
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

const matGrpData = async (req,res) => {
    const response = await axios({
        method:"GET",
        url:process.env.MATGRPURL,
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

const filterPersonalsData = async (req,res) => {
    const response = await axios({
        method:"GET",
        url:process.env.FILTERPERSONALURL,
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

const salesOrganizationData = async (req, res) => {
    const response = await axios({
      method: "GET",
      url: process.env.SALESORGURL,
      params: {
        $format: "json",
      },
      host: "localhost",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + encodedToken,
        "x-csrf-token": "Fetch",
        "Access-Control-Allow-Origin": true,
      },
      auth: {
        username: process.env.SAPUSER,
        password: process.env.SAPPASSWORD,
      },
    });
  
    res.send(response.data.d.results);
};

const PlantsData = async (req, res) => {
    const response = await axios({
      method: "GET",
      url: process.env.WERKSURL,
      params: {
        $format: "json",
      },
      host: "localhost",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + encodedToken,
        "x-csrf-token": "Fetch",
        "Access-Control-Allow-Origin": true,
      },
      auth: {
        username: process.env.SAPUSER,
        password: process.env.SAPPASSWORD,
      },
    });

    res.send(response.data.d.results);
};

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.post(process.env.FILTEREDMATERIALLISTPATH, async(req, res) => {
  const data = req.body
  let filterArray = data.array
  let requestUrl = ''
  let duplicateValues = []
  let duplicateElements = []
  let nonDuplicateElements = []

  filterArray = filterArray.sort((firstElement, secondElement) => firstElement.oValue1 > secondElement.oValue1 ? 1 : -1)

  for (let index = 0; index < filterArray.length - 1; index++) {
    if(filterArray[index+1].sPath == filterArray[index].sPath){
      duplicateValues.push(filterArray[index].sPath)
    }
  }

  if(duplicateValues.length > 0){
    filterArray.filter((item) => {
      duplicateValues.includes(item.sPath) ? duplicateElements.push(item) : nonDuplicateElements.push(item)
    })

/*     filterArray.filter((item) => {
      !duplicateValues.includes(item.sPath) ? nonDuplicateElements.push(item) : 1
    }) */

    if(duplicateElements.length > 0){
      for (let index = 0; index < duplicateElements.length; index++) {
        if(duplicateElements[index+1] != undefined){
          if(duplicateElements[index+1].sPath == duplicateElements[index].sPath){
            requestUrl += `(${escape(`${duplicateElements[index].sPath} ${duplicateElements[index].operator} ${duplicateElements[index].oValue1} or ${duplicateElements[index+1].sPath} ${duplicateElements[index+1].operator} ${duplicateElements[index+1].oValue1}`)})`
          }
          else{
            requestUrl += `${escape(` and `)}`
          }
        }
        else{
          break
        }
      }
    
      if(nonDuplicateElements.length > 0){
        requestUrl += "%20and%20"
        nonDuplicateElements.forEach(element => {
          if(element.sPath != 'Ersda' && element.sPath != 'Laeda')
            requestUrl += `${escape(`(${element.sPath} ${element.operator} ${element.oValue1}) and `)}`
          else{
            element.oValue1 = element.oValue1.slice(0, -6)
            element.oValue1 = element.oValue1.slice(1)
            element.oValue2 = element.oValue2.slice(0, -6)
            element.oValue2 = element.oValue2.slice(1)
            requestUrl += `(${escape(`${element.sPath} ge datetime'`)}${element.oValue1}${escape(`'`)}${escape(` and `)}${escape(`${element.sPath} le datetime'`)}${element.oValue2}${escape(`'`)}) and  `
          }
        })
        
        requestUrl = requestUrl.slice(0,-6)
      }
    
    }
    
  }  
  else{
    filterArray.forEach(element => {
      if(element.sPath != 'Ersda' && element.sPath != 'Laeda')
        requestUrl += `${escape(`${element.sPath} ${element.operator} ${element.oValue1} and `)}`
      else{
        element.oValue1 = element.oValue1.slice(0, -6)
        element.oValue1 = element.oValue1.slice(1)
        element.oValue2 = element.oValue2.slice(0, -6)
        element.oValue2 = element.oValue2.slice(1)
        requestUrl += `(${escape(`${element.sPath} ge datetime'`)}${element.oValue1}${escape(`'`)}${escape(` and `)}${escape(`${element.sPath} le datetime'`)}${element.oValue2}${escape(`'`)}) and  `
      }
    })

    requestUrl = requestUrl.slice(0,-6)
  }

  console.log(requestUrl)
  const url = `${process.env.FILTEREDMATERIALLISTURL}?$filter=${requestUrl}` 

  const fetch_response = await axios({
    method: "GET",
    url: url,
    params: {
      $format: "json",
    },
    host: "localhost",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + encodedToken,
      "x-csrf-token": "Fetch",
      "Access-Control-Allow-Origin": true,
    },
    auth: {
      username: process.env.SAPUSER,
      password: process.env.SAPPASSWORD
    }
  });

  const json = await fetch_response
  res.send(json.data.d.results)
})

app.post(process.env.PERSONALPATH, async(req, res) => {
  const data = req.body
  const IvPerson = data.IvPerson
  const userName = data.userName
  const url = `${process.env.PERSONALURL}?$filter=${escape(`${IvPerson} eq '${userName}'`)}`
  
  const fetch_response = await axios({
    method: "GET",
    url: url,
    params: {
      $format: "json",
    },
    host: "localhost",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + encodedToken,
      "x-csrf-token": "Fetch",
      "Access-Control-Allow-Origin": true,
    },
    auth: {
      username: process.env.SAPUSER,
      password: process.env.SAPPASSWORD
    }
  });

  const json = await fetch_response
  res.send(json.data.d.results)
})

app.get(process.env.MATTYPEDATAPATH, matTypeData)
app.get(process.env.MATGRPDATAPATH, matGrpData)
app.get(process.env.SALESORGANIZATIONPATH, salesOrganizationData)
app.get(process.env.WERKSPATH, PlantsData)
app.get(process.env.FILTERPERSONALPATH, filterPersonalsData)

app.listen(process.env.PORT, () => {
    console.log("Listening")
})