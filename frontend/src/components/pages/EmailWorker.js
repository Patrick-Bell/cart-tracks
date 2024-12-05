import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill
import { Box, Button, Typography, TextField, Autocomplete } from "@mui/material";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import { fetchAllWorkers } from "../endpoints/WorkersRoutes"; // Assuming this function is defined elsewhere
import { sendEmailToWorkers } from "../endpoints/WorkersRoutes";
import { Toaster, toast } from "sonner";

const EmailWorker = ({ onBack, selectedWorker }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]); // State to track selected workers
  const [editorValue, setEditorValue] = useState(""); // Store editor value (email body)
  const [subject, setSubject] = useState("")

  useEffect(() => {
    // Fetch workers data when the component mounts
    const getWorkers = async () => {
      try {
        const workersData = await fetchAllWorkers(); // Assuming it returns a promise
        setWorkers(workersData);
        // If a selectedWorker prop is passed, initialize it as selected
        if (selectedWorker) {
          setSelectedWorkers([selectedWorker]); // Wrap in an array
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    getWorkers(); // Call the function to fetch workers
  }, [selectedWorker]); // Runs when the selectedWorker prop changes

  // Define custom toolbar options
  const toolBar = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }], // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'header': [1, 2, 3, false] }],
    [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
    ['clean'], // remove formatting button
  ];

  const handleSendEmail = async () => {
    // Map selected workers to their emails
    const selectedWorkerEmails = selectedWorkers.map(worker => worker.email);
  
    // Prepare the data for sending
    const data = {
      emails: selectedWorkerEmails,  // Array of selected worker emails
      email_body: editorValue,      // Email body content
      subject: subject              // Email subject
    };

    console.log('data', data)
  
    // Check if no workers are selected and show an appropriate message
    if (data.emails.length === 0) {
      toast.error("No workers selected!", {
        description: "Please select at least one worker to send an email.",
        duration: 5000,
      });
      return; // Stop further execution if no workers are selected
    }

    if (data.subject.length === 0) {
        toast.error("Subject missing!", {
            description: "Please make sure your email has a subject!",
            duration: 5000,
         });
         return
    }

    if (data.email_body.length === 0) {
        toast.error("Body Empty?", {
            description: "Please make sure your email has a body to send!",
            duration: 5000,
         });
         return
    }
  
    try {
      // Call the function to send the email
      const result = await sendEmailToWorkers(data);
      alert(result.message);  // Display success message from backend
      toast.success("Email Sent!", {
        description: "This email has been sent to the user(s).",
        duration: 5000,
      });
    } catch (e) {
      console.error("Error sending email:", e);
      toast.error("An error occurred while sending the email.", {
        duration: 5000,
      });
    }
  };

  

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
    
      {/* Autocomplete for selecting workers */}
      <Autocomplete
        multiple
        id="tags-outlined"
        options={workers}
        value={selectedWorkers} // Set the value as an array of selected workers
        getOptionLabel={(option) => `${option.name} ${option.last_name}`} // Display name and last name
        onChange={(event, newValue) => setSelectedWorkers(newValue)} // Update selected workers
        renderInput={(params) => (
          <TextField {...params} label="Search Worker" placeholder="Select Workers" />
        )}
        sx={{mt:2, mb:2}}
      />

        <Toaster />

        <TextField
        sx={{ mb: 2 }}
        placeholder="Please enter your subject here"
        type="text"
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)} // Correct the onChange handler
        />


      {/* ReactQuill Editor */}
      <ReactQuill
        value={editorValue} // Controlled component: value is managed by React state
        onChange={setEditorValue} // Update state on content change
        modules={{
          toolbar: toolBar, // Custom toolbar configuration
        }}
        style={{
          height: '200px', // Adjust height for a better user experience
          borderRadius: "4px",
          marginBottom: "16px", // Adding margin for space between editor and buttons
        }}
      />

      {/* Button Container */}
      <Box sx={{ display: "flex", gap: 2, mt: 6 }}>
        <Button variant="contained" sx={{background:'gold', color:'black'}} onClick={handleSendEmail}>
          Send Email
        </Button>
        <Button variant="outlined" sx={{border:'1px solid gold', color:'gold', background:'black'}} onClick={onBack}>
          Back to Workers List
        </Button>
      </Box>
    </Box>
  );
};

export default EmailWorker;
