const fs = require('fs');

exports.deleteFile = (req, res) => {
    try{
        fs.unlinkSync('./public/' + req.body.file);
    }catch(e){res.sendStatus(400)}
}

exports.uploadFile = (req, res) => {
    try{
        if (!req.file) {
            res.send({ status: "error" })
        } else {
            res.json({ status: "success",
                    path: req.file.path});
        }
    }catch(e){res.sendStatus(400)}
}