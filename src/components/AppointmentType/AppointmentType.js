import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { Card, Alert, Button, Spinner } from "react-bootstrap";
import "./AppointmentType.css";
import apiService from "../../services/api";

const AppointmentType = (props) => {
  const [returnedData, setReturnedData] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const { title, time, shortDetails } = props.appointmentData;
  
  // Fetch doctors when modal opens
  useEffect(() => {
    if (isOpen && doctors.length === 0) {
      fetchDoctors();
    }
  }, [isOpen]);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await apiService.getDoctors();
      const doctorsList = response.doctors || [];
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  };
  
  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    
    const form = event.target;
    
    // Combine date and time into ISO format
    const dateValue = form.date.value; // e.g., "2026-02-17"
    const timeValue = form.time.value; // e.g., "09:00"
    const dateTimeString = `${dateValue}T${timeValue}:00Z`; // e.g., "2026-02-17T09:00:00Z"
    
    const appointmentData = {
      doctor_id: parseInt(form.doctor.value),
      date: dateTimeString,
      time: timeValue,
      type: title,
      status: "pending",
      notes: `Name: ${form.name.value}, Phone: ${form.phoneNumber.value}, Email: ${form.email.value}`
    };

    try {
      const response = await apiService.createAppointment(appointmentData);
      setReturnedData(response);
      setAppointmentId(response.appointment?.id || response.id);
      form.reset();
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setReturnedData(null);
      }, 3000);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError(error.message || "Failed to create appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <Card className="appointment-card">
      <Card.Body>
        <Card.Title className="appointment-title">{title}</Card.Title>
        <Card.Subtitle className="appointment-time">{time}</Card.Subtitle>
        <Card.Text className="appointment-details">
          <small>{shortDetails}</small>
        </Card.Text>
        <Popup
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => {
            setIsOpen(false);
            setError("");
            setReturnedData(null);
          }}
          trigger={
            <button className="appointment-button">BOOK APPOINTMENT</button>
          }
          contentStyle={{
            width: "600px",
            maxWidth: "90vw",
            border: "none",
            background: "transparent",
          }}
          modal
        >
          {close => (
            <div className="popup-details">
              <div className="popup-header">
                <h5>{title}</h5>
                <button 
                  className="close-btn" 
                  onClick={() => {
                    close();
                    setError("");
                    setReturnedData(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                  {error}
                </Alert>
              )}
              
              {returnedData ? (
                <Alert variant="success" className="text-center">
                  <h5>✓ Appointment Booked Successfully!</h5>
                  <p className="mb-2">Your Appointment ID: <strong>{appointmentId}</strong></p>
                  <p className="mb-3">We've recorded your appointment details.</p>
                  <Button variant="primary" href="/" size="sm">
                    Go to Home Page
                  </Button>
                </Alert>
              ) : (
                <form onSubmit={onSubmit} className="appointment-form">
                  <div className="form-group">
                    <label htmlFor="doctor">Select Doctor *</label>
                    {loadingDoctors ? (
                      <div className="text-center py-2">
                        <Spinner animation="border" size="sm" />
                        <span className="ms-2">Loading doctors...</span>
                      </div>
                    ) : (
                      <select
                        name="doctor"
                        className="form-control"
                        required
                      >
                        <option value="">-- Choose a Doctor --</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.name} {doctor.phone ? `(${doctor.phone})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      defaultValue={props.fullDate1 ? new Date(props.fullDate1).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="time">Time *</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      defaultValue={time || "09:00"}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter your full name"
                      required
                      minLength="2"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="e.g., +1 234-567-8900"
                      required
                      pattern="[0-9+\-\s()]+"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="submit-button">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Booking...
                        </>
                      ) : (
                        'Book Appointment'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </Popup>
      </Card.Body>
    </Card>
  );
};

export default AppointmentType;
