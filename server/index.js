const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const upload = require("./upload")
const multer = require("multer")
const fs = require('fs');
const path = require('path');
request = require('request')
const con = require('./config/db_connector');

const PORT = process.env.PORT || 3001;

const app = express();

//app.use(express.static(__dirname + '/data'));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let cours;
request(
  'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5',
  (err, res, body) => {
    cours = body;
  }
)


/*let mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "house",
    password: ""
  });*/
  //con.connect();


/*function getRes(sql){

  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(JSON.parse(JSON.stringify(result)));
      }
    });
  });


  
}*/

function createHouseArray(rows){
  let houses = [];
  for (let i = 0; i < rows.length; i++) {

    let images = [];

    let files = fs.readdirSync("./public/" + rows[i].id);

    files.forEach(file => {
      images.push(path.parse(file).name + path.extname(file));
    });

    let date = new Date(Date.parse(rows[i].date));
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedDate = dd + '.' + mm + '.' + yyyy;

    let house = {
      id: rows[i].id,
      street: rows[i].street,
      city: rows[i].city,
      price: rows[i].price,
      priceinua: JSON.parse(cours)[1].sale * rows[i].price,
      square: rows[i].square,
      description: rows[i].description,
      date: formattedDate,
      images: images,
      tags: [rows[i].realtyType, rows[i].type, rows[i].auction == 1 ? "Торг" : ""],
      slug: rows[i].slug
    }
   
    houses.push(house);
  }
  return houses;

}

app.get("/area", async (req, res) => {
  let rows = await con.execute("SELECT '1' as type, name  FROM soil UNION SELECT '2' as type, name FROM relief");//getRes("SELECT '1' as type, name  FROM soil UNION SELECT '2' as type, name FROM relief");
  let soil = [];
  let relief = [];
  rows.forEach(row => {
    switch(row.type){
      case '1':
        soil.push(row.name);
        break;
      case '2':
        relief.push(row.name);
        break;
    }
  });
  res.json(JSON.stringify({
    soil: soil,
    relief: relief}));
});

app.get("/garage", async (req, res) => {
  let rows = await con.execute("SELECT '1' as type, name  FROM garage_wall UNION SELECT '2' as type, name FROM garage_roof UNION SELECT '3' as type, name FROM realty_state UNION SELECT '4' as type, name FROM communication UNION SELECT '5' as type, name FROM garage_type UNION SELECT '6' as type, name FROM garage_floor");
  let walls = [];
  let roof = [];
  let floor = [];
  let type = [];
  let state = [];
  let comm = [];
  rows.forEach(row => {
    switch(row.type){
      case '1':
        walls.push(row.name);
        break;
      case '2':
        roof.push(row.name);
        break;
      case '3':
        state.push(row.name);
        break;
      case '4':
        comm.push(row.name);
        break;
      case '5':
        type.push(row.name);
        break;
      case '6':
        floor.push(row.name);
        break;
    }
  });
  res.json(JSON.stringify({wall: walls,
                          roof: roof,
                          state: state,
                          comm: comm,
                          floor: floor,
                          type: type}));
});

app.get("/house", async (req, res) => {
  let rows = await con.execute("SELECT '1' as type, name  FROM wall_type UNION SELECT '2' as type, name FROM roof UNION SELECT '3' as type, name FROM realty_state UNION SELECT '4' as type, name FROM communication");
  let walls = [];
  let roof = [];
  let state = [];
  let comm = [];
  rows.forEach(row => {
    switch(row.type){
      case '1':
        walls.push(row.name);
        break;
      case '2':
        roof.push(row.name);
        break;
      case '3':
        state.push(row.name);
        break;
      case '4':
        comm.push(row.name);
        break;
    }
  })

  res.json(JSON.stringify({wall: walls,
            roof: roof,
            state: state,
            comm: comm}));
});

app.get("/search", async (req, res) => {

  let rows = await con.execute("SELECT * FROM house ORDER BY date DESC");
 
  let houses = createHouseArray(rows);

  res.json(houses);

});

app.get("/search/:sort", async (req, res) => {

  let sort = 'ORDER BY date DESC';

  if (req.params.sort.substring(1) == "Найдорожчі"){
    sort = 'ORDER BY price DESC'
  }
  else if (req.params.sort.substring(1) == "Найдешевші") {
    sort = 'ORDER BY price ASC'
  }

  let rows = await con.execute("SELECT * FROM house " + sort);
 
  let houses = createHouseArray(rows);

  res.json(houses);

});

app.get('/region/:reg', async (req, res) => {
  let rows = await con.execute("SELECT city FROM region WHERE region ='"+req.params.reg.substring(1)+"'");
  //console.log(rows);
  res.json({cities: rows[0].city.split(",")});
});

app.get('/advertisement/:slug', async function (req, res){
  //console.log(req.params.slug);
  let rows = await con.execute("SELECT * FROM house WHERE slug ='"+req.params.slug+"'");
  let houses = createHouseArray(rows);

  res.json(houses);
  //res.json({message: req.params.slug});
});

app.post('/form',(req, res) => {
  let data =  req.body;
  console.log("req: " + JSON.stringify(data));
  res.json({message: "response"})
});

app.post('/delete_file', function (req, res) {
  fs.unlinkSync('./public/' + req.body.file);
  console.log(req.body.file);
});


//upload.single("file")  upload.array("file", 'count')
app.post("/upload_file", upload.single("file"), function (req, res) {
//  console.log(req.file);
  if (!req.file) {
    //If the file is not uploaded, then throw custom error with message: FILE_MISSING
   // throw Error("FILE_MISSING")
   console.log('error');
   res.send({ status: "error" })
  } else {
    //If the file is uploaded, then send a success response.
    res.json({ status: "success",
               path: req.file.path});
  }
})

app.post("/save_advertisement", function (req, res) {
  console.log(req.body);
});

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

