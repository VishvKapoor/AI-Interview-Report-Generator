const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    matchScore: {
                        type: "number",
                        description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
                    },
                    title: {
                        type: "string",
                        description: "The title of the job for which the interview report is generated"
                    },
                    technicalQuestions: {
                        type: "array",
                        description: "Technical questions that can be asked in the interview",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string", description: "The technical question to be asked" },
                                intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                                answer: { type: "string", description: "How to answer this question, what points to cover" }
                            },
                            required: ["question", "intention", "answer"]
                        }
                    },
                    behavioralQuestions: {
                        type: "array",
                        description: "Behavioral questions that can be asked in the interview",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string", description: "The behavioral question to be asked" },
                                intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                                answer: { type: "string", description: "How to answer this question, what points to cover" }
                            },
                            required: ["question", "intention", "answer"]
                        }
                    },
                    skillGaps: {
                        type: "array",
                        description: "List of skill gaps in the candidate's profile",
                        items: {
                            type: "object",
                            properties: {
                                skill: { type: "string", description: "The skill which the candidate is lacking" },
                                severity: { type: "string", enum: ["low", "medium", "high"], description: "How critical this skill gap is" }
                            },
                            required: ["skill", "severity"]
                        }
                    },
                    preparationPlan: {
                        type: "array",
                        description: "A day-wise preparation plan for the candidate",
                        items: {
                            type: "object",
                            properties: {
                                day: { type: "number", description: "The day number starting from 1" },
                                focus: { type: "string", description: "The main focus topic of this day" },
                                tasks: {
                                    type: "array",
                                    description: "List of tasks to complete on this day",
                                    items: { type: "string" }
                                }
                            },
                            required: ["day", "focus", "tasks"]
                        }
                    }
                },
                required: ["matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
            }
        }
    })

    const result = JSON.parse(response.text)
    // console.log(JSON.stringify(result, null, 2))
    return result
}

module.exports = generateInterviewReport