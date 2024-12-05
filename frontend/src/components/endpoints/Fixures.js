import axios from 'axios'

export const addFixture = async (data) => {
    const response = await axios.post(`http://localhost:3000/api/fixtures`, data)
    console.log(response.data)
    return response.data
}

export const getFixtures = async () => {
    const response = await axios.get(`http://localhost:3000/api/fixtures`)
    console.log(response.data, 'fixtures')
    return response.data
}

export const getNext3Games = async () => {
    const response = await axios.get('http://localhost:3000/api/next-3-games')
    console.log(response.data)
    return response.data
}

export const getNextMonthGames = async () => {
    const response = await axios.get(`http://localhost:3000/api/next-month-games`)
    console.log(response.data)
    return response.data
}