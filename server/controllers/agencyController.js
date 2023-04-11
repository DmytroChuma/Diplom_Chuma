let Agency = require("../models/Agency");
let User = require("../models/User")

exports.create = async (req, res) => {
    const {
        body: {file, name, region, city, description, phones, emails, user}
    } = req;
    let agency = new Agency(file, name, region, city, description, phones, emails, user);
    let id = await agency.create();
    User.setAgency(user, id);
    res.json({success: 1, id: id})
}

exports.getInfo = async (req, res) => {
    let agency = await Agency.getInfo(req.query.id)
    res.json(agency);
}

exports.realtors = async (req, res) => {
    res.json(await User.getRealtors(req.query.agency));
}