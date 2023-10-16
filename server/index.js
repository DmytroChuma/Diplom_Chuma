const express = require("express");
var fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const con = require("./config/db_connector");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");


const swaggerAutogen = require('swagger-autogen')();





const { PORT, SESSION_KEY } = require("./config/config");
const upload = require("./upload");

//CONTROLLERS

const userController = require("./controllers/userController");
const advertisementController = require("./controllers/advertisementController");
const realtyController = require("./controllers/realtyController");
const fileController = require("./controllers/fileController");
const emailController = require("./controllers/emailController");
const chatController = require("./controllers/chatController");
const agencyController = require("./controllers/agencyController");
const tokens = require("./token/token");
const Chat = require("./models/Chat");

if (!fs.existsSync("./public/images")) {
  fs.mkdirSync("./public/images");
}

if (!fs.existsSync("./public/uploads")) {
  fs.mkdirSync("./public/uploads");
}

if (!fs.existsSync("./public/users")) {
  fs.mkdirSync("./public/users");
}

if (!fs.existsSync("./public/images/agency")) {
  fs.mkdirSync("./public/images/agency");
}

if (!fs.existsSync("./public/files")) {
  fs.mkdirSync("./public/files");
}


const app = express();

app.use(
  session({ secret: SESSION_KEY, resave: true, saveUninitialized: true })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());




/*const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require('./swagger.json');
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Customer API",
      description: "Customer API Information",
      contact: {
        name: "Amazing Developer"
      },
      servers: ["http://localhost:3001"]
    }
  },
  // ['.routes/*.js']
  apis: ["index.js"]
};

const swaggerDocument = require('./swagger.json');
var options = {
  swaggerOptions: {
      url: "/api-docs/swagger.json",
  },
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serveFiles(null, options), swaggerUi.setup(null, options));
*/

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Diploma API',
      version: '1.0.0',
      description: 'API Description',
      servers: ["http://localhost:3001"],
    },
    definitions:{
      User: {
        properties:{
          user:{
            id: '1',
            name: 'test'
          }
        }
      }
    },
    securityDefinitions: {
      BasicAuth: 'basic'
    },
    externalDocs: {                 
      description: "swagger.json",  
      url: "swagger.json"        
    }, 
  },
  apis: ['index.js'],  
};

const swaggerSpec = swaggerJSDoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
    console.log(JSON.stringify(swaggerSpec))
  });




async function authentiphicateToken(req, res, next) {
  if (req.originalUrl.split("/")[1] === "editor") {
    let result = await con.execute(
      `SELECT user FROM info WHERE slug = '${req.params.slug}'`
    );
    if (result.length === 0) {
      res.sendStatus(404);
      return;
    }

    if (req.session.userId !== result[0].user) {
      res.sendStatus(403);
      return;
    }
  }
  const token = req.cookies["access"];
  token === null
    ? res.sendStatus(401)
    : jwt.verify(token, tokens.tokens.main, (err) => {
        if (err) {
          jwt.verify(token, tokens.tokens.refresh, (err) => {
            if (err) {
              res.sendStatus(403);
            } else {
              next();
            }
          });
        } else {
          next();
        }
      });
}

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const socketIo = require("socket.io");
const { createGunzip } = require("zlib");
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.on("leave_room", (room) => socket.leave(room));
  socket.on("join_room", (room) => socket.join(room));
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });

  socket.on("send_message", async (data) => {
    let id = await Chat.createMessage(
      data.user_id,
      data.message,
      data.inbox,
      data.answear,
      JSON.stringify(data.file)
    );
    io.to(`inbox_${data.inbox}`).emit(`inbox_${data.inbox}`, {
      message: data.file !== "" ? "Файлове повідомлення" : data.message,
      date: data.date,
    });
    io.to(data.inbox).emit("receive_message", {
      message: data.message,
      date: data.date,
      avatar: data.avatar,
      user_id: data.user_id,
      id: id,
      answear: data.answear,
      a_message: data.a_message,
      file: data.file,
    });
  });

  socket.on("delete_message", (data) => {
    Chat.deleteMessage(data.id, data.file);
    io.to(data.inbox).emit("delete_message", {
      id: data.id,
      inbox: data.inbox,
    });
  });

  socket.on("last_mess", (data) => {
    io.to(`inbox_${data.inbox}`).emit(`inbox_${data.inbox}`, {
      message: data.message,
      date: data.date,
    });
  });

  socket.on("edit_message", (data) => {
    Chat.updateMessage(data.message, data.id);
    io.to(data.inbox).emit("edit_message", {
      id: data.id,
      message: data.message,
    });
    if (data.last) {
      io.to(`inbox_${data.inbox}`).emit(`inbox_${data.inbox}`, {
        message: data.message,
        date: null,
      });
    }
  });

  socket.on("del_realtor", (data) => {
    io.to(data.realtor).emit("leave_agency", data.agency);
    io.to(data.realtor).emit("exit");
  });

  socket.on("leave_agency", (data) => {
    io.to(data).emit("leave_agency", data);
  });

  socket.on("message_body", (data) => {
    io.to(data.agency).emit("message_body", { text: data.text });
  });

  socket.on("invite", (data) => {
    io.to(data.id).emit("message_body", { text: data.text });
  });
});

//ADVERTISEMENT

app.get("/area", realtyController.loadAreaInfo);

app.get("/garage", realtyController.loadGarageInfo);

app.get("/house", realtyController.loadHouseInfo);

/**
 * @swagger
 * /search:
 *  get:
 *    tags: 
 *      - Advertisements
 *    description: "Використовується для пошуку оголошень"
 *    parameters:
 *      - in: query
 *        name: advertisement
 *        required: false
 *        schema:
 *           type: string
 *           default: "Продаж"
 *        description: 'Тип оголошення'
 *      - in: query
 *        name: realty
 *        required: false
 *        schema:
 *           type: string
 *           default: "Вся нерухомість"
 *        description: 'Тип нерухомості'
 *      - in: query
 *        name: sort
 *        required: false
 *        schema:
 *           type: string
 *           default: "Спочатку нові"
 *        description: 'Тип сортування'
 *      - in: query
 *        name: region
 *        required: false
 *        schema:
 *           type: string
 *           default: ""
 *        description: 'Область'
 *      - in: query
 *        name: city
 *        required: false
 *        schema:
 *           type: string
 *           default: ""
 *        description: 'Місто'
 *      - in: query
 *        name: currency
 *        required: false
 *        schema:
 *           type: string
 *           default: "$"
 *        description: 'Валюта'
 *      - in: query
 *        name: pricemin
 *        required: false
 *        schema:
 *           type: integer
 *           default: ""
 *        description: 'Мінімальна ціна'
 *      - in: query
 *        name: pricemax
 *        required: false
 *        schema:
 *           type: integer
 *           default: ""
 *        description: 'Максимальна ціна'
 *      - in: query
 *        name: unit
 *        required: false
 *        schema:
 *           type: string
 *           default: "Сотка"
 *        description: 'Одиниця вимірювання'
 *      - in: query
 *        name: squaremin
 *        required: false
 *        schema:
 *           type: integer
 *           default: ""
 *        description: 'Мінімальна площа'
 *      - in: query
 *        name: squaremax
 *        required: false
 *        schema:
 *           type: integer
 *           default: ""
 *        description: 'Максимальна площа'
 *      - in: query
 *        name: proposition
 *        required: false
 *        schema:
 *           type: string
 *           default: "Всі варіанти"
 *        description: 'Тип пропозиції'
 *      - in: query
 *        name: map
 *        required: false
 *        schema:
 *           type: string
 *           default: "Всі варіанти"
 *        description: 'Позначено на мапі'
 *      - in: query
 *        name: auction
 *        required: false
 *        schema:
 *           type: string
 *           default: "Всі варіанти"
 *        description: 'Торг'
 *      - in: query
 *        name: type
 *        required: false
 *        schema:
 *           type: string
 *           default: "Всі варіанти"
 *        description: 'Тип житла (новобудова, вторинне)'
 *      - in: query
 *        name: houseType
 *        required: false
 *        schema:
 *           type: array
 *           default: [Окремий будинок, Дуплекс, Таунхаус]
 *        description: 'Тип будинку'
 *      - in: query
 *        name: wall
 *        required: false
 *        schema:
 *           type: array
 *           default: [Цегла, Дерево, Дерево та цегла]
 *        description: 'Стіна'
 *      - in: query
 *        name: roof
 *        required: false
 *        schema:
 *           type: array
 *           default: [Шифер, Металеві листи, Металошифер]
 *        description: 'Дах'
 *      - in: query
 *        name: heating
 *        required: false
 *        schema:
 *           type: array
 *           default: [Централізоване, Комбіноване, Індивідуальне]
 *        description: 'Опалення'
 *      - in: query
 *        name: plan
 *        required: false
 *        schema:
 *           type: array
 *           default: [Чорнова штукартурка, Без меблів]
 *        description: 'Планування'
 *      - in: query
 *        name: advantages
 *        required: false
 *        schema:
 *           type: array
 *           default: [Гараж, Камін, Балкон]
 *        description: 'Переваги'
 *      - in: query
 *        name: state
 *        required: false
 *        schema:
 *           type: array
 *           default: [Відмінний, Нормальний, Задовільний, Потребує ремонту]
 *        description: 'Стан будинку / квартири'
 *      - in: query
 *        name: page
 *        required: false
 *        schema:
 *           type: integer
 *           default: "1"
 *        description: 'Сторінка'
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '404':
 *        description: "Not found"
 */

app.get("/search", advertisementController.getAllAdvertisements);

/**
 * @swagger
 * /region/{reg}:
 *  get:
 *    tags: 
 *      - Advertisements
 *    description: "Використовується для отримання інформації про область"
 *    parameters:
 *      - in: path
 *        name: reg
 *        required: true
 *        schema:
 *           type: string
 *           default: ":Закарпатська область"
 *        description: 'Назва області'
 *    responses:
 *      '200':
 *        description: "A successful response"
 */

app.get("/region/:reg", realtyController.loadRegion);

/**
 * @swagger
 * /advertisement/{slug}:
 *  get:
 *    tags: 
 *      - Advertisements
 *    description: "Використовується для отримання інформації про оголошення"
 *    parameters:
 *      - in: path
 *        name: slug
 *        required: true
 *        schema:
 *           type: string
 *           default: "budynok-prodazh-provulok-vesnyanyy-vinnytsya"
 *        description: 'Назва оголошення'
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '404':
 *        description: 'This Advertisement not found'
 */

app.get("/advertisement/:slug", advertisementController.loadAdvertisement);

app.get(
  "/editor/:slug",
  authentiphicateToken,
  advertisementController.loadAdvertisementForEditor
);

app.post("/save_advertisement", advertisementController.createAdvertisement);

app.post(
  "/update_advertisement",
  authentiphicateToken,
  advertisementController.updateAdvertisement
);

app.post(
  "/archive",
  authentiphicateToken,
  advertisementController.addToArchive
);

app.post(
  "/delete_post",
  authentiphicateToken,
  advertisementController.deletePost
);

app.post("/option", authentiphicateToken, advertisementController.option);

app.post("/show", authentiphicateToken, advertisementController.publicate);

/**
 * @swagger
 * /add_view:
 *  post:
 *    tags: 
 *      - Advertisements
 *    description: "Додавання перегляду оголошення"
 *    consumes:
 *      - text/plain
 *    parameters:
 *      - in: body
 *        name: id
 *        required: true
 *        schema:
 *           type: integer
 *    requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/View"
 *        required: true
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '400':
 *        description: "A bad request"
 */

app.post("/add_view", advertisementController.addView);

/**
 * @swagger
 * /add_phone:
 *  post:
 *    tags: 
 *      - Advertisements
 *    description: "Додавання перегляду телефона власника оголошення"
 *    consumes:
 *      - text/plain
 *    parameters:
 *      - in: body
 *        name: id
 *        required: true
 *        schema:
 *           type: integer
 *    requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/View"
 *        required: true
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '400':
 *        description: "A bad request"
 */

app.post("/add_phone", advertisementController.addPhone);

/**
 * @swagger
 * /add_select:
 *  post:
 *    tags: 
 *      - Advertisements
 *    description: "Лічильник додавань в обране"
 *    consumes:
 *      - text/plain
 *    parameters:
 *      - in: body
 *        name: id
 *        required: true
 *        schema:
 *           type: integer
 *      - in: body
 *        name: type
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Select"
 *        required: true
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '400':
 *        description: "A bad request"
 */

/**
 * @swagger
 * /area:
 *  get:
 *    tags: 
 *      - Realty Info
 *    description: "Використовується для отримання інформації про тип нерухомості"
 *    responses:
 *      '200':
 *        description: "A successful response"
 * /garage:
 *  get:
 *    tags: 
 *      - Realty Info
 *    description: "Використовується для отримання інформації про тип нерухомості"
 *    responses:
 *      '200':
 *        description: "A successful response"
 * /house:
 *  get:
 *    tags: 
 *      - Realty Info
 *    description: "Використовується для отримання інформації про тип нерухомості"
 *    responses:
 *      '200':
 *        description: "A successful response"
 */

app.post("/add_select", advertisementController.addSelect);

//USER

app.get("/auth", userController.auth);

app.get("/new_chat", userController.hasNew);

app.get("/new_messages", userController.hasNewMessages);

app.get("/set_messages_read", userController.setReadMessages);

app.get("/logout", userController.logout);

app.get("/user_info", userController.getInfo);

/**
 * @swagger
 * /get_realtor_info:
 *  get:
 *    tags: 
 *      - User
 *    description: "Використовується для отримання інформації про рієлтора"
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *           type: string
 *           default: "7"
 *        description: 'id рієлтора'
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '404':
 *        description: 'This Advertisement not found'
 */

app.get("/get_realtor_info", userController.getRealtorInfo);

app.get("/user_cards_info", userController.getCards);

app.get("/cancel", userController.cancel);

app.get("/get_user_messages", userController.getMessages);

/**
 * @swagger
 * /find_user:
 *  post:
 *    tags: 
 *      - User
 *    description: "Пошук користувача за номером телефону"
 *    consumes:
 *      - text/plain
 *    parameters:
 *      - in: body
 *        name: phone
 *        required: true
 *        schema:
 *           type: string
 *    requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phone:
 *                  description: user phone
 *                  type: string
 *              default: {}
 *              example:
 *                phone: "0951114488"
 *        required: true
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '400':
 *        description: "A bad request"
 */

app.post("/find_user", userController.find);

app.post("/delete_message", authentiphicateToken, userController.deleteMessage);

app.post("/leave_agency", authentiphicateToken, userController.leave);

app.post("/permission", userController.permission);

app.post("/add_user", userController.createUser);

app.post("/update_user", authentiphicateToken, userController.updateUser);

/**
 * @swagger
 * /login:
 *  post:
 *    tags: 
 *      - User
 *    description: "Логін"
 *    consumes:
 *      - text/plain
 *    parameters:
 *      - in: body
 *        name: login
 *        required: true
 *        schema:
 *          type: string
 *      - in: body
 *        name: password
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Login"
 *        required: true
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '400':
 *        description: "A bad request"
 */

app.post("/login", userController.login);

app.post("/add_select_user", userController.addSelect);

app.post("/check_code", userController.checkCode);

app.post("/change_password", userController.change);

app.post("/reject", authentiphicateToken, userController.reject);

app.post("/accept", authentiphicateToken, userController.accept);

//AGENCY

/**
 * @swagger
 * /get_agency_info:
 *  get:
 *    tags: 
 *      - Agency
 *    description: "Використовується для отримання інформації про агентство"
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *           type: string
 *           default: "13"
 *        description: 'id агентства'
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '404':
 *        description: 'This Advertisement not found'
 */

app.get("/get_agency_info", agencyController.getInfo);

/**
 * @swagger
 * /get_realtors:
 *  get:
 *    tags: 
 *      - Agency
 *    description: "Використовується для отримання інформації про рієлторів агентства"
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *           type: string
 *           default: "13"
 *        description: 'id агентства'
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '404':
 *        description: 'This Advertisement not found'
 */

app.get("/get_realtors", agencyController.realtors);

/**
 * @swagger
 * /getAgencies:
 *  get:
 *    tags: 
 *      - Agency
 *    description: "Використовується для отримання інформації про агентства"
 *    responses:
 *      '200':
 *        description: "A successful response"
 *      '404':
 *        description: 'This Advertisement not found'
 */

app.get("/getAgencies", agencyController.getAgencies);

app.get("/getAgenciesInfo", agencyController.getAgenciesInfo);

app.post("/del_realtor", agencyController.delRealtor);

app.post("/create_agency", upload.single("file"), agencyController.create);

app.post("/update_agency", authentiphicateToken, agencyController.update);

app.post("/delete_agency", authentiphicateToken, agencyController.delete);

app.post("/invite", agencyController.invite);

//CHAT

app.get("/chat", chatController.getChats);

app.get("/messages", chatController.getMessages);

app.post("/create_inbox", chatController.createInbox);

app.post("/save_files", chatController.files);

app.post("/set_read", chatController.setRead);

app.post("/set_read_message", chatController.setReadMessage);

//EMAIL

app.post("/email", emailController.send);

app.post("/send_code", emailController.sendCode);

//FILE

app.post("/delete_file", fileController.deleteFile);

app.post("/upload_file", upload.single("file"), fileController.uploadFile);


 



/*const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
//const endpointsFiles = ['endpointsUser.js', 'endpointsBook.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);*/


/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *      required:
 *      - "login"
 *      - "password"
 *      type: "object"
 *      properties:
 *        login:
 *          description: user login
 *          type: string
 *        password:
 *          description: user password
 *          type: string
 *      default: {}
 *      example: 
 *        login: "dimachuma1231@gmail.com"
 *        password: "123456"
 *     View:
 *      required:
 *      - "id"
 *      type: "object"
 *      properties:
 *        id:
 *          description: advertisement id
 *          type: integer
 *      default: {}
 *      example: 
 *        id: 88
 *     Select:
 *      required:
 *      - "id"
 *      - "type"
 *      type: "object"
 *      properties:
 *        id:
 *          description: advertisement id
 *          type: integer
 *        type:
 *          description: operation type
 *          type: integer
 *      default: {}
 *      example: 
 *        id: "88"
 *        type: "1"
 *     User:
 *      required:
 *      - "id"
 *      - "first_name"
 *      - "last_name"
 *      - "phone"
 *      - "email"
 *      - "avatar"
 *      type: "object"
 *      properties:
 *        id:
 *          description: user id
 *          type: integer
 *        first_name:
 *          description: user first name
 *          type: string
 *        last_name:
 *          description: user last name
 *          type: string
 *        phone:
 *          description: user phone
 *          type: string
 *        email:
 *          description: user email
 *          type: string
 *        avatar:
 *          description: user avatar
 *          type: string
 *      default: {}
 *      example: 
 *        id: "6"
 *        first_name: "Василь"
 *        last_name: "Карбованець"
 *        phone: 0992459546
 *        email: example@gmail.com
 *        avatar: default.jpg
 */



/*

 *     User:
 *      required:
 *      - "id"
 *      - "first_name"
 *      - "last_name"
 *      - "phone"
 *      - "email"
 *      - "avatar"
 *      type: "object"
 *      properties:
 *        id:
 *          description: user id
 *          type: integer
 *        first_name:
 *          description: user first name
 *          type: string
 *        last_name:
 *          description: user last name
 *          type: string
 *        phone:
 *          description: user phone
 *          type: string
 *       email:
 *          description: user email
 *          type: string
 *       avatar:
 *          description: user avatar
 *          type: string
 *      default: {}
 *      example: 
 *        id: "6"
 *        first_name: "Василь"
 *        last_name: "Карбованець"
 *        phone: 0992459546
 *        email: example@gmail.com
 *        avatar: default.jpg


*/