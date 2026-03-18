const departmentService = require("../services/department.service");

async function get(req, res, next) {
    try {
        const response = await departmentService.get();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

module.exports = { get };
