const mongoose = require('mongoose');
const dblog = require('debug')('app:db'); 
const paperSetterModel = require('./paperSetter.model');

const timingSchema = new mongoose.Schema({
    startTime : { type : String, required : true }, // toISOString();
    endTime : { type: String, required : true }, //toISOString();
    timeLimit: { type: String, required : true },  //hh:mm
})

const optionSchema = new mongoose.Schema({
    no : String,
    picURL : String,
    statement : String
})

const questionSchema = new mongoose.Schema({
    picURL : String,
    statement : String,
    options : [optionSchema],
})

const answerSchema = new mongoose.Schema({
    questionId : mongoose.Schema.Types.ObjectId,
    correctOptions : [String],
    /*explanationPicURL : String,
    explanation : String*/
})

const paperSchema = new mongoose.Schema({
    name: {
        type:String, required: true,minlength:5, maxlength: 20, trim: true
    },
    timing : { 
        type: timingSchema, required : true 
    },
    defaultMarks : {
        type : Number,required : true
    },
    questions : [
        questionSchema
    ],
    answers : [
        answerSchema
    ],
    paperSetterIds : [{
        type: mongoose.Schema.Types.ObjectId , ref: 'PaperSetter'
    }],
    studentIds : [{
        type: mongoose.Schema.Types.ObjectId , ref: 'Student'
    }],
});

const Paper = mongoose.model('Paper', paperSchema);
const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
const Option = mongoose.model('Option', optionSchema);
const Timing = mongoose.model('Timing', timingSchema);

const model = {

    Paper : Paper,
    setPaper : async (paperSetterId, paperName, startTime, endTime, timeLimit, defaultMarks) => {
    
        dblog(paperSetterId);
   
        try{
            
            const paper = new Paper({
                name: `${paperName}`,
                timing : new Timing({
                    startTime : `${startTime}`,
                    endTime : `${endTime}`,
                    timeLimit : `${timeLimit}`,
                }),
                defaultMarks: parseInt(defaultMarks),
                paperSetterIds : [paperSetterId]
            })
            
            await paper.validate();
            const result = await paper.save();

            dblog("New Paper is created ", result);
            if(await paperSetterModel.addPaperToPaperSettersProfile(paperSetterId, result._id) === 1){// ???
                return result;
            }else{
                ({result:0});
            }
        }
        catch(err){
            dblog("Paper is not created due to exception ",err); 
            return ({result:0});
        }
    },
    addQna : async (paperId, question, options, correctOptions) => {
        try{
            let newQuestion = new Question({
                picURL : question.picURL,
                statement : question.statement,
                options : options.map((op) => {return new Option(op)})
            });
            //await question.validate();

            let paper = await Paper.findById(paperId);
            dblog("paper to be updated ", paper);
            paper.questions.push(newQuestion);
            paper = await paper.save();

            const answer = new Answer({
                questionId : paper.questions[paper.questions.length-1]._id,
                correctOptions : correctOptions
            });
            paper.answers.push(answer);
            paper = await paper.save();
            
            dblog("updated Paper is ", paper);
    
            return paper;
        }  
        catch (err){
            dblog(err);
            return 0;
        } 

    },
    updateQna : async (paperId, questionId, question, options, correctOptions ) => {
        try{
            let paper = await Paper.findById(paperId);

            dblog("paper to be updated ", paper);
            
            for(var i=0; i<paper.questions.length; i+=1){
                if(paper.questions[i]._id == questionId){
                    paper.questions[i].picURL = question.picURL;
                    paper.questions[i].statement = question.statement;
                    paper.questions[i].options = options.map((op) => {return new Option(op)});
                }
            }
            for(var i=0; i<paper.answers.length; i+=1){
                if(paper.answers[i].questionId == questionId){
                    paper.answers[i].correctOptions = correctOptions;
                }
            }

            const result = await paper.save();
            
            dblog("updated Paper is ", paper);
    
            return result;
        }  
        catch (err){
            dblog(err);
            return 0;
        } 
    },
    dropQna : async (paperId, questionId) => {
        try{
            let paper = await Paper.findById(paperId);

            dblog("paper to be updated ", paper);
            
            paper.questions = paper.questions.filter( q => q._id != questionId);
            paper.answers = paper.answers.filter( q => q.questionId != questionId);

            const result = await paper.save();
            
            dblog("Result of deletion process", paper);
    
            return result;
        }  
        catch (err){
            dblog(err);
            return 0;
        } 
    },

    dropPaper : async (paperId,paperSetterId) => {
        try{

            if(await paperSetterModel.deletePaperFromPaperSettersProfile(paperId,paperSetterId) === 1){
                const result = await Paper.deleteOne({_id : paperId});
                dblog("Result of deletion process", result);
                return result;
            }else{
                return 0;
            }
        }  
        catch (err){
            dblog(err);
            return 0;
        } 
    }
}


module.exports = model;

