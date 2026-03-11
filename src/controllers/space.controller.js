const pool = require('../db/sql.js').pool;
const {countAllActiveSpacesService, countAllSpacesService, createSpaceService,
  deleteSpaceService, getSpaceByNameService, getSpaceByStatusService, getSpacesService,
  updateSpaceService, updateSpaceStatusService} = require('../services/space.service.js');

// 1. Controller to get all spaces

const getSpaces= async (req,res) =>{
    try{
        const spaces= await getSpacesService();
        res.json({spaces})
    } catch (error){
        console.error('Error getting the space: ', error)
        res.status(500).json({message: 'Internal Error'})
    }
}

// 2. Controller to get an space by search

const getSpaceByName=  async (req,res) =>{
    const {name}= req.params;
    try{
        const space= await getSpaceByNameService(name);
        if (!space || space.length===0){
            return res.status(404).json({message: 'No items match the search'})
        }
        res.json({space});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

//3. Controller to get an space by status

const getSpaceByStatus=  async (req,res) =>{
    const {status} = req.params;
    try{
        const space = await getSpaceByStatusService(status);
        if (!space || space.length===0){
            return res.status(404).json({message: 'No items match the search'})
        }
        res.json({space});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

//4. Controller create space

const createSpace=  async (req,res) =>{
    const {name, description,scenario_id} = req.body;
    try{
        const create= await createSpaceService(name, description,scenario_id);
        res.json({create});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 5. Controller to delete the space

const deleteSpace= async (req,res) =>{
    const {id} = req.params;
    try{
        const deleteSpa= await deleteSpaceService(id);
        if (response.rowCount===0){
            return res.status(404).json({message: 'Space not found'})
        }
        res.json({deleteSpa});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 6. Controller to update the space
const updateSpace=  async (req,res) =>{
    const {id} = req.params;
    const {name, description,scenario_id} = req.body;
    try{
        const updateSpa = await updateSpaceService(name, description,scenario_id,id);
        res.json({updateSpa});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 7. Controller of  update the space by status

const updateSpaceStatus=  async (req,res) =>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        const updateSpa = await updateSpaceStatusService(id, status);
        res.json({updateSpa});
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

// 8. Controller to count all spaces

const countAllSpaces=  async (req,res) =>{
    try{
        const spaces= await countAllSpacesService();
        res.json({spaces})
    } catch (error){
        console.error('Error getting the space: ', error)
        res.status(500).json({message: 'Internal Error'})
    }
}

// 9. Controller to count all active spaces

const countAllActiveSpaces=  async (req,res) =>{
    try{
        const spaces= await countAllActiveSpacesService();
        res.json({spaces})
    } catch (error){
        console.error('Error getting the space: ', error)
        res.status(500).json({message: 'Internal Error'})
    }
}

// 10. Controller to count all inactive spaces

const countAllInactiveSpaces=  async (req,res) =>{
    try{
        const active= await countAllActiveSpacesService();
        const all= await countAllSpacesService();
        const inactive = all-active;
        res.json({inactive})
    } catch (error){
        console.error('Error getting the space: ', error)
        res.status(500).json({message: 'Internal Error'})
    }
}

// 11. Controller for percentage

const percentage=  async (req,res) =>{
    try{
        const active= await countAllActiveSpacesService();
        const all= await countAllSpacesService();
        const percentage = ((all-active)/all)*100;
        res.json({percentage})
    } catch (error){
        console.error('Error getting the space: ', error)
        res.status(500).json({message: 'Internal Error'})
    }
}

module.exports = {getSpaces, getSpaceByName, getSpaceByStatus, createSpace, deleteSpace, updateSpace, updateSpaceStatus, countAllSpaces,
  countAllActiveSpaces, countAllInactiveSpaces, percentage};

