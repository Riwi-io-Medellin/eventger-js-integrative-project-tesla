import {pool} from '../db/sql.js'
import {getSpaceByNameService, getSpacesService } from '../services/space.service.js';


// 1. Controller to get all spaces
export const getSpaces = async (req,res) =>{
    
    try{
        const spaces = await getSpacesService();
        res.json({spaces})
    } catch (error){
        console.error('Error getting the space: ', error)
        res.status(500).json({message: 'Internal Error'})
    }
}

// 2. Controller to get an space by search

export const getSpaceByName =  async (req,res) =>{
    const {name} = req.params;
    try{
        const space = await getSpaceByNameService(name);
        res.json({space});
    } catch (error){
        res.status(404).json({message: 'No items match the search'})
    }
}

export const getSpaceByStatus

getSpaceByStatusService(status)


//3. Controller 





export const createSpace = async (req,res) =>{
    //datos que ingresa el cliente
    const {name, birth_date} = req.body
    const query = 'INSERT INTO test.patient (name, birth_date) VALUES ($1,$2) RETURNING *'

    try{
        const response = await pool.query(query, [name, birth_date]);
        res.status(201).json({ message: 'Patient created successfully'})
    } catch (error){
        console.error('Error creating the patient: ', error)
        res.status(404).json({message: 'Error creating the patient'})
    }
}

export const deleteSpace = async (req,res) =>{
    const {id} = req.params;
    const query = 'DELETE FROM test.patient WHERE id=$1'

    try{
        const response = await pool.query(query, [id]);
        if (response.rowCount ===0){
            return res.status(404).json({message: 'Patient not found'})
        }

        res.json({
            message: 'Patient deletd succesfully',
            patient: response.rows[0]
        });
    } catch (error){
        console.error('Error deleting the patient: ', error)
        res.status(404).json({message: 'Internal server error'})
    }
}

export const updateSpace =async (req,res) =>{
    const {id} = req.params;
    const {name, birth_date} = req.body

    const query = 'UPDATE test.patient SET name= $1, birth_date=$2 WHERE id=$3 RETURNING *'

    try{
        const response = await pool.query(query, [name, birth_date,id]);
        response.rows[0]
        res.status(200).json({ message: 'Patient updated successfully'})
    } catch (error){
        console.error('Error creating the patient: ', error)
        res.status(404).json({message: 'Error updating the patient'})
    }
}