import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import apiService from "../services/api";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cnfm_password, setCnfm_password] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== cnfm_password) {
      setErrorMessage("Passwords do not match");
      setSuccessMessage("");
      return;
    } else {
      setErrorMessage("");
    }

    try {
      await apiService.changePassword(oldPassword, newPassword);
      
      setSuccessMessage("Password changed successfully!");
      setErrorMessage("");
      setOldPassword("");
      setNewPassword("");
      setCnfm_password("");
    } catch (error) {
      setErrorMessage(error.message || "Password change failed");
      setSuccessMessage("");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={cnfm_password}
                onChange={(event) => setCnfm_password(event.target.value)}
              />
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
