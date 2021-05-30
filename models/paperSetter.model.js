const mongoose = require('mongoose');
const dblog = require('debug')('app:db');


const paperSetterSchema = new mongoose.Schema({
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
    papers : [ {type: mongoose.Schema.Types.ObjectId , ref: 'Paper'}],
    dateJoined : {type: Date, default: Date.now }
});

const PaperSetter = mongoose.model('PaperSetter', paperSetterSchema);

const model = {
    createPaperSetter : async (name,email,userId) => {
    
        try{
            const paperSetter = new PaperSetter({
                name: name,
                email: email,
                userId: userId,
                papers: [],
            })

            await paperSetter.validate();
            const result = await paperSetter.save();

            dblog("New PaperSetter is created ",paperSetter, result);

            return result;
        }
        catch(err){
            dblog("PaperSetter not created due to exception "+err);
            
            return 0;
        }
    },
    addPaperToPaperSettersProfile : async (paperSetterId, paperId) => {
        try{
            const paperSetter = await PaperSetter.findById(paperSetterId);
            paperSetter.papers.push(paperId);
            const result = await paperSetter.save();
            dblog("New paper is added to paperSetter with id ",paperSetterId, result);
            return 1;

        }
        catch(err){
            dblog("Paper not added due to exception "+err);
            
            return 0;
        }

    },
    deletePaperFromPaperSettersProfile : async (paperId,paperSetterId) => {
        try{
            const paperSetter = await PaperSetter.findById(paperSetterId);
            const index = paperSetter.papers.indexOf(paperId);
            if(index > -1){

                paperSetter.papers.splice(index,1);
                const result = await paperSetter.save();
                dblog(`Paper ${paperId} is removed from paperSetters profile with id`,paperSetterId,result);
                return 1;

            }else{
                return 0;
            }
        }
        catch(err){
            dblog("Paper not removed due to exception "+err);  
            return 0;
        }
    }
}


module.exports = model;
