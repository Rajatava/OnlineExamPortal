const { string, boolean } = require('joi');
const mongoose = require('mongoose');
const dblog = require('debug')('app:db');


const ansSchema = new mongoose.Schema({
    questionId : mongoose.Schema.Types.ObjectId,
    chosenOptions : [String],
    timeStamp : Date
 })

const examSchema = new mongoose.Schema({
    paperId : mongoose.Schema.Types.ObjectId,
    anss : Array,//[ansSchema], 
    submitted : {
        type : Boolean,
        default : false
    },
    startTimeStamp : Date,
    endTimeStamp : Date,
    submitTimeStamp : Date
})

const studentSchema = new mongoose.Schema({
    name: {
        type:String, required: true, minlength:5, maxlength: 50, trim: true
    }, 
    email: {
        type : String, required : true,
        pattern : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    userId :  {
        type:String, required: true, minlength:4, maxlength: 8, trim: true
    }, 
    exams : [examSchema],
    dateJoined : {type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);
const Exam = mongoose.model('Exam', examSchema);
const Ans = mongoose.model('Ans', ansSchema);

const model = {
    Student : Student,
    Exam : Exam,
    Ans : Ans,
    createStudent : async (name,email,userId) => {
    
        try{
            const student = new Student({
                name: name,
                email: email,
                userId: userId,
            })

            await student.validate();
            const result = await student.save();

            dblog("New student is created ",student, result);

            return result;
        }
        catch(err){
            dblog("Student not created due to exception "+err);
            
            return 0;
        }
    },
    studentLogin : async(email) => {
        try{
            const profile = await Student.findOne({email : email}, {email : 1, userId : 1, name : 1, 'exams.paperId' : 1});
            if(profile){
                return profile;
            }else{
                return {result : 0};
            }
        }
        catch(err){
            dblog("login error :"+err);
            return 0;
        }
    }
}


module.exports = model;
