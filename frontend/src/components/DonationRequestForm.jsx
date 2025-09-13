import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const DonationRequestForm = ({ open, onClose, centerId }) => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [cbcReport, setCbcReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async () => {
    if (!bloodGroup || !cbcReport) {
      alert("Please select blood group and upload a CBC report.");
      return;
    }

    const formData = new FormData();
    formData.append("centerId", centerId);
    formData.append("bloodGroup", bloodGroup);
    formData.append("cbcReport", cbcReport);

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/donation/request", // your backend route
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // if using cookies for auth
        }
      );
      alert(data.message);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Donation Request</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Center ID: {centerId}
        </Typography>

        <TextField
          select
          label="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {bloodGroups.map((bg) => (
            <MenuItem key={bg} value={bg}>
              {bg}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          Upload CBC Report
          <input
            type="file"
            hidden
            onChange={(e) => setCbcReport(e.target.files[0])}
            accept=".pdf,image/*"
          />
        </Button>

        {cbcReport && (
          <Typography variant="body2" color="success.main">
            {cbcReport.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationRequestForm;
