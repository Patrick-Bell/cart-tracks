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

export const updateOneManager = async (id, managerData) => {
    const response = await axios.put(`${apiUrl}/api/managers/${id}`, managerData, { withCredentials: true })
    //console.log(response)
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

export const updatePassword = async (id, payload) => {
    const response = await axios.patch(`${apiUrl}/api/update-password/${id}`, payload, { withCredentials: true })
    console.log(response)
    return response.data
}

export const updateAccess = async (id, access) => {
    const response = await axios.patch(`${apiUrl}/api/update-access/${id}`, {access}, { withCredentials: true })
    //console.log(response)
    return response.data
}

export const changeMode = async (id, theme) => {
    const response = await axios.patch(`${apiUrl}/api/toggle-theme/${id}`, { theme }, { withCredentials: true} )
    return response.data
}