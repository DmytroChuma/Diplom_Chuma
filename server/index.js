const express = require("express");
var fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const con = require("./config/db_connector");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");

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
 
app.set('trust proxy', 1)  
 
app.use(cookieParser(SESSION_KEY));

app.use(
  session({ 
    secret: SESSION_KEY, 
    resave: true, 
    saveUninitialized: true }) 
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(cors({ credentials: true, origin: "house-f621.onrender.com" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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
    origin: "house-f621.onrender.com",
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

app.get("/search", advertisementController.getAllAdvertisements);

app.get("/region/:reg", realtyController.loadRegion);

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

app.post("/add_view", advertisementController.addView);

app.post("/add_phone", advertisementController.addPhone);

app.post("/add_select", advertisementController.addSelect);

//USER

app.get("/auth", userController.auth);

app.get("/new_chat", userController.hasNew);

app.get("/new_messages", userController.hasNewMessages);

app.get("/set_messages_read", userController.setReadMessages);

app.get("/logout", userController.logout);

app.get("/user_info", userController.getInfo);

app.get("/get_realtor_info", userController.getRealtorInfo);

app.get("/user_cards_info", userController.getCards);

app.get("/cancel", userController.cancel);

app.get("/get_user_messages", userController.getMessages);

app.post("/find_user", userController.find);

app.post("/delete_message", authentiphicateToken, userController.deleteMessage);

app.post("/leave_agency", authentiphicateToken, userController.leave);

app.post("/permission", userController.permission);

app.post("/add_user", userController.createUser);

app.post("/update_user", authentiphicateToken, userController.updateUser);

app.post("/login", userController.login);

app.post("/add_select_user", userController.addSelect);

app.post("/check_code", userController.checkCode);

app.post("/change_password", userController.change);

app.post("/reject", authentiphicateToken, userController.reject);

app.post("/accept", authentiphicateToken, userController.accept);

//AGENCY

app.get("/get_agency_info", agencyController.getInfo);

app.get("/get_realtors", agencyController.realtors);

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
