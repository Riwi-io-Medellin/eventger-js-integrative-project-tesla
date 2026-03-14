const {genMetricsDepartment, genMetricsService} = require('../services/dashboard.service.js');

// 1. Controller to get all scenarios

const generalMetrics= async (req,res,next) =>{
    const {year}= req.params;

    if(!year){
        return res.status(400).json({message: "Invalid year parameter"})
    }
 
    try{
        const response= await genMetricsService(Number(year));
        const response2= await genMetricsDepartment(Number(year));
        res.status(200).json({"general_metrics": response, "department_metrics": response2})
    } catch (error){
        next(error)
    }

    
}

module.exports = {generalMetrics}