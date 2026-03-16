const openai = require("./../infrastructure/openai.client")
const prompts = require("./../prompts")

async function ask(userPrompt) {
    const response = await openai.chat.completions.create({
        model: process.env.API_OPENAI_MODEL,
        messages: [
            {
                role: "system",
                content: prompts.initializing
            },
            {
                role: "user",
                content: userPrompt
            }
        ],
        temperature: 1 // Creative Model
    })

    const result = response.choices[0].message.content

    return result
}

module.exports = { ask }