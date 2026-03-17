const disciplineRepository = require("./../repositories/discipline.repository")

async function get() {
    // Doing query
    const response = await disciplineRepository.get()

    // Returning response
    return response
}

async function getById(id) {
    // Doing query
    const response = await disciplineRepository.getById(id)

    // Returning response
    return response
}

module.exports = {
    get,
    getById
}