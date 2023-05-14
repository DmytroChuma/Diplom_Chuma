let Chat = require("../models/Chat");

exports.createInbox = async (req, res) => {
   if (!req.session.userId || !req.body.id) {res.sendStatus(400); return}
   try{
        res.json({inbox: await Chat.generateInboxRoom(req.session.userId, req.body.id)})
   }catch(e){res.sendStatus(400)}
}

exports.getChats = async (req, res) => {
    try{
        let result = await Chat.getChats(req.session.userId);
        res.json(result);
    }catch(e){res.sendStatus(400)}
}

exports.getMessages = async (req, res) => {
    try{
        let result = await Chat.getMessages(req.query.inbox);
        res.json(result);
    }catch(e){res.sendStatus(400)}
}

exports.files = (req, res) => {
    try{
        const fs = require('fs');
        req.body.files.forEach(element => {
            fs.rename('./public/'+element, `./public/files/${element.split('/')[1]}`, function (err) {
                if (err) throw err
            })
        });
        res.sendStatus(200)
    }catch(e){res.sendStatus(400)}
}

exports.setRead = (req, res) => {
    try{
        Chat.setRead(req.session.userId, req.body.inbox)
        res.sendStatus(200)
    }catch(e){res.sendStatus(400)}
}

exports.setReadMessage = (req, res) => {
    try{
        Chat.setReadMessage(req.body.id)
        res.sendStatus(200)
    }catch(e){res.sendStatus(400)}
}