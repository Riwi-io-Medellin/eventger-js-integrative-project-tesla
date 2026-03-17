const {getScenariosRepository, checkScenarioRepository, updateScenarioRepository,
     deleteScenarioRepository, createScenarioRepository} = require('../repositories/scenario.repository.js');

// 1. Function to Show all scenarios
async function getScenariosService() {
    const response = await getScenariosRepository();
    return response.rows;
} 

// 2. Function to create a new scenario and check if there is a scenario with the same name
async function createScenarioService(name, location) {
    const check = await checkScenarioRepository(name)

    // Verify if the scenario name already exists
    if (check.rowCount===0){
        const response = await createScenarioRepository(name, location)
        return response.rows[0];
    } else{
        return false;
    }
}       

// 3. Function to delete a space 
async function deleteScenarioService(id){
    const response = await deleteScenarioRepository(id);
    return response;
}

// 4. Function to update an space
async function updateScenarioService(name, location, id) {
    const check= await checkScenarioRepository(name)

    let id_verify;
    // Check if there is a existing scenario and get the id of the scenario to know if is the same
    if (check.rowCount>0){
        id_verify = check.rows[0].id
    } 

    if (check.rowCount!=0 && id_verify===id){
        const response = await updateScenarioRepository(name, location, id)
        return response.rows[0];
    } else if (check.rowCount===0){
        const response = await updateScenarioRepository(name, location, id)
        return response.rows[0];
    } else{
        return false;
    }
}

module.exports = {getScenariosService,createScenarioService, 
    deleteScenarioService, updateScenarioService}
