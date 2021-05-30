const model = require('../models/student.model')

const studentController = {
    async signup (req, res){
        const result = await model.createStudent(req.body.name, req.body.email,req.body.userId);
        res.json(result)
    },
    async getMarks (req, res){
        //const result = await model.createPaperSetter(req.body.name, req.body.email,req.body.userId);
        res.json({result : `Marks`})
    }
}

module.exports = studentController;