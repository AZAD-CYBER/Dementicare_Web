import React from "react";
import "./Patients.css";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useEffect } from "react";
import { useState } from "react";
import apiService from "./services/api";
import FullHeight from "react-full-height";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const useStyle = makeStyles({
  table: {
    maxWidth: 1100,
  },
});

const Patients = () => {
  const classes = useStyle();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiService.getPatients();
        console.log('Patients data received:', data);
        
        // Handle both array and wrapped object formats
        let patientsArray = [];
        if (Array.isArray(data)) {
          patientsArray = data;
        } else if (data.patients) {
          patientsArray = data.patients;
        }
        
        console.log('Setting patients:', patientsArray);
        setPatients(patientsArray);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Failed to load patients");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  return (
    <div className="patients">
      <Link to="/dashboard">
        <BsArrowLeft /> Back
      </Link>
      <FullHeight>
        <div className="patientsTable">
          <h4>Patients</h4>
          <div className="patientsTableDetails">
            <p>All Patients</p>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress />
                <p style={{ marginTop: '20px', color: '#666' }}>Loading patients...</p>
              </div>
            ) : error ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                background: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffc107'
              }}>
                <p style={{ color: '#856404', margin: 0 }}>⚠️ {error}</p>
              </div>
            ) : patients.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '2px dashed #dee2e6'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
                <h5 style={{ color: '#666', marginBottom: '10px' }}>No Patients Found</h5>
                <p style={{ color: '#999' }}>
                  No patient records are available at the moment.
                </p>
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Sr. No</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">Gender</TableCell>
                      <TableCell align="left">Age</TableCell>
                      <TableCell align="left">Phone</TableCell>
                      <TableCell align="left">Address</TableCell>
                      <TableCell align="left">Diagnosis</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient, index) => (
                      <TableRow key={patient.id}>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">{patient.name}</TableCell>
                        <TableCell align="left">{patient.gender}</TableCell>
                        <TableCell align="left">{patient.age}</TableCell>
                        <TableCell align="left">{patient.phone}</TableCell>
                        <TableCell align="left">{patient.address}</TableCell>
                        <TableCell align="left">{patient.diagnosis}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </FullHeight>
    </div>
  );
};

export default Patients;
