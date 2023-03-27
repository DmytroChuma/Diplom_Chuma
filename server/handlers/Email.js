const nodemailer = require('nodemailer');

const transporter  = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'course2000@yahoo.com',
      pass: 'offxyceiktjbkchv'
    }
  });

  async function wrapedSendMail(mailOptions){
    return new Promise((resolve,reject)=>{
     

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("error is "+error);
        resolve(false);
        } 
    else {
        console.log('Email sent: ' + info.response);
        resolve(true);
        }
    });
    })
}

async function send (to, subject, text) {
    const mailOptions = {
        from: 'course2000@yahoo.com',
        to: to,
        subject: subject,
        text: text
    };
    
    let resp = await wrapedSendMail(mailOptions);
   
    return resp;
}

module.exports.send = send;