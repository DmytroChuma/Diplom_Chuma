const fs = require('fs');

exports.deleteFile = (req, res) => {
    fs.unlinkSync('./public/' + req.body.file);
}

exports.uploadFile = (req, res) => {
    if (!req.file) {
        res.send({ status: "error" })
    } else {
        res.json({ status: "success",
                   path: req.file.path});
    }
}