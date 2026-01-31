import React, { useState } from "react";
import { Form, Button, Row, Col, ListGroup, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import apiService from "../services/api";

function Doctor() {
  const [formData, setFormData] = useState({
    rating: "",
    experience: "",
  });

  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [doctorContacts, setDoctorContacts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await apiService.recommendDoctor(
        parseInt(formData.rating),
        parseInt(formData.experience)
      );
      
      if (response.data) {
        setRecommendedDoctors(response.data.recommended_doctors || []);
        setDoctorContacts(response.data.contacts || []);
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  return (
<><Link to="/quiz">
    <BsArrowLeft /> Back
  </Link>
    <Row className="justify-content-md-center mt-5">
      <Col md={6}>
        <h3 className="text-center mb-4" style={{color:"#19D3AE"}}>Find a Recommended Doctor</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRating" className="mb-3">
            <Form.Label>Doctor Rating (1-5):</Form.Label>
            <Form.Control
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Enter desired rating (1-5)"
              required
            />
          </Form.Group>
          <Form.Group controlId="formExperience" className="mb-3">
            <Form.Label>Minimum Experience (Years):</Form.Label>
            <Form.Control
              type="number"
              name="experience"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Enter minimum years of experience"
              required
            />
          </Form.Group>
          <center>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Get Recommendations"}
            </Button>
          </center>
        </Form>

        {recommendedDoctors.length > 0 && doctorContacts.length >= 0 && (
          <Row className="mt-4">
            <Col>
              <ListGroup>
                <ListGroup.Item  variant="success" >Recommended Doctors:</ListGroup.Item>
                {recommendedDoctors.map((doctor, index) => (
                  <ListGroup.Item key={index}>{doctor}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <ListGroup>
                <ListGroup.Item variant="success">Contact:</ListGroup.Item>
                {doctorContacts.map((contact, index) => (
                  <ListGroup.Item key={index}>{contact}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
    </>
  );
}

export default Doctor;
