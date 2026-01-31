import React, { useState, useEffect } from "react";
import "./Prescription.css";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import FullHeight from "react-full-height";
import apiService from "./services/api";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const useStyle = makeStyles({
  table: {
    maxWidth: 1300,
  },
});

const Prescription = () => {
  const classes = useStyle();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPrescription, setNewPrescription] = useState({
    patient_id: "",
    medication: "",
    dosage: "",
    frequency: "",
    instructions: ""
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const data = await apiService.getPrescriptions();
      setPrescriptions(data.prescriptions || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await apiService.getPatients();
      setPatients(data.patients || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleSavePrescription = async () => {
    try {
      await apiService.createPrescription(newPrescription);
      setNewPrescription({
        patient_id: "",
        medication: "",
        dosage: "",
        frequency: "",
        instructions: ""
      });
      fetchPrescriptions();
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  return (
    <div className="prescription">
      <Link to="/dashboard">
        <BsArrowLeft /> Back
      </Link>
      <FullHeight>
        <div className="prescriptionTable">
          <h4>Prescription</h4>
          <div className="prescriptionTableDetails">
            <p>Create New Prescription</p>
            <TextField
              label="Patient ID"
              type="number"
              value={newPrescription.patient_id}
              onChange={(e) => setNewPrescription({...newPrescription, patient_id: e.target.value})}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Medication"
              value={newPrescription.medication}
              onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Dosage"
              value={newPrescription.dosage}
              onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instructions"
              value={newPrescription.instructions}
              onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePrescription}
              style={{ marginTop: '10px' }}
            >
              Save Prescription
            </Button>

            <p style={{ marginTop: '20px' }}>All Prescriptions</p>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr. No</TableCell>
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prescriptions.map((prescription, index) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{prescription.patient_id}</TableCell>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{new Date(prescription.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </FullHeight>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <div>
              <p><strong>Medication:</strong> {selectedPrescription.medication}</p>
              <p><strong>Dosage:</strong> {selectedPrescription.dosage}</p>
              <p><strong>Frequency:</strong> {selectedPrescription.frequency}</p>
              <p><strong>Instructions:</strong> {selectedPrescription.instructions}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Prescription;
