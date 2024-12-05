import axios from "axios";

export const fetchAllManagers = async () => {
    const response = await axios.get('http://localhost:3000/api/managers')
    console.log(response.data)
    return response.data
}

export const fetchOneManager = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/managers/${id}`)
    console.log(response.data)
    return response.data
}

export const addNewManager = async (managerData) => {
    const response = await axios.post(`http://localhost:3000/api/managers`, managerData, { withCredentials: true } )
    console.log(response.data)
    return response.data
}

export const enableNotifications = async (id) => {
    const response = await axios.patch(`http://localhost:3000/api/enable-notifications/${id}`)
    console.log(response.data)
    return response.data
}

export const disableNotifications = async (id) => {
    const response = await axios.patch(`http://localhost:3000/api/disable-notifications/${id}`)
    console.log(response.data)
    return response.data
}