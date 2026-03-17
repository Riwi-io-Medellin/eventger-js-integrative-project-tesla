const {getSpacesService, createSpaceService, deleteSpaceService, updateSpaceService,
    updateSpaceStatusService} = require('../services/space.service.js');

// 1. Controller to get all spaces
const getSpaces= async (req,res,next) =>{
    try{
        const spaces= await getSpacesService();
        // Verify if its getting the spaces
        if (!spaces.length){
            return res.status(404).json({message: "No spaces found"})
        }
        res.status(200).json(spaces)

    } catch (error){
        next(error)
    }
}

// 2. Controller create space

const createSpace=  async (req,res, next) =>{  
    const {name, description,scenario_id}= req.body;
    
    // Verify if the user is introducing all required variables
    if (!name || !description || !scenario_id){
        return res.status(400).json({messagge: "All fields required: name, description, scenario_id"})
    }

    try{
        const response= await createSpaceService(name, description,scenario_id);

        // Confirm if the space already exists in an specific scenario
        if (response === false){
            res.json({message: "This space already exists"})
        } else{
            res.status(201).json({message: "Space created successfully", space: response})};
    } catch (error){
        next(error)
    }
}

// 3. Controller to delete the space 

const deleteSpace= async (req,res,next) =>{
    const{id}= req.params;
    try{
        const response= await deleteSpaceService(id);

        // Verify if the object has been deleted
        if (response.rowCount===0){
            return res.status(404).json({message: 'Space not found'})
        }
        res.json({message: 'Space deleted successfully', 
            space: response.rows[0]});
    } catch (error){
        next(error)
    }
}

//4. Controller to update the space
const updateSpace=  async (req,res,next) =>{
    const {id} = req.params;
    const {name, description,scenario_id} = req.body;

    // Verify if the user is introducing all required variables
    if (!name || !description || !scenario_id){
        return res.status(400).json({messagge: "All fields required: name, description, scenario_id"})
    }

    try{
        // Confirm if the space already exists in an specific scenario
        const response= await updateSpaceService(name, description,scenario_id,id);
        if (response===false){
            res.json({message: "This space already exists"})
        } else{
            res.status(201).json({message: "Space updated successfully", 
            space: response})};
    } catch (error){
        next(error)
    }
}

// 5. Controller of  update the space by status

const updateSpaceStatus=  async (req,res) =>{
    const {id}= req.params;
    const {status}= req.body;
    const validStatus= ['active', 'inactive'];

    // Verify if the user entered a valid status
    if (!validStatus.includes(status)){
        return  res.status(400).json({ message: "Invalid status" });
    }

    try{
        const response= await updateSpaceStatusService(id, status);
        res.json({message: "Status updated", data: response});
    } catch (error){
        next(error)
    }
}

module.exports ={getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus}
