let Chat = require("../models/Chat");

exports.createInbox = async (req, res) => {
   res.json({inbox: await Chat.generateInboxRoom(req.session.userId, req.body.id)})
}

exports.getChats = async (req, res) => {
    let result = await Chat.getChats(req.session.userId);
    res.json(result);
}

exports.getMessages = async (req, res) => {
    let result = await Chat.getMessages(req.query.inbox);
    res.json(result);
}

exports.files = (req, res) => {
    const fs = require('fs');
    req.body.files.forEach(element => {
        fs.rename('./public/'+element, `./public/files/${element.split('/')[1]}`, function (err) {
            if (err) throw err
        })
    });
    res.json(1)
}