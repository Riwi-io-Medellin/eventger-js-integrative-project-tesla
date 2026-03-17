const {generalMetricsService, generalMetrics2Service, filter} = require('../services/dashboard.service.js');

// 1. Controller to get all general metric

const generalMetrics = async(req, res, next) =>{
    const {year} = req.params;

    try{
        // Call the functions with general metrics for organization and department
        const metricsGen = await generalMetricsService(year)
        const metricsDep = await generalMetrics2Service(year)

        // Verify if metrics have been found
        if (!metricsGen.total_goal){
            return res.status(404).json({message: `No metrics found for ${year}`})
        }
        //Response of metrics
        res.status(200).json({"general_metrics": metricsGen, "general_dep_metrics": metricsDep})

    } catch(error){
        next(error)
    }
}

// 2. Controller to have filtered metrics by department and discipline

const filteredMetrics = async(req, res, next) =>{
    const {year} = req.params;

    try{
        const response = await filter(year)

        // Verify if filtered metrics have been found
        if (!response || response.length===0){
            return res.status(404).json({message: `No metrics found for ${year}`})
        }

        // response the metrics information
        res.status(200).json(response)

    } catch(error){
        next(error)
    }
}


module.exports = {generalMetrics, filteredMetrics}