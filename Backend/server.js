require('dotenv').config()
const app=require('./src/app')
const connectToDB=require('./src/config/database')
const invokeGemniAi=require('./src/services/ai.service')

const generateInterviewReport=require('./src/services/ai.service')


connectToDB()

app.listen(3000,()=>{
    console.log(`sever is running at http://localhost:3000`)
})
