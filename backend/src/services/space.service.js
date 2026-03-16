const {getSpacesRepository, checkSpaceRepository, createSpaceRepository,
    deleteSpaceRepository,updateSpaceRepository, updateSpaceStatusRepository} = require('../repositories/space.repository.js');

// 1. Function to Show all spaces
async function getSpacesService() {
    const response = await getSpacesRepository();
    return response.rows;
} 

// 2. Function to create a new space and check if is an existing space
async function createSpaceService(name, description, scenario_id) {
    const check = await checkSpaceRepository(name, scenario_id)

    if (check.rowCount===0){
        const response = await createSpaceRepository(name, description, scenario_id)
        return response.rows[0];
    } else{
        return false;
    }
}       

// 3. Function to delete a space 
async function deleteSpaceService(id){
    const response = await deleteSpaceRepository(id);
    console.log(response)
    return response;
}

// 4. Function to update an space
async function updateSpaceService(name, description, scenario_id, id) {
    const check= await checkSpaceRepository(name, scenario_id)
    console.log(check)
    let id_verify;
    if (check.rowCount>0){
        id_verify = check.rows[0].id
        console.log({'PRUEBITA': id_verify})
    } 

    if (check.rowCount!=0 && id_verify===id){
        const response = await updateSpaceRepository(name, description, scenario_id, id)
        return response.rows[0];
    } else if (check.rowCount===0){
        const response = await updateSpaceRepository(name, description, scenario_id, id)
        return response.rows[0];
        console.log(response)
    } else{
        return false;
    }
}

// 5. Function to update status
async function updateSpaceStatusService(id, status){
    const response= await updateSpaceStatusRepository(id, status);
    return response.rows;
}

module.exports = {getSpacesService, createSpaceService, deleteSpaceService, updateSpaceService,
    updateSpaceStatusService}
