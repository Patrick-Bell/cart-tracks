import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { fetchAllManagers } from "../endpoints/ManagersRoutes";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkerDetails from "./WorkerDetails";
import ManagerDetails from "./ManagerDetails";
import AddManager from "./AddManager";
import { Toaster, toast } from "sonner";
import { useAuth } from '../../context/AuthContext'
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditManager from "./EditManager";


const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null); // Use `null` to check if a worker is selected
  const [open, setOpen] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [selectedEditManager, setSelectedEditManager] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetchAllManagers();
        const filtered = response.filter(manager => manager.role !== 'super')
        if (response) {
          setManagers(filtered);
          setPageLoading(false)
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchManagers();
  }, [open, openEdit]);

  // Handler to reset selected worker and go back to list
  const handleBackToList = () => setSelectedManager(null);

  const handleOpen = () => {
    if (user?.user.access !== "high") {
      toast.error(`You do not have access to this!`)
      return
    }
    
    setOpen(true);
  };

  // Close the Add Cart Modal
  const handleClose = () => {
    setOpen(false);
  };

  const closeEdit = () => {
    setOpenEdit(false)
  }

  const handleEditOpen = (manager) => {

    if (user?.user.access === 'low' || user?.user?.access === 'middle' && user?.user?.name !== manager.name) { 
      toast.error('You do not have permission for this action', {
        description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 3000
      });

    } else {
      setSelectedEditManager(manager);
      setOpenEdit(true);
    }
  };
  


  if (pageLoading) {
    return (
      <Box
        sx={{
          top: '50%',
          left: { xs: '50%', sm: 'calc(50% + 120px)' }, // Offset left for small screens, centered for larger screens
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          textAlign: 'center',
        }}>
        <CircularProgress sx={{color:'grey'}} thickness={10} />
        <Typography sx={{color:'grey'}}>Fetching Data...</Typography>
      </Box>
    )
  }

  return (
    <>

    <EditManager selectedManager={selectedEditManager} open={openEdit} onClose={closeEdit}/>
    
      {!selectedManager ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: '800' }}></Typography>

            <Button onClick={handleOpen} variant='contained' sx={{ background: 'gold', color: 'black' }}>Add New Manager</Button>
          </Box>

          <AddManager open={open} onClose={handleClose} />
          <Toaster />

          <Box sx={{ mt: 3, overflow:'auto', borderRadius:'10px' }}>
            <TableContainer component={Paper} sx={{width:'100%'}}> 
              <Table sx={{minWidth:'650px'}}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Shifts</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {managers.map((manager) => (
                    <TableRow key={manager.id}>
                  <TableCell>
                    {user?.user?.name === manager.name 
                      ? `${manager.name} ${manager.last_name.slice(0, 1)} (You)` 
                      : `${manager.name} ${manager.last_name.slice(0, 1)}`}
                  </TableCell>
                      <TableCell>{new Date(manager.created_at).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>{manager.games.length}</TableCell>
                      <TableCell>
                        <Tooltip title='View Manager' arrow>
                        <Button
                          onClick={() => setSelectedManager(manager)}
                          sx={{ background: 'gold', color: "black" }}
                          variant="contained"
                        >
                          <RemoveRedEyeIcon />
                        </Button>
                        </Tooltip>
                        <Tooltip title='Edit Manager' arrow>
                        <Button
                          onClick={() => handleEditOpen(manager)}
                          sx={{ background: 'gold', color: "black", ml:2 }}
                          variant="contained"
                        >
                          <EditNoteIcon />
                        </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <ManagerDetails manager={selectedManager} setSelectedManager={setSelectedManager} />
      )}
    </>
  );
};

export default Managers;
