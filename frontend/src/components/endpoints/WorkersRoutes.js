import axios from "axios";

export const fetchAllWorkers = async () => {
    const response = await axios.get('http://localhost:3000/api/workers')
    console.log(response.data)
    return response.data
}

export const addNewWorker = async (workerData) => {
    const response = await axios.post('http://localhost:3000/api/workers', workerData)
    console.log(response.data)
    return response.data
}

export const findOneWorker = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/workers/${id}`)
    console.log(response.data)
    return response.data
}

export const editOneWorker = async (id, workerData) => {
    const response = await axios.patch(`http://localhost:3000/api/workers/${id}`, workerData)
    return response.data
}

export const sendEmailToWorkers = async (data) => {
    const response = await axios.post(`http://localhost:3000/api/send-workers-email`, data) 
    console.log(response.data)
    return response.data
}

export const addToWatchList = async (id) => {
    const response = await axios.post(`http://localhost:3000/api/add-watching/${id}`)
    console.log(response.data)
    return response.data
}

export const removeFromWatchList = async (id) => {
    const response = await axios.post(`http://localhost:3000/api/remove-watching/${id}`)
    console.log(response.data)
    return response.data
}