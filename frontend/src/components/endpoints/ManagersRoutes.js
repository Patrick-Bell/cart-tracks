import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL


export const fetchAllManagers = async () => {
    const response = await axios.get(`${apiUrl}/api/managers`, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

export const fetchOneManager = async (id) => {
    const response = await axios.get(`${apiUrl}/api/managers/${id}`, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

export const addNewManager = async (managerData) => {
    const response = await axios.post(`${apiUrl}/api/managers`, managerData, { withCredentials: true } )
    //console.log(response.data)
    return response.data
}

export const enableNotifications = async (id) => {
    const response = await axios.patch(`${apiUrl}/api/enable-notifications/${id}`, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

export const disableNotifications = async (id) => {
    const response = await axios.patch(`${apiUrl}/api/disable-notifications/${id}`, {withCredentials: true})
    //console.log(response.data)
    return response.data
}