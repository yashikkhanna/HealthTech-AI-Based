import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const [qualifications, setQualifications] = useState([""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [fees, setFees] = useState(""); // ✅ New state for fees
  const [clinicAddress, setClinicAddress] = useState(""); // ✅ New state for clinic address
  const [docAvatar, setDocAvatar] = useState();
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [experience, setExperience] = useState("");
  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];
  const handleQualificationChange = (index, value) => {
  const newQualifications = [...qualifications];
  newQualifications[index] = value;
  setQualifications(newQualifications);
};

const addQualificationField = () => {
  setQualifications([...qualifications, ""]);
};

const removeQualificationField = (index) => {
  const newQualifications = qualifications.filter((_, i) => i !== index);
  setQualifications(newQualifications);
};


  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("fees", fees); // ✅ Append fees
      formData.append("clinicAddress", clinicAddress); // ✅ Append clinic address
      formData.append("docAvatar", docAvatar);
      formData.append("experience", experience);
      formData.append("qualifications", JSON.stringify(qualifications));

      await axios.post(
        "http://localhost:4000/api/v1/user/doctor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("New Doctor Registered!");
      navigateTo("/");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
      setDoctorDepartment("");
      setFees("");
      setClinicAddress("");
      setDocAvatarPreview("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">REGISTER A NEW DOCTOR</h1>
        <form onSubmit={handleAddNewDoctor}>
          <div className="first-wrapper">
            <div>
              <img
                src={
                  docAvatarPreview ? `${docAvatarPreview}` : "/docHolder.jpg"
                }
                alt="Doctor Avatar"
              />
              <input type="file" onChange={handleAvatar} />
            </div>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="number"
                placeholder="NIC"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />
              <input
                type={"date"}
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                value={doctorDepartment}
                onChange={(e) => {
                  setDoctorDepartment(e.target.value);
                }}
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => {
                  return (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  );
                })}
              </select>

              {/* ✅ New inputs for fees and clinic address */}
              <input
                type="number"
                placeholder="Consultation Fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
              />
              <input
                type="text"
                placeholder="Clinic Address"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
              />
              <label>Qualifications</label>
{qualifications.map((qualification, index) => (
  <div key={index} style={{ display: "flex", gap: "10px" }}>
    <input
      type="text"
      placeholder="Enter Qualification"
      value={qualification}
      onChange={(e) => handleQualificationChange(index, e.target.value)}
    />
    {index > 0 && (
      <button type="button" onClick={() => removeQualificationField(index)}>
        Remove
      </button>
    )}
  </div>
))}
<button type="button" onClick={addQualificationField}>
  Add Another Qualification
</button>


              <button type="submit">Register New Doctor</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;
