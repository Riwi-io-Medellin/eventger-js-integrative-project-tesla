const OpenAI = require("openai")

const openai = new OpenAI({
    apiKey: process.env.API_OPENAI_KEY
})

module.exports = openai