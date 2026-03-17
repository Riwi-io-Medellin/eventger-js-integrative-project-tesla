const {getScenariosService, createScenarioService, updateScenarioService, 
    deleteScenarioService} = require('../services/scenario.service.js');

// 1. Controller to get all scenarios

const getScenarios= async (req,res,next) =>{
    try{
        const scenarios= await getScenariosService();
        if (!scenarios.length){
            return res.status(404).json({message: "No scenarios found"})
        }
        res.status(200).json(scenarios)

    } catch (error){
        next(error)
    }
}

// 2. Controller create scenario
const createScenario=  async (req,res, next) =>{  
    const {name, location}= req.body;

    if (!name || !location){
        return res.status(400).json({messagge: "All fields required: name, location"})
    }

    try{
        const response= await createScenarioService(name, location);
        if (response === false){
            res.json({message: "This scenario already exists"})
        } else{
            res.status(201).json({message: "Scenario created successfully", 
            space: response})};
        console.log(response)
    } catch (error){
        next(error)
    }
}

// 3. Controller to delete the space OK

const deleteScenario= async (req,res,next) =>{
    const{id}= req.params;
    try{
        const response= await deleteScenarioService(id);
        if (response.rowCount===0){
            return res.status(404).json({message: 'Scenario not found'})
        }
        res.json({message: 'Scenario deleted successfully', 
            space: response.rows[0]});
    } catch (error){
        next(error)
    }
}

//4. Controller to update the space
const updateScenario=  async (req,res,next) =>{
    const {id} = req.params;
    const {name, location} = req.body;

    if (!name || !location){
        return res.status(400).json({messagge: "All fields required: name, location"})
    }

    try{
        const response= await updateScenarioService(name, location, id);
        if (response===false){
            res.json({message: "This scenario already exists"})
        } else{
            res.status(201).json({message: "Scenario updated successfully", 
            space: response})};
    } catch (error){
        next(error)
    }
}


module.exports ={getScenarios, createScenario, deleteScenario, updateScenario}
