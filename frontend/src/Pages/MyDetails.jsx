import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const MyDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #84fab0, #129ee5ff)",
        }}
      >
        <CircularProgress size={70} thickness={4} sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          background: "linear-gradient(135deg, #f093fb, #f5576c)",
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #43cea2, #185a9d)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <MotionCard
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,255,255,0.4)" }}
        transition={{ duration: 0.6 }}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 5,
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          p: 3,
          color: "white",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          {/* <Avatar
            src={user.avatar?.url || "/default-avatar.png"}
            alt="${user.name}"
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 2,
              border: "4px solid rgba(255,255,255,0.5)",
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.6)",
            }}
          /> */}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.85 }}>
            {user.role}
          </Typography>

          <Divider sx={{ background: "rgba(255,255,255,0.2)", mb: 2 }} />

          <Box sx={{ textAlign: "left", px: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Phone:</strong> {user.phone}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>NIC:</strong> {user.nic}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Gender:</strong> {user.gender}
            </Typography>
          </Box>
        </CardContent>
      </MotionCard>
    </Box>
  );
};

export default MyDetails;
