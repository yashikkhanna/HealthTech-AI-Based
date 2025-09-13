import  { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";

const AddDonationCenterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/donation/center/add", // Your backend route
        formData,
        {
            withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if token required
          },
        }
      );

      setMessage({ type: "success", text: res.data.message });
      setFormData({ name: "", city: "", address: "", contactNumber: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }

    setLoading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Donation Center
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Center Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          label="City"
          name="city"
          fullWidth
          value={formData.city}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          label="Address"
          name="address"
          fullWidth
          multiline
          rows={3}
          value={formData.address}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          label="Contact Number"
          name="contactNumber"
          fullWidth
          value={formData.contactNumber}
          onChange={handleChange}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Center"}
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}
    </Paper>
  );
};

export default AddDonationCenterForm;
