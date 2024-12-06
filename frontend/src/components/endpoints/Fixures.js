import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL


export const addFixture = async (data) => {
    const response = await axios.post(`${apiUrl}/api/fixtures`, data)
    console.log(response.data)
    return response.data
}

export const getFixtures = async () => {
    const response = await axios.get(`${apiUrl}/api/fixtures`)
    console.log(response.data, 'fixtures')
    return response.data
}

export const getNext3Games = async () => {
    const response = await axios.get(`${apiUrl}/api/next-3-games`)
    console.log(response.data)
    return response.data
}

export const getNextMonthGames = async () => {
    const response = await axios.get(`${apiUrl}/api/next-month-games`)
    console.log(response.data)
    return response.data
}