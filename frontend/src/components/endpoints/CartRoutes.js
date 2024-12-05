import axios from "axios";

export const deleteCart = async (id) => {
    const response = await axios.delete(`http://localhost:3000/api/carts/${id}`)
    console.log(response.data)
    return response.data
}


export const getOneCart = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/carts/${id}`)
    console.log(response.data)
    return response.data
}

export const updateOneCart = async (id, cartData) => {
    const response = await axios.patch(`http://localhost:3000/api/carts/${id}`, cartData)
    console.log(response.data)
    return response.data
}