import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL


export const addFixture = async (data) => {
    const response = await axios.post(`${apiUrl}/api/fixtures`, data, { withCredentials: true })
    //console.log(response.data)
    return response.data
}

export const getFixtures = async () => {
    const response = await axios.get(`${apiUrl}/api/fixtures`, { withCredentials: true })
    //console.log(response.data, 'fixtures')
    return response.data
}

export const getNext3Games = async () => {
    const response = await axios.get(`${apiUrl}/api/next-3-games`, { withCredentials: true })
    //console.log(response.data)
    return response.data
}

export const getNextMonthGames = async () => {
    const response = await axios.get(`${apiUrl}/api/next-month-games`, { withCredentials: true })
    //console.log(response.data)
    return response.data
}
