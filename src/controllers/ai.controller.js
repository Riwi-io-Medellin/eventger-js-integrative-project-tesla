const aiService = require("./../services/ai.service")
const validation = require("./../utils/validate")

async function askToAi(req, res, next) {
    try {
        // Checking that the prompt has been sent
        validation.requiredFields(req.body, "prompt")

        // Calling service
        const response = JSON.parse((await aiService.ask(req.body.prompt)))

        // Returning response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    askToAi
}