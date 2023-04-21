const e = require("express");
let Agency = require("../models/Agency");
let User = require("../models/User")
let message = require('../models/Message')
const email = require('../handlers/Email')

exports.create = async (req, res) => {
    const {
        body: {file, name, region, city, description, phones, emails, user}
    } = req;
    let agency = new Agency(file, name, region, city, description, phones, emails, user);
    let id = await agency.create();
    User.setAgency(user, id);
    req.session.agency = id
    req.session.permission = 2
    res.json({success: 1, id: id})
}

exports.getInfo = async (req, res) => {
    let agency = await Agency.getInfo(req.query.id)
    res.json(agency);
}

exports.realtors = async (req, res) => {
    res.json(await User.getRealtors(req.query.agency));
}

exports.update = async (req, res) => {
    const {
        body: {file, name, region, city, description, phones, emails, id, oldLogo}
    } = req;
    Agency.update(id, file, name, region, city, description, phones, emails, oldLogo)
    res.json({success: 1})
}

exports.delete = async (req, res) => {
    let users = await User.getRealtors(req.body.agency)
    message.createMulti(users, `Власник видалив агентство ${req.body.name}`, req.session.userId)
    Agency.delete(req.body.agency)
    User.deleteAgency(req.body.agency)
    req.session.agency = 0
    req.session.permission = 0
    res.json({success: 1})
}

exports.invite = async (req, res) => {
    let id = 0;
    let result = await User.getUserForInvite(req.body.user)
    if (result[0]) {
        id = result[0].id
        let agency = await User.checkUserInAgency(id)
        if (agency[0]){
            res.json({id: id, success: 0, text: 'Користувач вже приєднався до агентства'})
            return;
        }
        else {
            let invite = await User.checkInvite(id, req.body.agency)
            if (invite[0]){
                res.json({id: id, success: 0, text: 'Користувача вже запрошено'})
                return;
            }
            message.create(id, `Запрошення приєнатись до агентства: "${req.body.name}"`, req.body.agency)
            email.send(result[0].email, 'Запрошення до агентства', `
            <div style="background: #00335e; text-align: center; color: white; font-size: 24px;">
               Привіт ${result[0].first_name} ${result[0].last_name}!
            </div>
            <div style="align-items: center; padding: 20px; text-align: center; font-size:20px; color: #00335e; ">
               Вас було запрошено до агентства ${req.body.name}<br>
               Перейдіть за посиланням для детальнішої інформації<br><br>
               <a href='http://localhost:3000/user/cabinet/messages' style="text-decoration: none; font-size:20px; margin-top: 10px; border-radius:10px; color: white; padding: 10px; background: #00335e;">Перейти</a>
            </div>
            `)
        }
    }
    res.json({id: id, success: result[0] ? 1 : 0, text: ''})
}