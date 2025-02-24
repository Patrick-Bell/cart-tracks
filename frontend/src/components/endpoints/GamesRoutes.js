import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL


export const fetchAllGames = async (year) => {
    const response = await axios.get(`${apiUrl}/api/games`, {
        params: { year: year },
        withCredentials: true
    });
    return response.data;
}

export const addCartToGame = async (cartData) => {
    const response = await axios.post(`${apiUrl}/api/carts`, { cart: cartData}, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

export const getOneGame = async (id) => {
    const response = await axios.get(`${apiUrl}/api/games/${id}`, {withCredentials: true})
    //console.log('game', response.data)
    return response.data
}

export const addNewGame = async (gameData) => {
    const response = await axios.post(`${apiUrl}/api/games`, { game: gameData }, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

export const markGameAsComplete = async (id) => {
    const response = await axios.post(`${apiUrl}/api/completed-game/${id}`, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

export const deleteSingleGame = async (id) => {
    const response = await axios.delete(`${apiUrl}/api/games/${id}`, {withCredentials: true})
    //console.log(response.data)
    return response.data
}

/*

What to do to make it complete
[] - Creating a manager only needs name, last_name, email, password
[] - Able to edit manager (password, picture, number)
[] - Test it with deployed version and add 5 games with full carts to see how it handles it
[] - For the adding cart, set the error messages to stay for 3 seconds
[] - See if I can make the cart info page a little bigger
[] - Change Arrows to actual icons as on phone they show up as emojis
 //


*/