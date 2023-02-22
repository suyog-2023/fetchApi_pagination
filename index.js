// import fetch from "node-fetch";
const axios = require('axios');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const execute = require('./connection');
const url = require('url')
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    var data = await execute(`select * from results`)
    var obj = { "home": data }
    res.render("home.ejs", obj);
});

app.get("/fetchData", async (req, res) => {
    for (i = 0; i <= 30; i++) {
        var data = await axios.get("https://randomuser.me/api/");
        var bd = data['data']['results'][0];
        var sql = `insert into results(id,gender,name_title,name_first,name_last,location_street_number,location_street_name,location_city,location_state,location_country,location_postcode,location_coordinates_latitude,location_coordinates_longitude,location_timezone_offset,location_timezone_description,email,login_uuid,login_username,login_password,login_salt,login_md5,login_sha1,login_sha256,dob_date,dob_age,phone,cell,id_name,id_value,picture_large,picture_medium,picture_thumbnail,nat) VALUES ('${bd.id}','${bd.gender}','${bd.name.title}','${bd.name.first}','${bd.name.last}','${bd.location.street.number}','${bd.location.street.name}','${bd.location.city}','${bd.location.state}','${bd.location.country}','${bd.location.postcode}','${bd.location.coordinates_latitude}','${bd.location.coordinates_longitude}','${bd.location.timezone.offset}','${bd.location.timezone.description}','${bd.email}','${bd.login.uuid}','${bd.login.username}','${bd.login.password}','${bd.login.salt}','${bd.login.md5}','${bd.login.sha1}','${bd.login.sha256}','${bd.dob.date}','${bd.dob.age}','${bd.phone}','${bd.cell}','${bd.id.name}','${bd.id.value}','${bd.picture.large}','${bd.picture.medium}','${bd.picture.thumbnail}','${bd.nat}')`
       


        var data = await execute(sql);
    }
    res.redirect("/");

});

app.get("/deleteData", (req, res) => {
    var sql = `DELETE FROM results`;
    execute(sql);
    res.redirect("/");
});

app.get("/user_detail_page", async (req, res) =>
{
    var page_no = 1;
    var urlData = url.parse(req.url, true).query
    var cond = ' 1 ';
    if (urlData.search)
    {
        var q = urlData.search;
        cond = `( name_first LIKE '%${q}%' OR location_country LIKE '%${q}%' OR email LIKE '%${q}%' OR dob_age LIKE '%${q}%' OR phone LIKE '%${q}%' )`;
    }
    if (urlData.page_no) {
        page_no = urlData.page_no;
    }
    else {
        page_no = 1;
    }
    var per_page = 10;
    var tt = await execute(`select count(*) as ttl from results`);
    var total_records = tt[0]['ttl']
    var total_pages = total_records / per_page;
    var start = page_no * per_page - 10;
    var data = await execute(`select * from results WHERE ${cond} LIMIT ${start},${per_page}`)
    var obj = { "home": data,page_no:page_no,total_pages:total_pages }
    res.render("user_detail_page.ejs",obj);
});

app.listen(1200, () => {
    console.log("sever is connected");
});
