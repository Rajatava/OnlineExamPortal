const model = require('../models/exam.model');

const examController = {
    async startExam (req, res){
        const result = await model.startExam(req.body.paperId,req.body.studentId,req.body.examId);
        res.json(result)
    },
    async saveAns (req, res){
        const result = await model.saveAns(req.body.studentId, req.body.examId, req.body.questionId, req.body.chosenOptions);
        res.json(result)
    },
    async endExam (req, res){
        const result = await model.submitExam(req.body.examId,req.body.studentId);
        res.json(result)
    },
}

module.exports = examController;