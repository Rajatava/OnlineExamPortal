const { paperSetterLogin } = require('../models/paperSetter.model');
const model = require('../models/paperSetter.model')

const paperSetterController = {
    async signup (req, res){
        const result = await model.createPaperSetter(req.body.name, req.body.email,req.body.userId);
        res.json(result)
    },
    async login (req, res){
        const result = await model.paperSetterLogin(req.body.email);
        res.json(result)
    },
    async getResponse (req, res){
        //const result = await model.createPaperSetter(req.body.name, req.body.email,req.body.userId);
        res.json({result : `getResponse`})
    },
    async getMarks (req, res){
        //const result = await model.createPaperSetter(req.body.name, req.body.email,req.body.userId);
        res.json({result : `getMarks`})
    },
    async setMarks (req, res){
        //const result = await model.createPaperSetter(req.body.name, req.body.email,req.body.userId);
        res.json({result : `setMarks`})
    }
}

module.exports = paperSetterController;