import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Alert, Row, Col } from "react-bootstrap";
import logo from "../Images/header_logo.png";
import { Link } from "react-router-dom";
import apiService from "../services/api";

function Registration() {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [cnfm_password, setCnfm_password] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [userType, setUserType] = React.useState("patient");
  const [error, setError] = React.useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (password !== cnfm_password) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      return;
    }
    
    try {
      const data = await apiService.register({
        email,
        name,
        password,
        user_type: userType,
        phone: phone || "",
      });

      setShowAlert(true);
      setAlertMessage("Successful registration! You can now login.");
      console.log("User registered successfully:", data);
      
      // Clear form
      setEmail("");
      setName("");
      setPassword("");
      setCnfm_password("");
      setPhone("");
      
    } catch (error) {
      setError(error.message);
      setAlertMessage(error.message || "Registration failed");
      setShowAlert(true);
      console.log("error:", error);
    }
  }

  return (
    <Row>
      <Col
        md={6}
        className="d-flex justify-content-center  align-items-center "
      >
        <img src={logo} alt="logo" className="img-fluid hover-shadow" />
      </Col>
      <Col md={6}>
        <div style={{ padding: "30px" }}>
          <Form onSubmit={handleSubmit}>
            <center>
              <h1 style={{ color: "#009A75", padding: "25px" }}>Register</h1>
            </center>
            <Row>
              <Col md={6}>
                {" "}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {" "}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+1 234-567-8900"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>I am a:</Form.Label>
                  <Form.Control
                    as="select"
                    name="userType"
                    onChange={(e) => setUserType(e.target.value)}
                    value={userType}
                    required
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="caregiver">Caregiver</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                {" "}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                {" "}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label> Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="cnfm_password"
                    placeholder="Confirm Password"
                    onChange={(e) => setCnfm_password(e.target.value)}
                    value={cnfm_password}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <center>
              <Button style={{ background: "#009A75" }} type="submit">
                Register
              </Button>
            </center>
          </Form>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              <Alert.Heading>Successful</Alert.Heading>
              <p>{alertMessage}</p>
            </Alert>
          )}
          <p
            style={{
              textAlign: "center",
              paddingTop: "10px",
            }}
          >
            <Link
              to="/Login"
              style={{
                color: "black",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Already have a account?{" "}
              <span style={{ color: "#009A75" }}>Login</span>
            </Link>
          </p>
        </div>
      </Col>
    </Row>
  );
}

export default Registration;
