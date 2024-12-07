import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL


export const fetchAllWorkers = async () => {
    const response = await axios.get(`${apiUrl}/api/workers`, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const addNewWorker = async (workerData) => {
    const response = await axios.post(`${apiUrl}/api/worker`, workerData, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const findOneWorker = async (id) => {
    const response = await axios.get(`${apiUrl}/api/workers/${id}`, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const editOneWorker = async (id, workerData) => {
    const response = await axios.patch(`${apiUrl}/api/workers/${id}`, workerData, {withCredentials: true})
    return response.data
}

export const sendEmailToWorkers = async (data) => {
    const response = await axios.post(`${apiUrl}/api/send-workers-email`, data, {withCredentials: true}) 
    console.log(response.data)
    return response.data
}

export const addToWatchList = async (id) => {
    const response = await axios.post(`${apiUrl}/api/add-watching/${id}`, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const removeFromWatchList = async (id) => {
    const response = await axios.post(`${apiUrl}/api/remove-watching/${id}`, {withCredentials: true})
    console.log(response.data)
    return response.data
}