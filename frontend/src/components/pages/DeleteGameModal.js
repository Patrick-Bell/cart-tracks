import { Dialog, DialogActions, DialogContent, Button, Typography, DialogTitle } from "@mui/material"

const DeleteGameModal = ({ deleteClose, openDelete, deleteOneGame, game, gameId}) => {


    return (
        <>
<Dialog open={openDelete}>
      <DialogTitle>Delete Game</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this game? This action <strong>CANNOT</strong> be undone. Deleting this event will also <strong>DELETE</strong> all carts associated with workers.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteClose} variant="outlined" sx={{ color: 'gold', border: '1px solid gold' }}>
          Cancel
        </Button>
        <Button
          sx={{
            background: 'gold',
            color: 'black',
            height: '35px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={() => deleteOneGame(game?.id)}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
        
        </>
    )
}

export default DeleteGameModal