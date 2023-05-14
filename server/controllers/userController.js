const bcrypt = require("bcrypt")
const session = require('express-session')
const jwt = require('jsonwebtoken')

let message = require('../models/Message')
const User = require("../models/User")
const token = require('../token/token')

exports.createUser = async (req, res) => {
  try{
    const user = new User(req.body.firstName, req.body.lastName, req.body.number, req.body.password, req.body.email);
    res.json({success: 1, id: await user.create()});
  }catch(err) {res.json({success: 0, error: err})}
}

exports.login = async (req, res) => {
  try{
    let access = jwt.sign(req.body.login, token.tokens.main)
    let refresh = jwt.sign(req.body.login, token.tokens.refresh)
    let user = await User.login(req.body.login, req.body.password);
    if (user.status != 0) {
      req.session.userId = user.id;
      req.session.name = user.name;
      req.session.login = user.email
      req.session.avatar = user.avatar;
      req.session.select = user.select;
      req.session.permission = user.permission;
      req.session.agency = user.agency;
      res.cookie('access', access)
      res.cookie('refresh', refresh)
      if (req.body.remember != '') {
        let token = bcrypt.hashSync(`${user.id}${Date.now()}`, 10);
        res.cookie('remember', token, 
          { maxAge: 1000 * 60 * 60 * 24 * 15, httpOnly: true });
        User.setToken(user.id, token);
      }
      else {
        User.setToken(user.id, '');
        res.clearCookie('remember');
      }
    } 
    res.json({status: user.status, user: user});
  }catch(e){res.sendStatus(400)}
}

exports.auth = async (req, res) => {
  try{
    if (req.cookies['remember']) {
      let user = await User.loginAuth(req.cookies['remember']);
      req.session.userId = user.id;
      req.session.name = user.name;
      req.session.login = user.email
      req.session.avatar = user.avatar;
      req.session.select = user.select;
      req.session.permission = user.permission;
      req.session.agency = user.agency;
    }
    if (req.session.userId) {
      let refresh = jwt.sign(req.session.login, token.tokens.refresh)
      res.cookie('refresh', refresh)
        res.json({
          id: req.session.userId,
          name: req.session.name,
          avatar: req.session.avatar,
          select: req.session.select,
          permission: req.session.permission,
          agency: req.session.agency
        });
        return;
    }
  }catch(e){res.sendStatus(400)}
    res.sendStatus(400);
}

exports.addSelect = async (req, res) => {
  try{
    User.setSelect(req.body.user, req.body.select);
    res.json({success: 1});
  }catch(e){res.sendStatus(400)}
}

exports.permission = (req, res) => {
  try{
    User.setPermission(req.session.userId, req.body.permission);
    res.json({success: 1})
  }catch(e){res.sendStatus(400)}
}

exports.getInfo = async (req, res) => {
  try{
    let user = await User.getInfo(req.session.userId);
    res.json(user);
  }catch(e){res.sendStatus(400)}
}

exports.logout = async (req, res) => {
  if (!req.session.userId) {
    res.sendStatus(400)
    return
  }
  try{
  User.setToken(req.session.userId, '');
  req.session.destroy();
  res.cookie('access', '')
  res.cookie('refresh', '')
  res.json({success: 1})
  }catch(e) {res.sendStatus(400)}
}

exports.getRealtorInfo = async (req, res) => {
  try{
    res.json(await User.getRealtor(req.query.id));
  }catch(e){res.sendStatus(400)}
}

exports.updateUser = async (req, res) => {
  const {
    body: {id, avatar, name, region, city, description, phone, email, surname, oldAvatar, defaultAvatar}
  } = req;
  try{
    if (!id || !name || !region || !city || !phone || !email || !surname || phone.length < 10 || !/^\S+@\S+\.\S+$/.test(email)) {res.sendStatus(400); return}
    User.updateUser(id, name, surname, phone, email, avatar, region, city, description, oldAvatar, defaultAvatar);
    req.session.name = `${name} ${surname}`
    req.session.avatar = avatar
    res.json({success: 1})
  }catch(e){res.sendStatus(400)}
}

exports.getCards = async (req, res) => {
  if (!req.session.userId) {res.sendStatus(400); return}
  try{
    res.json(await User.getCards(req.session.userId));
  }catch(e){res.sendStatus(400)}
}

exports.checkCode = async (req, res) => {
  try{
    res.json({success: req.body.code === req.session.code})
  }catch(e){res.sendStatus(400)}
}

exports.cancel = async (req, res) => {
  try{
    req.session.code = '';
    res.json({success: 1})
  }catch(e) {res.sendStatus(500)}
}

exports.change = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.session.userId) {res.sendStatus(400); return}
  try{
    req.session.code = '';
    if (req.body.email) {
      User.changePass(req.body.email, req.body.password);
    }
    else {
      User.change(req.session.userId, req.body.password);
    }
    res.json({success: 1})
  }catch(e){res.sendStatus(400)}
}

exports.leave = async (req, res) => {
  if (!req.session.userId || !req.body.agency) {res.sendStatus(400); return}
  try{
    User.leave(req.session.userId);
    let users = await User.getRealtors(req.body.agency)
    message.createMulti(users, `Рієлтор ${req.body.name}, вийшов з агентства`, req.session.userId)
    req.session.agency = 0
    req.session.permission = 0
    res.json({success: 1})
  }catch(e){res.sendStatus(400)}
} 

exports.getMessages = async (req, res) => {
    if (!req.session.userId) {res.sendStatus(400); return}
    try{
      res.json(await User.getMessage(req.session.userId))
    }catch(e){res.sendStatus(400)}
}

exports.deleteMessage = async (req, res) => {
  try{
    message.delete(req.body.message)
    res.json({success: 1})
  }catch(e){res.sendStatus(500)}
}

exports.reject = (req, res) => {
  try{
    message.reject(req.body.message)
    res.json({success: 1})
  }catch(e){res.sendStatus(500)}
}

exports.accept = async (req, res) => {
  if (!req.body.agency || req.session.userId) {res.sendStatus(400); return}
  try {
    let users = await User.getRealtors(req.body.agency)
    message.createMulti(users, `Користувач ${req.body.name}, приєднався до агентства`, req.session.userId)
    User.accept(req.session.userId, req.body.agency)
    message.accept(req.body.message)
    req.session.permission = 1
    req.session.agency = req.body.agency
    res.json({success: 1})
  }catch(e){res.sendStatus(400)}
}

exports.find = async (req, res) => {
  if (!req.body.phone) {res.sendStatus(400); return}
  try{
    res.json(await User.find(req.body.phone))
  }catch(e){res.sendStatus(400); return}
}

exports.hasNew = async (req, res) => {
  if (!req.session.userId) {res.sendStatus(400); return}
  try{
    res.json(await User.hasNew(req.session.userId))
  }catch(e){res.sendStatus(400); return}
}

exports.hasNewMessages = async (req, res) => {
  if (!req.session.userId) {res.sendStatus(400); return}
  try{
    res.json(await User.hasNewMessages(req.session.userId))
  }catch(e){res.sendStatus(400); return}
}

exports.setReadMessages = (req, res) => {
  if (!req.session.userId) {res.sendStatus(400); return}
  try{
    User.setRead(req.session.userId)
    res.sendStatus(200)
  }catch(e){res.sendStatus(400); return}
}