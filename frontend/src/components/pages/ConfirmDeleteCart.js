import { Dialog, DialogActions, DialogContent, Button, Typography, DialogTitle } from "@mui/material"

const ConfirmDeleteCart = ({ onClose, openConfirm, deleteOneCart, selectedCartId}) => {


    return (
        <>
    <Dialog open={openConfirm} onClose={onClose}>
      <DialogTitle>Delete Cart</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this cart? This action <strong>CANNOT</strong> be undone.</Typography>
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
          onClick={() => deleteOneCart(selectedCartId)}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
        
        </>
    )
}

export default ConfirmDeleteCart