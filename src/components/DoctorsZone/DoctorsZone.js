import React, { useEffect } from "react";
import "./DoctorsZone.css";
import Calendar from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import Sidebar from "../Sidebar/Sidebar";
import FullHeight from "react-full-height";
import apiService from "../../services/api";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const DoctorsZone = () => {
  const [initialDate, setInitialDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const day = initialDate.getDate();
  const month = initialDate.getMonth();
  const year = initialDate.getFullYear();
  const fullDate = month + 1 + "/" + day + "/" + year;

  const handleChange = async (event, appointmentId) => {
    const selectedStatus = event.target.value;
    try {
      await apiService.updateAppointment(appointmentId, { status: selectedStatus });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await apiService.getAppointments();
      console.log('DoctorsZone appointments data:', data);
      
      // Handle both array and wrapped object formats
      let appointmentsArray = [];
      if (Array.isArray(data)) {
        appointmentsArray = data;
      } else if (data.appointments) {
        appointmentsArray = data.appointments;
      }
      
      setAppointments(appointmentsArray.reverse());
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  const selectedDateAppointment = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate.toLocaleDateString() === initialDate.toLocaleDateString();
  });

  return (
    <div className="doctorsZone">
      <Sidebar></Sidebar>
      <div className="zoneAppointment">
        <div>
          <h4>Appointment</h4>
          <Calendar
            className="calender"
            value={initialDate}
            onChange={(date) => setInitialDate(date)}
          ></Calendar>
        </div>
        {loading ? (
          <CircularProgress />
        ) : appointments.length > 0 ? (
          <FullHeight>
            <div className="appointmentTable">
              <div className="tableHeading">
                <p>Appointment</p>
                <p>{fullDate}</p>
              </div>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="center">Schedule</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDateAppointment.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell align="left">
                          Patient ID: {appointment.patient_id}
                        </TableCell>
                        <TableCell align="center">{appointment.time}</TableCell>
                        <TableCell align="right">
                          <Select
                            className="actionSelect"
                            value={appointment.status}
                            onChange={(e) => handleChange(e, appointment.id)}
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
            </div>
          </FullHeight>
        ) : (
          <div
            style={{ margin: "400px 200px" }}
            className="spinner-border text-success"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsZone;
