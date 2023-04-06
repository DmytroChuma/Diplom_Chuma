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
      req.session.select = user.select_post;
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
    res.json({status: user.status});
}

exports.auth = async (req, res) => {
    if (req.cookies['remember']) {
      let user = await User.loginAuth(req.cookies['remember']);
      req.session.userId = user.id;
      req.session.name = user.name;
      req.session.avatar = user.avatar;
      req.session.select = user.select;
    }
    if (req.session.userId) {
        res.json({
          id: req.session.userId,
          name: req.session.name,
          avatar: req.session.avatar,
          select: req.session.select
        });
        return;
    }
    res.json('');
}

exports.addSelect = async (req, res) => {
  User.setSelect(req.body.user, req.body.select);
  res.json({success: 1});
}