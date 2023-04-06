const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const multer = require("multer")
const path = require('path');
request = require('request')
const cookieParser = require('cookie-parser');
const session = require('express-session');

const config = require('./config/config');
const upload = require("./upload")

//CONTROLLERS

const userController = require('./controllers/userController');
const advertisementController = require('./controllers/advertisementController');
const realtyController = require('./controllers/realtyController');
const fileController = require('./controllers/fileController');
const emailController = require('./controllers/emailController');
const chatController = require('./controllers/chatController')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  session(
    {secret: config.secret_key, 
    resave: true, 
    saveUninitialized: true}
  )
);

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
//const io = require('socket.io')(server);

const socketIo = require('socket.io')
const io = socketIo(server,{ 
  cors: {
    origin: 'http://localhost:3000'
  }
})  
io.on('connection',(socket)=>{
console.log('client connected: ',socket.id)

socket.on('leave_room', (room) => socket.leave(room))
socket.on('join_room', (room) => socket.join(room))
//console.log(socket.rooms);
socket.on('disconnect',(reason)=>{
  console.log(reason)
})

socket.on('send_message', (data) => {
  io.to(data.inbox).emit('receive_message', {message: data.message, date: data.date, avatar: data.avatar, user_id: data.user_id});
})

})
 



//ADVERTISEMENT

app.get("/area", realtyController.loadAreaInfo);

app.get("/garage", realtyController.loadGarageInfo);

app.get("/house", realtyController.loadHouseInfo);

app.get("/search", advertisementController.getAllAdvertisements);

app.get('/region/:reg', realtyController.loadRegion);

app.get('/advertisement/:slug', advertisementController.loadAdvertisement);

app.post("/save_advertisement", advertisementController.createAdvertisement);

app.post("/archive", advertisementController.addToArchive);

app.post("/delete_post", advertisementController.deletePost);

app.post("/option", advertisementController.option);

app.post("/show", advertisementController.publicate);

//USER

app.get('/auth', userController.auth);

app.post("/add_user", userController.createUser);

app.post("/login", userController.login);

//CHAT

app.get('/chat', chatController.getChats);

app.get('/messages', chatController.getMessages);

//EMAIL

app.post('/email', emailController.send);

//FILE

app.post('/delete_file', fileController.deleteFile);

app.post("/upload_file", upload.single("file"), fileController.uploadFile)


