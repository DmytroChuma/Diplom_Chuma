const email = require('../handlers/Email')

exports.send = async (req, res) => {
   let result = (await email.send(req.body.to, req.body.subject, req.body.text))
   res.json({status: result});
}