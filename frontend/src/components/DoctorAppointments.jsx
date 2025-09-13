import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DoctorAppointments.css"; // import the CSS file

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/appointment/appointments/approved", {
        withCredentials: true // important for cookie auth
      })
      .then((res) => setAppointments(res.data.appointments))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="doctor-appointments-container">
      <div className="appointments-card">
        <h1>Approved Appointments</h1>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Appointment Date</th>
              <th>Status</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>
                  {appt.patientId.firstName} {appt.patientId.lastName}
                </td>
                <td>{appt.patientId.email}</td>
                <td>
                  {new Date(appt.appointment_date).toLocaleDateString()}
                </td>
                <td>{appt.status}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/prescription/${appt._id}`)
                    }
                  >
                    View Prescription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
