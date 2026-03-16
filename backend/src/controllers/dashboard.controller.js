const {generalMetricsService, generalMetrics2Service, filter} = require('../services/dashboard.service.js');

// 1. Controller to get all general metrics

const generalMetrics = async(req, res, next) =>{
    const {year} = req.params;

    try{
        const metricsGen = await generalMetricsService(year)
        const metricsDep = await generalMetrics2Service(year)
        if (!metricsGen.total_goal){
            return res.status(404).json({message: `No metrics found for ${year}`})
        }
        res.status(200).json({"general_metrics": metricsGen, "general_dep_metrics": metricsDep})

    } catch(error){
        next(error)
    }
}

const filtredMetrics = async(req, res, next) =>{
    const {year} = req.params;

    try{
        const response = await filter(year)

        if (!response || response.length===0){
            return res.status(404).json({message: `No metrics found for ${year}`})
        }

        res.status(200).json(response)

    } catch(error){
        next(error)
    }
}


module.exports = {generalMetrics, filtredMetrics}