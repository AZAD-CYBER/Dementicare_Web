import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Alert,
  Badge,
  Spinner
} from "react-bootstrap";
import apiService from "../../services/api";
import { Link } from "react-router-dom";
import { 
  BsArrowLeft, 
  BsBriefcase, 
  BsBuilding, 
  BsGeoAlt, 
  BsClock, 
  BsCurrencyDollar,
  BsFileText,
  BsCheckCircle,
  BsPlusCircle,
  BsTrash
} from "react-icons/bs";
import "./Jobs.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    description: "",
    requirements: "",
    salary: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await apiService.getJobs();
      console.log("Fetched jobs:", data);
      console.log("Type of data:", typeof data);
      console.log("Is array:", Array.isArray(data));
      
      // Handle both direct array and wrapped object response
      const jobsArray = Array.isArray(data) ? data : (data.jobs || []);
      console.log("Jobs array:", jobsArray);
      console.log("Jobs length:", jobsArray.length);
      
      setJobs(jobsArray);
      console.log("State updated, jobs:", jobsArray);
      setError("");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await apiService.createJob(newJob);
      console.log("Job created:", result);
      setShowModal(false);
      setNewJob({
        title: "",
        company: "",
        location: "",
        type: "full-time",
        description: "",
        requirements: "",
        salary: ""
      });
      await fetchJobs(); // Refresh the job list
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.message || "Failed to create job");
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await apiService.deleteJob(id);
        fetchJobs();
      } catch (err) {
        console.error("Error deleting job:", err);
        setError(err.message || "Failed to delete job");
      }
    }
  };

  return (
    <Container className="jobs-container mt-4 pb-5">
      <div className="mb-3">
        <Link to="/dashboard" className="back-link">
          <BsArrowLeft size={20} /> <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <div className="jobs-header mb-4">
        <div>
          <h1 className="jobs-title">
            <BsBriefcase className="me-2" />
            Caregiver Job Opportunities
          </h1>
          <p className="jobs-subtitle">Find your next career opportunity in dementia care</p>
        </div>
        <Button
          variant="success"
          size="lg"
          onClick={() => setShowModal(true)}
          className="post-job-btn"
        >
          <BsPlusCircle className="me-2" />
          Post New Job
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Loading job opportunities...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <BsBriefcase size={80} className="empty-icon" />
          <h3>No Jobs Posted Yet</h3>
          <p>Be the first to post a job opportunity for caregivers!</p>
          <Button variant="success" size="lg" onClick={() => setShowModal(true)}>
            <BsPlusCircle className="me-2" />
            Post Your First Job
          </Button>
        </div>
      ) : (
        <>
          <div className="jobs-count mb-4">
            <Badge bg="success" className="count-badge">
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Available
            </Badge>
          </div>
          <Row>
            {jobs.map((job) => {
              console.log("Rendering job:", job);
              const getTypeBadge = (type) => {
                const badges = {
                  'full-time': 'success',
                  'part-time': 'info',
                  'contract': 'warning'
                };
                return badges[type] || 'secondary';
              };
              
              return (
                <Col md={6} lg={4} key={job.id} className="mb-4">
                  <Card className="job-card h-100">
                    <Card.Body className="d-flex flex-column">
                      <div className="job-header mb-3">
                        <h5 className="job-title mb-2">
                          <BsBriefcase className="me-2" />
                          {job.title}
                        </h5>
                        <Badge bg={getTypeBadge(job.type)} className="type-badge">
                          <BsClock className="me-1" />
                          {job.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="job-details mb-3">
                        <div className="detail-item">
                          <BsBuilding className="me-2 text-muted" />
                          <span>{job.company || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <BsGeoAlt className="me-2 text-muted" />
                          <span>{job.location || 'N/A'}</span>
                        </div>
                        {job.salary && job.salary !== '-' && (
                          <div className="detail-item">
                            <BsCurrencyDollar className="me-2 text-muted" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="job-description mb-3">
                        <div className="description-label">
                          <BsFileText className="me-2" />
                          <strong>Description</strong>
                        </div>
                        <p className="description-text">{job.description}</p>
                      </div>
                      
                      {job.requirements && job.requirements !== '-' && (
                        <div className="job-requirements mb-3">
                          <div className="requirements-label">
                            <BsCheckCircle className="me-2" />
                            <strong>Requirements</strong>
                          </div>
                          <p className="requirements-text">{job.requirements}</p>
                        </div>
                      )}
                      
                      <div className="mt-auto">
                        <div className="job-actions">
                          <Button variant="primary" className="apply-btn flex-grow-1">
                            Apply Now
                          </Button>
                          <Button
                            variant="outline-danger"
                            className="delete-btn"
                            onClick={() => handleDeleteJob(job.id)}
                            title="Delete job"
                          >
                            <BsTrash />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="job-footer">
                      <small className="text-muted">
                        Posted: {new Date(job.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      {/* Create Job Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="job-modal">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <BsBriefcase className="me-2" />
            Post New Job Opportunity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreateJob}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Type</Form.Label>
                  <Form.Select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Salary (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., $50,000 - $70,000"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)} size="lg">
                Cancel
              </Button>
              <Button variant="success" type="submit" size="lg">
                <BsPlusCircle className="me-2" />
                Post Job
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Jobs;
