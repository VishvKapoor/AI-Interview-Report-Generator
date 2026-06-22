const express=require('express')
const {authUser}=require('../middlewares/auth.middleware')
const {generateInterviewReportController,generateInterviewReportByIdController,getAllInterviewReportsController}=require('../controllers/interview.controller')
const {upload}=require('../middlewares/file.middleware')

const interviewRouter=express.Router()


module.exports=interviewRouter

interviewRouter.post('/',authUser,upload.single("resume"),generateInterviewReportController)

interviewRouter.get('/report/:interviewId',authUser,generateInterviewReportByIdController)

interviewRouter.get('/',authUser,getAllInterviewReportsController)
