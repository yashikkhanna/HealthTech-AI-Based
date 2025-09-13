import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CompatibleDonors = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!bloodGroup) {
      setError("Please select a blood group");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const encodedGroup = encodeURIComponent(bloodGroup);
      const res = await axios.get(
        `http://localhost:4000/api/v1/donation/compatible-donors?requiredBloodGroup=${encodedGroup}`,
        { withCredentials: true }
      );
      setDonors(res.data.donors);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
  maxWidth="lg"
  sx={{
    mt: 10, // Push down content so navbar doesn't overlap (increased from 5)
    mb: 5,
  }}
>
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Typography
      variant="h3"
      gutterBottom
      sx={{
        fontWeight: "bold",
        textAlign: "center",
        color: "#b71c1c",
      }}
    >
      Find Compatible Donors
    </Typography>
  </motion.div>


      {/* Search Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box display="flex" gap={2} mb={4} justifyContent="center" flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Blood Group</InputLabel>
            <Select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              label="Blood Group"
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#b71c1c",
              "&:hover": { backgroundColor: "#d32f2f" },
              paddingX: 4,
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </motion.div>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress sx={{ color: "#b71c1c" }} />
        </Box>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Donor Cards */}
      <Grid container spacing={3}>
        {donors.length > 0 ? (
          donors.map((donor, index) => (
            <Grid item xs={12} sm={6} md={4} key={donor._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
<Card
  sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    overflow: "visible", // Prevent scrollbars inside
    "&:hover": {
      transform: "scale(1.03)",
      transition: "0.3s ease",
    },
  }}
>
  <CardContent sx={{ overflow: "visible" }}>
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      {donor.firstName} {donor.lastName}
    </Typography>
    <Typography variant="body2" sx={{ color: "#b71c1c" }}>
      Blood Group: {donor.bloodGroup}
    </Typography>
    <Typography variant="body2">Email: {donor.email}</Typography>
    <Typography variant="body2">Phone: {donor.phone}</Typography>
  </CardContent>
</Card>

              </motion.div>
            </Grid>
          ))
        ) : (
          !loading &&
          !error && (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 4 }}
              >
                No donors found.
              </Typography>
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
};

export default CompatibleDonors;
