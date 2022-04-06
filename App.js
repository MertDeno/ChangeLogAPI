var express = require("express");
var axios = require("axios");
var app = express();
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const token = "${USERNAME}:${PASSWORD}";
const encodedToken = Buffer.from(token).toString("base64");

const ChangeLogPlantsData = async (req, res) => {
  const response = await axios({
    method: "GET",
    url: process.env.SAPURL_Werks,
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
const ChangeLogMatnrData = async (req, res) => {
  const response = await axios({
    method: "GET",
    url: process.env.SAPURL_Materials,
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
const ChangeLogMtartData = async (req, res) => {
  const response = await axios({
    method: "GET",
    url: process.env.SAPURL_Mtart,
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
const ChangeLogSorgData = async (req, res) => {
  const response = await axios({
    method: "GET",
    url: process.env.SAPURL_Sorg,
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
app.get(process.env.DATAPATH_Werks, ChangeLogPlantsData);
app.get(process.env.DATAPATH_Materials, ChangeLogMatnrData);
app.get(process.env.DATAPATH_Mtart, ChangeLogMtartData);
app.get(process.env.DATAPATH_Sorg, ChangeLogSorgData);

app.listen(process.env.PORT, () => {
  console.log("Listening");
});
