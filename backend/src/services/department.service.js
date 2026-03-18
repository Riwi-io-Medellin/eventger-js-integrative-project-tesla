const departmentRepository = require("../repositories/department.repository");

async function get() {
    return departmentRepository.find();
}

module.exports = { get };
