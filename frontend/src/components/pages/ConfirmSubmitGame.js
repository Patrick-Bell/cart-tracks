import { Dialog, DialogActions, DialogContent, Button, Typography, DialogTitle } from "@mui/material"

const ConfirmSubmitGame = ({ onClose, openSubmit, liveGame, gameId, submitGame, button, loading }) => {

  const doubleCheck = () => {
  if (liveGame?.carts.length <= 10) {
    return `You currently have ${liveGame?.carts.length} carts logged, usually there is at least 14.`
  }
}

    return (
        <>
        <Dialog open={openSubmit} onClose={onClose}>
      <DialogTitle>Submit Game</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to submit this game?</Typography>
        <Typography sx={{mt:2}}>{doubleCheck()}</Typography>
        <Typography sx={{mt:2}}>You will be submitting the game <strong>{liveGame.name}</strong> ({new Date(liveGame.date).toLocaleDateString('en-GB')}).</Typography>
        <Typography sx={{mt:2}}>A PDF summary will become available on the <strong>Events Page</strong>.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: 'gold', border: '1px solid gold' }}>
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
          onClick={() => submitGame(gameId)}
          color="primary"
          disabled={loading}
        >
          {button}
        </Button>
      </DialogActions>
    </Dialog>
        
        </>
    )
}

export default ConfirmSubmitGame