const mongoose=require('mongoose')


const technicalQuestionsSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical Question is Required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is Required"]
    },
    answer:{
        type:String,
        required:[true," Answer is Required"]
    },
},{_id:false})


const behavioralQuestionsSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical Question is Required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is Required"]
    },
    answer:{
        type:String,
        required:[true," Answer is Required"]
    },
},{_id:false})


const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["Low","Medium","High","low","medium","high"],
        required:[true,"Severity is required"]
    }
},{_id:false})


const preparationPlanSchema=new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is Required"]
    },
    focus:{
        type:String,
        required:[true,"focus is Required"]
    },
    tasks:[{
        type:String,
        required:[true,"focus is Required"]
    }]
})



const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job Description is required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionsSchema],
    behavioralQuestions:[behavioralQuestionsSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:[true,"Job title is required"]
    }
},{timestamps:true})

const interviewReportModel=new mongoose.model("InterviewReport",interviewReportSchema)
module.exports=interviewReportModel