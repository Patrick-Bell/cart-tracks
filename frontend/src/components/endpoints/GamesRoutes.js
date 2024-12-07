import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL


export const fetchAllGames = async () => {
    const response = await axios.get(`${apiUrl}/api/games`, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const addCartToGame = async (cartData) => {
    const response = await axios.post(`${apiUrl}/api/carts`, { cart: cartData}, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const getOneGame = async (id) => {
    const response = await axios.get(`${apiUrl}/api/games/${id}`, {withCredentials: true})
    console.log('game', response.data)
    return response.data
}

export const addNewGame = async (gameData) => {
    const response = await axios.post(`${apiUrl}/api/games`, { game: gameData }, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const markGameAsComplete = async (id) => {
    const response = await axios.post(`${apiUrl}/api/completed-game/${id}`, {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const deleteSingleGame = async (id) => {
    const response = await axios.delete(`${apiUrl}/api/games/${id}`, {withCredentials: true})
    console.log(response.data)
    return response.data
}
/*

Plan for completion

[x] - Adding users just need name and last name, all the rest can come under editing users
[x] - Remove messages tab, keep code in case implement in future
[] - Better dashboard design?
[x] - Make sure all toasts are correctly set up
[] - Make it mostly mobile responsive
[] - Get user to test it
[] - Do a complete game with test data


Nice to haves
[] - Maybe do a bit of tracking and events using Ahoy


new layout for dashboard
top bit can be signed in as .... | email | number or something and then .online

then 3/4 boxes with same layout as ive been doing, total workers, games, managers etc, games this month and percentage completed
- total workers (being watched as percentage)
- games and percentage as games completed or not
- fixtures next month (percentage of home games)

then upcoming fixtures

then i need to think of something new to add under
(maybe something like games awaiting completion, could be a good one to be fair)
has to be something to do with fixtures, maybe like overall fixtures expected throughout the season
so i can do a percentage of games complete / 19

notifications and venue





what to do tomorrow
- create page loader to manage this correctly
- have a look at analytics, anything i can change, sorting seems to be broken for some, fix or remove it
- finalise other things, maybe add 2 mroe games see how it handles it
- look at access control
- editing manager similar to worker
*/