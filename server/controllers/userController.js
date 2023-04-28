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
}

exports.auth = async (req, res) => {
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
    res.json('');
}

exports.addSelect = async (req, res) => {
  User.setSelect(req.body.user, req.body.select);
  res.json({success: 1});
}

exports.permission = (req, res) => {
  User.setPermission(req.session.userId, req.body.permission);
  res.json({success: 1})
}

exports.getInfo = async (req, res) => {
  let user = await User.getInfo(req.session.userId);
  res.json(user);
}

exports.logout = async (req, res) => {
  User.setToken(req.session.userId, '');
  req.session.destroy();
  res.cookie('access', '')
  res.cookie('refresh', '')
  res.json({success: 1})
}

exports.getRealtorInfo = async (req, res) => {
  res.json(await User.getRealtor(req.query.id));
}

exports.updateUser = async (req, res) => {
  const {
    body: {id, avatar, name, region, city, description, phone, email, surname, oldAvatar, defaultAvatar}
  } = req;

  User.updateUser(id, name, surname, phone, email, avatar, region, city, description, oldAvatar, defaultAvatar);
  req.session.name = `${name} ${surname}`
  req.session.avatar = avatar
  res.json({success: 1})
}

exports.getCards = async (req, res) => {
  res.json(await User.getCards(req.session.userId));
}

exports.checkCode = async (req, res) => {
  res.json({success: req.body.code === req.session.code})
}

exports.cancel = async (req, res) => {
  req.session.code = '';
  res.json({success: 1})
}

exports.change = async (req, res) => {
  req.session.code = '';
  if (req.body.email) {
    User.changePass(req.body.email, req.body.password);
  }
  else {
    User.change(req.session.userId, req.body.password);
  }
  res.json({success: 1})
}

exports.leave = async (req, res) => {
  User.leave(req.session.userId);
  let users = await User.getRealtors(req.body.agency)
  message.createMulti(users, `Рієлтор ${req.body.name}, вийшов з агентства`, req.session.userId)
  req.session.agency = 0
  req.session.permission = 0
  res.json({success: 1})
} 

exports.getMessages = async (req, res) => {
    res.json(await User.getMessage(req.session.userId))
}

exports.deleteMessage = async (req, res) => {
  message.delete(req.body.message)
  res.json({success: 1})
}

exports.reject = (req, res) => {
  message.reject(req.body.message)
  res.json({success: 1})
}

exports.accept = async (req, res) => {
  let users = await User.getRealtors(req.body.agency)
  message.createMulti(users, `Користувач ${req.body.name}, приєднався до агентства`, req.session.userId)
  User.accept(req.session.userId, req.body.agency)
  message.accept(req.body.message)
  req.session.permission = 1
  req.session.agency = req.body.agency
  res.json({success: 1})
}

exports.find = async (req, res) => {
  res.json(await User.find(req.body.phone))
}

exports.hasNew = async (req, res) => {
  res.json(await User.hasNew(req.session.userId))
}

exports.hasNewMessages = async (req, res) => {
  res.json(await User.hasNewMessages(req.session.userId))
}

exports.setReadMessages = (req, res) => {
  User.setRead(req.session.userId)
  res.json(1)
}