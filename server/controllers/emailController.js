const email = require('../handlers/Email')

exports.send = async (req, res) => {
   try{
      let result = (await email.send(req.body.to, req.body.subject, req.body.text))
      res.json({status: result});
   }catch(e){res.sendStatus(500)}
}

function generateCode () {
   let code = ''
   for (let i = 0; i < 6; i++){
      code += Math.ceil(Math.random() * 9)
   }
   return code;
}

exports.sendCode = async (req, res) => {
   try{
      let code = generateCode();
      req.session.code = code;
      let result = (await email.send(req.body.email, 'Підтвердження операції', `
      <div style="background: #00335e; text-align: center; color: white; font-size: 24px;">
         Код підтвердження операції зміни паролю
      </div>
      <div style="padding: 20px; text-align: center; font-size:30px; color: #00335e">
         ${code}
      </div>
      `))
      res.json({success: result});
   }catch(e){res.sendStatus(500)}
}