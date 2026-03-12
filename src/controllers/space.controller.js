const pool = require('../db/sql.js').pool;
const {createSpaceService, deleteSpaceService, getSpacesService,
  updateSpaceService, updateSpaceStatusService} = require('../services/space.service.js');

// 1. Controller to get all spaces OK

const getSpaces= async (req,res,next) =>{
    try{
        const spaces= await getSpacesService();
        res.json(spaces)
    } catch (error){
        next(error)
    }
}

// 2. Controller create space OK

const createSpace=  async (req,res) =>{
    const {name, description,scenario_id} = req.body;
    try{
        const response= await createSpaceService(name, description,scenario_id);
        res.json(response);
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 3. Controller to delete the space OK

const deleteSpace= async (req,res) =>{
    const {id} = req.params;
    try{
        const response= await deleteSpaceService(id);
        if (response.rowCount===0){
            return res.status(404).json({message: 'Space not found'})
        }
        res.json({message: 'Space deleted successfully', 
            space: response.rows[0]});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 4. Controller to update the space
const updateSpace=  async (req,res) =>{
    const {id} = req.params;
    const {name, description,scenario_id} = req.body;
    try{
        const response = await updateSpaceService(name, description,scenario_id,id);
        res.json(response);
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 5. Controller of  update the space by status

const updateSpaceStatus=  async (req,res) =>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        const response= await updateSpaceStatusService(id, status);
        res.json({message: "Estado del espacio actualizado correctamente",
        data: response});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = {getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus};

