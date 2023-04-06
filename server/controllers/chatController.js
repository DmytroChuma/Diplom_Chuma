let Chat = require("../models/Chat");

exports.getChats = async (req, res) => {
    let result = await Chat.getChats(req.session.userId);
    res.json(result);
}

exports.getMessages = async (req, res) => {
    let result = await Chat.getMessages(req.query.inbox);
    res.json(result);
}