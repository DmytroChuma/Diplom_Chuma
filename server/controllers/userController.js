const bcrypt = require("bcrypt");
const session = require('express-session');

const User = require("../models/User");

exports.createUser = (req, res) => {
    const user = new User(req.body.firstName, req.body.lastName, req.body.number, req.body.password, req.body.email);
    user.create();
}


//access token

//refresh token

exports.login = async (req, res) => {
    let user = await User.login(req.body.login, req.body.password);
    if (user.status != 0) {
      req.session.userId = user.id;
      req.session.name = user.name;
      req.session.avatar = user.avatar;
      req.session.select = user.select;
      req.session.permission = user.permission;
      req.session.agency = user.agency;
      if (req.body.remember != '') {
        let token = bcrypt.hashSync(`${user.id}${Date.now()}`, 10);
        res.cookie('remember', token, 
          { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
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
      req.session.avatar = user.avatar;
      req.session.select = user.select;
      req.session.permission = user.permission;
      req.session.agency = user.agency;
    }
    if (req.session.userId) {
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
  res.json({success: 1})
}