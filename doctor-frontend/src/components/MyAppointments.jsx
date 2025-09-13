import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./MyAppointments.css"; // optional styling

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/appointment/getPatientAppointments", {
          withCredentials: true, // include cookies if JWT is in cookies
        });
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          setError("Failed to load appointments");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p className="loading-text">Loading appointments...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Appointment Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>
                  {appt.patientId
                    ? `${appt.patientId.firstName} ${appt.patientId.lastName}`
                    : "Unknown"}
                </td>
                <td>{new Date(appt.appointment_date).toLocaleDateString()}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAppointments;
