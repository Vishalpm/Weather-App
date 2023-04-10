const http = require("http");
const fs = require("fs");
var requests = require("requests");
const express = require("express");

const app = express();

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgval) => {

    var tempCels = Math.round((orgval.main.temp-273.15));
    let temprature = tempVal.replace("{%tempval%}", tempCels);
    temprature = temprature.replace("{%tempmin%}", orgval.main.temp_min);
    temprature = temprature.replace("{%tempmax%}", orgval.main.temp_max);
    temprature = temprature.replace("{%location%}", orgval.name);
    temprature = temprature.replace("{%country%}", orgval.sys.country);
    temprature = temprature.replace("{%tempstatus%}", orgval.weather[0].main);
    // {%tempstatus%}
    return temprature;
}


// const server =  http.createServer((req, res) =>{
//     if(req.url == "/"){
       
//         requests(`https://api.openweathermap.org/data/2.5/weather?q=pune&appid=98b34c69537eceda4ced443f649c9872`)
//             .on('data',  (chunk) => {
//                 const objdata = JSON.parse(chunk);
//                 const arrData = [objdata];
//                 // console.log(arrData[0].main.temp );
//                 const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
//                 res.write(realTimeData);
//                 // console.log(realTimeData);
//             })
//             .on('end',  (err) =>{
//             if (err) return console.log('connection closed due to errors', err);
            
//             console.log('end');
//             });  
//     }
// });

app.get("/", (req, res)=>{
    var city = "pune";
    const obj = req.query.name;
    var data = obj != "" ? obj : "pune";
    console.log(data);
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=98b34c69537eceda4ced443f649c9872`)
    .on('data',  (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp );
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);
        // res.send(realTimeData);
    })
    .on('end',  (err) =>{
    if (err) return console.log('connection closed due to errors', err);
    
    res.end();
    }) 
})


app.listen(8000, "127.0.0.1", ()=>{
    console.log("Listening the port...8000!!")
});
