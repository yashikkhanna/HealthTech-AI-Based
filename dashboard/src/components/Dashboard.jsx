import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Tabs, Tab, Box, Typography, MenuItem, Select } from "@mui/material";

const Dashboard = () => {
  const { isAuthenticated, admin } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };

    const fetchDonationRequests = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/donation/donation-requests",
          { withCredentials: true }
        );
        setDonationRequests(data.data);
      } catch (error) {
        setDonationRequests([]);
      }
    };

    fetchAppointments();
    fetchDonationRequests();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, status } : app
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
   const handleUpdateDonationStatus = async (requestId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/donation/request/${requestId}/status`, 
        { status },
        { withCredentials: true }
      );
      toast.success(data.message);
      setDonationRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="dashboard page">
      {/* Banner */}
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <p>Hello,</p>
            <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{appointments.length}</h3>
        </div>
        <div className="thirdBox">
          <p>Donation Requests</p>
          <h3>{donationRequests.length}</h3>
        </div>
      </div>

      {/* Tabs Navbar */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Appointments" />
          <Tab label="Donation Requests" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Appointments
          </Typography>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No appointments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Donation Requests
          </Typography>
          <table>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Blood Group</th>
                <th>Center</th>
                <th>City</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {donationRequests.length > 0 ? (
                donationRequests.map((req) => (
                  <tr key={req._id}>
                    <td>{`${req.user.firstName} ${req.user.lastName}`}</td>
                    <td>{req.user.bloodGroup}</td>
                    <td>{req.center.name}</td>
                    <td>{req.center.city}</td>
                    <td>{new Date(req.date).toLocaleString()}</td>
                    <td>{req.status}</td>
                    <td>
                      <Select
                        value={req.status}
                        onChange={(e) =>
                          handleUpdateDonationStatus(req._id, e.target.value)
                        }
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No donation requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      )}
    </section>
  );
};

export default Dashboard;
