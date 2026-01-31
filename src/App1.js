import React from "react";
import "./Dashboard.css";
import { useEffect } from "react";
import { useState } from "react";
import Sidebar from ".././src/components/Sidebar/Sidebar";
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
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import FullHeight from "react-full-height";
import apiService from './services/api';

const useStyles = makeStyles({
  table: {
    maxWidth: 1300,
  },
});

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await apiService.getAppointments();
        console.log('App1 appointments data:', data);
        
        // Handle both array and wrapped object formats
        let appointmentsArray = [];
        if (Array.isArray(data)) {
          appointmentsArray = data;
        } else if (data.appointments) {
          appointmentsArray = data.appointments;
        }
        
        setAppointments(appointmentsArray);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleChange = async (event, appointmentId) => {
    const newStatus = event.target.value;
    try {
      await apiService.updateAppointment(appointmentId, { status: newStatus });
      console.log("Appointment successfully updated!");
      // Refresh appointments
      const data = await apiService.getAppointments();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const pendingAppointments = appointments.filter(
    (pa) => pa.status === "pending"
  );

  return (
    <div className="dashboard">
      <Sidebar></Sidebar>
  
        <FullHeight>
          <div className="dashboardTable">
            <h4>Dashboard</h4>
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
                <p>Recent Appointments</p>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Sr. No</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Time</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Contact</TableCell>
                        <TableCell align="center">Prescription</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appoint, index) => (
                        <TableRow key={appoint.id}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="center">
                            {new Date(appoint.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">{appoint.time}</TableCell>
                          <TableCell align="left">{appoint.patient_id}</TableCell>
                          <TableCell align="center">{appoint.notes || 'N/A'}</TableCell>
                          <TableCell align="center">Not Added</TableCell>
                          <TableCell align="center">
                            <Select
                              style={{ color: "white" }}
                              className="actionSelect"
                              value={appoint.status}
                              onChange={(e) => handleChange(e, appoint.id)}
                            >
                              <MenuItem value={"pending"}>Pending</MenuItem>
                              <MenuItem value={"confirmed"}>Confirmed</MenuItem>
                              <MenuItem value={"completed"}>Completed</MenuItem>
                              <MenuItem value={"cancelled"}>Cancelled</MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
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
