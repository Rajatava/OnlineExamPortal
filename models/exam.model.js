const { string, boolean } = require('joi');
const mongoose = require('mongoose');
const StudentModel = require('./student.model');
const PaperModel = require('./paper.model');
const dblog = require('debug')('app:db');

const Exam = StudentModel.Exam;
const Ans = StudentModel.Ans;

const model = {

    startExam : async (paperId,studentId,examId) => {
        try{
            const paper = await PaperModel.Paper.findById(paperId); 

            let student = await StudentModel.Student.findById(studentId);
            let startTimeStamp;
            let endTimeStamp;

            // check if student is elidgible to take the test
                // if student is resgistered for this paper. if registered, then studentId should be present in this papers studentIds array
                // if currentTime is less than endTimeStamp
                // if examId is present, that means the exam is already started by the student, if not submitted, then just return the questions array
            if(examId.length>1){
                for(let i = student.exams.length-1;i>=0 ; i-=1){
                    if(student.exams[i]._id == examId){
                        if(student.exams[i].submitted){
                            dblog("The exam already have been submited")
                            return {result : 0}; // should return code indicating that exam has already been submitted
                        }
                        startTimeStamp = student.exams[i].startTimeStamp;
                        endTimeStamp = student.exams[i].endTimeStamp;
                        break;
                    }
                }
            }
            else{
                const time = paper.timing.timeLimit.split(":").map(x => parseInt(x));
                
                student.exams.push(new Exam({
                    paperId : paperId,
                    startTimeStamp : Date.now(),
                    endTimeStamp : Date.now() + time[0]*60*60000 + time[1]*60000
                }));
                // check if timing.endTime>endTimeStamp
                startTimeStamp = student.exams[student.exams.length-1].startTimeStamp;
                endTimeStamp = student.exams[student.exams.length-1].endTimeStamp;
                examId = student.exams[student.exams.length-1]._id;

                await student.save();

                if(!paper.studentIdsAttended.includes(studentId)) paper.studentIdsAttended.push(studentId);
            }
            
            // return the question paper , examId, and endTimeStamp
            
            return {
                examId : examId,
                startTimeStamp : startTimeStamp,
                endTimeStamp : endTimeStamp,
                questions : paper.questions
            }
        }
        catch(err){
            dblog("Start exam is not possible due to error",err)
            return 0;
        }
    },
    

    saveAns : async (studentId, examId, questionId, chosenOptions) => {

        try{
            /*const result = await StudentModel.Student.findOneAndUpdate(
                {  "_id" : studentId, 
                    "exams._id" : examId,
                    "exams.anss.questionId" : questionId
                }, 
                {
                    "$set" : {
                        "exams.$.anss.0.chosenOptions" : chosenOptions
                    } 
                },
                {useFindAndModify : false}
            )*/
            
            let student = await StudentModel.Student.findById(studentId);

            for(let i = student.exams.length-1;i>=0 ; i-=1){
                if(student.exams[i]._id == examId){

                    //check if currentTime is less than endTimeStamp
                    if(student.exams[i].endTimeStamp < Date.now()){
                        dblog("Time out")
                        return {result : 0};
                    }

                    let updated = false;
                    for(let j = student.exams[i].anss.length-1;j>=0 ; j-=1){
                        if(student.exams[i].anss[j].questionId == questionId){
                            student.exams[i].anss[j].chosenOptions = chosenOptions;
                            updated = true;
                            break;
                        }
                    }
                    if(!updated){
                        student.exams[i].anss.push({questionId : questionId, chosenOptions : chosenOptions})
                    }

                    student.markModified("exams");
                    await student.save(); 

                    return {result:1} ;
                }
            }

            return {result : 0};

        }
        catch(err){
            dblog("Answer have not been saved due to error",err)
            return 0;
        }
    },


    submitExam : async (examId,studentId) => {

        try{
        
            const student = await StudentModel.Student.findById(studentId);
            for(let i = student.exams.length-1;i>=0 ; i-=1){
                if(student.exams[i]._id == examId){
                    student.exams[i].submitted = true;
                    await student.save();
                    return {result:1};
                }
            }
            return {result : 0};
        }
        catch(err){
            dblog("Submitting exam is not possible due to error",err)
            return 0;
        }
    }
}

module.exports = model;