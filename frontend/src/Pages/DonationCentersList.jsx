import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  CardActionArea,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { motion } from "framer-motion";
import DonationRequestForm from "../components/DonationRequestForm";

const DonationCentersList = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/donation/centers",
          { withCredentials: true }
        );
        setCenters(res.data.centers || []);
      } catch (error) {
        console.error("Error fetching donation centers", error);
      }
      setLoading(false);
    };
    fetchCenters();
  }, []);

  const handleCenterClick = (centerId) => {
    setSelectedCenter(centerId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress sx={{ color: "#b71c1c" }} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ pt: 12, pb: 6, px: { xs: 3, md: 10 }, backgroundColor: "#fff8f8" }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{ color: "#b71c1c" }}
          >
            Donation Centers
          </Typography>
        </motion.div>

        {/* Card Grid */}
        <Grid container spacing={4} mt={2}>
          {centers.map((center, index) => (
            <Grid item xs={12} sm={6} md={4} key={center._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 30px rgba(183,28,28,0.25)",
                }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{ borderRadius: "16px" }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #ffffff, #fff5f5)",
                    overflowy: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <CardActionArea onClick={() => handleCenterClick(center._id)}>
                    <CardContent sx={{ p: 3 }}>
                      {/* Name */}
                      <Box display="flex" alignItems="center" mb={1}>
                        <HomeWorkIcon sx={{ mr: 1, color: "#b71c1c" }} />
                        <Typography variant="h6" fontWeight="bold">
                          {center.name}
                        </Typography>
                      </Box>

                      {/* City & Address */}
                      <Box display="flex" alignItems="center">
                        <LocationOnIcon sx={{ mr: 1, color: "#757575" }} />
                        <Typography variant="body2" color="text.secondary">
                          {center.city}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 4, mt: 0.5 }}
                      >
                        {center.address}
                      </Typography>

                      {/* Phone */}
                      <Box display="flex" alignItems="center" mt={1}>
                        <PhoneIcon sx={{ mr: 1, color: "#757575" }} />
                        <Typography variant="body2">{center.contactNumber}</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Donation Request Modal */}
      <DonationRequestForm
        open={!!selectedCenter}
        onClose={() => setSelectedCenter(null)}
        centerId={selectedCenter}
      />
    </>
  );
};

export default DonationCentersList;
