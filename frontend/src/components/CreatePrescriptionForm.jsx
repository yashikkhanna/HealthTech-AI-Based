import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./CreatePrescriptionForm.css";

const REMINDER_MEDIUMS = ["email", "sms", "whatsapp"];

export default function CreatePrescriptionForm() {
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [prescription, setPrescription] = useState(null);

  const [formData, setFormData] = useState({
    medicineName: "",
    dosage: "",
    frequency: 1,
    startDate: null,
    endDate: null,
    reminderMedium: "email",
    reminderTimes: [null],
  });

  // Fetch existing prescription
  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/api/v1/prescription/prescriptions/${appointmentId}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data?.data) {
          const fetched = res.data.data;
          setPrescription(fetched);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      })
      .catch(() => setIsEditing(true))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  // Handle frequency change → adjust number of time pickers
  const handleFrequencyChange = (freq) => {
    setFormData((prev) => ({
      ...prev,
      frequency: freq,
      reminderTimes: Array.from(
        { length: freq },
        (_, i) => prev.reminderTimes[i] || null
      ),
    }));
  };

  // Time formatting
  const formatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return null;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Submit handler
  const handleSubmit = () => {
  const payload = {
    ...formData,
    appointmentId,
    reminderMedium: formData.reminderMedium.toLowerCase(),
    startDate: formData.startDate || null,
    endDate: formData.endDate || null,
    reminderTimes: formData.reminderTimes
      .filter((t) => typeof t === "string" && t.trim() !== ""),
  };

  const apiCall = prescription
    ? axios.put(
        `http://localhost:4000/api/v1/prescription/updatePrescriptions/${prescription._id}`,
        payload,
        { withCredentials: true }
      )
    : axios.post(
        `http://localhost:4000/api/v1/prescription/create-Prescription`,
        payload,
        { withCredentials: true }
      );

  apiCall
    .then(() =>
      axios.get(
        `http://localhost:4000/api/v1/prescription/prescriptions/${appointmentId}`,
        { withCredentials: true }
      )
    )
    .then((res) => {
      if (res.data?.data) {
        setPrescription(res.data.data);
        setIsEditing(false);
      }
    });
};

  if (loading) return <p>Loading...</p>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="prescription-wrapper">
        <Paper className="prescription-container">
          <Typography variant="h5" gutterBottom>
            {prescription && !isEditing
              ? "Prescription Details"
              : "Prescription Form"}
          </Typography>

          {/* View mode */}
          {prescription && !isEditing ? (
            <div className="view-mode">
              <p>
                <b>Medicine:</b> {prescription.medicineName}
              </p>
              <p>
                <b>Dosage:</b> {prescription.dosage}
              </p>
              <p>
                <b>Frequency:</b> {prescription.frequency} times/day
              </p>
              <p>
                <b>Start Date:</b>{" "}
                {new Date(prescription.startDate).toLocaleDateString()}
              </p>
              <p>
                <b>End Date:</b>{" "}
                {new Date(prescription.endDate).toLocaleDateString()}
              </p>
              <p>
                <b>Reminder Medium:</b> {prescription.reminderMedium}
              </p>
              <p>
                <b>Reminder Times:</b>{" "}
                {Array.isArray(prescription.reminderTimes)
                  ? prescription.reminderTimes.join(", ")
                  : ""}
              </p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setFormData({
                    ...prescription,
                    reminderTimes: Array.isArray(
                      prescription.reminderTimes
                    )
                      ? prescription.reminderTimes.map((t) => {
                          if (!t) return null;
                          const [h, m] = t.split(":");
                          const d = new Date();
                          d.setHours(h, m, 0, 0);
                          return d;
                        })
                      : [null],
                  });
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
            </div>
          ) : (
            // Form mode
            <form className="form-fields">
              <Grid container spacing={2}>
                {/* Medicine Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medicine Name"
                    value={formData.medicineName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medicineName: e.target.value,
                      })
                    }
                  />
                </Grid>

                {/* Dosage */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                  />
                </Grid>

                {/* Frequency */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Frequency per day"
                    value={formData.frequency}
                    onChange={(e) =>
                      handleFrequencyChange(Number(e.target.value))
                    }
                  >
                    {[1, 2, 3].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Reminder Medium */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Reminder Medium"
                    value={formData.reminderMedium}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminderMedium: e.target.value,
                      })
                    }
                  >
                    {REMINDER_MEDIUMS.map((medium) => (
                      <MenuItem key={medium} value={medium}>
                        {medium}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(date) =>
                      setFormData({ ...formData, startDate: date })
                    }
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) =>
                      setFormData({ ...formData, endDate: date })
                    }
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </Grid>

                {/* Reminder Times */}
                {formData.reminderTimes.map((time, index) => (
                    <TextField
                        key={index}
                        label={`Reminder Time ${index + 1}`}
                        type="time"
                        value={time || ""}
                        onChange={(e) => {
                        const updatedTimes = [...formData.reminderTimes];
                        updatedTimes[index] = e.target.value; // store as string e.g. "09:00"
                        setFormData({ ...formData, reminderTimes: updatedTimes });
                        }}
                        fullWidth
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 60, // optional: step in seconds (60s = 1min)
                        }}
                    />
                    ))}

              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="submit-btn"
                style={{ marginTop: "16px" }}
              >
                {prescription ? "Update Prescription" : "Create Prescription"}
              </Button>
            </form>
          )}
        </Paper>
      </div>
    </LocalizationProvider>
  );
}
