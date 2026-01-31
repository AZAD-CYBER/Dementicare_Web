import React from "react";
import "./Dashboard.css";
import { useEffect } from "react";
import { useState } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import FullHeight from "react-full-height";
import apiService from '../../services/api';

const useStyles = makeStyles({
  table: {
    maxWidth: 1300,
  },
});

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
 
  const todaysDate = new Date();
  const day = todaysDate.getDate();
  const month = todaysDate.getMonth();
  const year = todaysDate.getFullYear();
  const fullTodaysDate = month + 1 + "/" + day + "/" + year;
  
  const selectedDateAppointment = appointments.filter(
    (appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toLocaleDateString() === new Date(fullTodaysDate).toLocaleDateString();
    }
  );

  const handleChange = async (event, appointmentId) => {
    const newStatus = event.target.value;
    try {
      await apiService.updateAppointment(appointmentId, { status: newStatus });
      console.log("Appointment successfully updated!");
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const pendingAppointments = appointments.filter(
    (pa) => pa.status === "pending"
  );

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      console.log("=== Fetching appointments ===");
      console.log("Token:", localStorage.getItem('token'));
      console.log("API URL:", 'http://localhost:8080/api/appointments');
      
      const data = await apiService.getAppointments();
      console.log("Raw response data:", data);
      console.log("Type of data:", typeof data);
      console.log("Is array:", Array.isArray(data));
      
      // Handle both array and wrapped object formats
      let appointmentsArray = [];
      if (Array.isArray(data)) {
        console.log("Data is array, using directly");
        appointmentsArray = data;
      } else if (data && data.appointments) {
        console.log("Data has appointments property, extracting");
        appointmentsArray = data.appointments;
      } else {
        console.log("Data format unexpected:", data);
      }
      
      console.log("Final appointments array:", appointmentsArray);
      console.log("Array length:", appointmentsArray.length);
      
      setAppointments(appointmentsArray);
      console.log("State updated successfully");
    } catch (error) {
      console.error("=== Error fetching appointments ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      setAppointments([]);
    } finally {
      setLoading(false);
      console.log("=== Fetch complete ===");
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <FullHeight>
        <div className="dashboardTable">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4>Dashboard</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ 
                padding: '8px 16px', 
                background: appointments.length > 0 ? '#28a745' : '#ffc107',
                color: 'white',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                {appointments.length} Appointments
              </span>
              <button 
                onClick={fetchAppointments}
                style={{
                  padding: '8px 16px',
                  background: '#19D3AE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CircularProgress />
              <p style={{ marginTop: '20px', color: '#666' }}>Loading appointments...</p>
            </div>
          ) : (
            <>
              <div className="dashboardHeading">
                <div style={{ backgroundColor: "tomato" }}>
                  <h1>{pendingAppointments.length}</h1>
                  <p>
                    Pending
                    <br />
                    Appointments
                  </p>
                </div>
                <div style={{ backgroundColor: "deepskyblue" }}>
                  <h1>{selectedDateAppointment.length}</h1>
                  <p>
                    Today's
                    <br />
                    Appointments
                  </p>
                </div>
                <div style={{ backgroundColor: "mediumseagreen" }}>
                  <h1>{appointments.length}</h1>
                  <p>
                    Total
                    <br />
                    Appointments
                  </p>
                </div>
                <div style={{ backgroundColor: "orange" }}>
                  <h1>{appointments.length}</h1>
                <p>
                  Total
                  <br />
                  Patients
                </p>
              </div>
            </div>
            <div className="dashboardTableDetails">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Recent Appointments</p>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    Total: {appointments.length}
                  </span>
                </div>
                {appointments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    border: '2px dashed #dee2e6'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📅</div>
                    <h5 style={{ color: '#666', marginBottom: '10px' }}>No Appointments Yet</h5>
                    <p style={{ color: '#999', marginBottom: '20px' }}>
                      Book your first appointment to get started
                    </p>
                    <a 
                      href="/appointment" 
                      style={{
                        display: 'inline-block',
                        padding: '10px 24px',
                        background: '#19D3AE',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}
                    >
                      Book Appointment
                    </a>
                  </div>
                ) : (
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Sr. No</TableCell>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">Time</TableCell>
                          <TableCell align="left">Patient</TableCell>
                          <TableCell align="left">Doctor</TableCell>
                          <TableCell align="left">Type</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {appointments.map((appoint, index) => (
                          <TableRow key={appoint.id}>
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="center">
                              {new Date(appoint.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell align="center">{appoint.time}</TableCell>
                            <TableCell align="left">
                              {appoint.patient_name || `Patient #${appoint.patient_id}`}
                            </TableCell>
                            <TableCell align="left">
                              Dr. {appoint.doctor_name || `Doctor #${appoint.doctor_id}`}
                            </TableCell>
                            <TableCell align="left">
                              <strong>{appoint.type}</strong>
                              {appoint.notes && (
                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                  {appoint.notes.substring(0, 50)}...
                                </div>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                backgroundColor: appoint.status === 'pending' ? '#ffc107' : 
                                                 appoint.status === 'confirmed' ? '#28a745' : 
                                                 appoint.status === 'completed' ? '#007bff' : '#dc3545',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}>
                                {appoint.status.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              <Select
                                style={{ color: "white", minWidth: '120px' }}
                                className="actionSelect"
                                value={appoint.status}
                                onChange={(e) => handleChange(e, appoint.id)}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          </>
          )}
        </div>
      </FullHeight>
      {/* ) : (
        <FullHeight>
          <div style={{ margin: "350px 550px", display: "flex" }}>
            <div className="spinner-grow text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </FullHeight>
      )} */}
    </div>
  );
};

export default Dashboard;
