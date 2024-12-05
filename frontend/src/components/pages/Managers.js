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
  Tooltip
} from "@mui/material";
import { fetchAllManagers } from "../endpoints/ManagersRoutes";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkerDetails from "./WorkerDetails";
import ManagerDetails from "./ManagerDetails";
import AddManager from "./AddManager";
import { Toaster, toast } from "sonner";
import { useAuth } from '../../context/AuthContext'

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null); // Use `null` to check if a worker is selected
  const [open, setOpen] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetchAllManagers();
        if (response) {
          setManagers(response);
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchManagers();
  }, [open]);

  // Handler to reset selected worker and go back to list
  const handleBackToList = () => setSelectedManager(null);

  const handleOpen = () => {
    if (user?.user.access !== "low") {
      toast.error(`You do not have access to this!`)
      return
    }
    
    setOpen(true);
  };

  // Close the Add Cart Modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>

    
      {!selectedManager ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: '800' }}>Managers</Typography>

            <Button onClick={handleOpen} variant='contained' sx={{ background: 'gold', color: 'black' }}>Add New Manager</Button>
          </Box>

          <AddManager open={open} onClose={handleClose} />
          <Toaster />

          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table>
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
                      <TableCell>{manager.name}</TableCell>
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
