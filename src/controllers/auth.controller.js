const authService = require('./../services/auth.service')

function register(req, res) {
    const { name, email, password, department_id, rol_id } = req.body

    // Validating body parameters
    if(!name) return res.status(400).json({message: "Missing name parameter"});
    else if(!email) return res.status(400).json({message: "Missing email parameter"});
    else if(!password) return res.status(400).json({message: "Missing password parameter"});
    else if(!department_id) return res.status(400).json({message: "Missing department_id parameter"});
    else if(!rol_id) return res.status(400).json({message: "Missing name parameter"});

    // Calling service
    const token = authService.register(req.body)

    // Returning response
    res.status(201).json({token})
}

module.exports = { register }