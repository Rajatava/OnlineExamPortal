const model = require('../models/paper.model')

const paperController = {

    async setPaper (req, res){
        const result = await model.setPaper(req.body.paperSetterId, req.body.paperName,req.body.startTime,req.body.endTime, req.body.timeLimit, req.body.defaultMarks ,req.body.isPublic );
        res.json(result);
    },
    async addQna (req, res){
        const result = await model.addQna(req.body.paperId, req.body.question, req.body.options,req.body.correctOptions);
        res.json(result);
    },
    async updateQna (req, res){
        const result = await model.updateQna(req.body.paperId, req.body.questionId, req.body.question, req.body.options,req.body.correctOptions);
        res.json(result);
    },
    async dropQna (req, res){
        const result = await model.dropQna(req.body.paperId, req.body.questionId);
        res.json(result);
    },
    async dropPaper (req, res){
        const result = await model.dropPaper(req.body.paperId, req.body.paperSetterId);
        res.json(result);
    },
    async getPapers (req, res){
        const result = await model.getPapers(req.body.studentId, req.body.startTimeLLimit, req.body.startTimeULimit);
        res.json(result);
    },
    async addStudents (req, res){
        const result = await model.addStudents(req.body.paperId, req.body.paperSetterId, req.body.studentIds);
        res.json(result);
    }
}

module.exports = paperController;

/*multipart/form-data; boundary=<calculated when request is sent></calculated>*/