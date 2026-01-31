import { useState } from "react";
import apiService from "../services/api";
import { Modal, Button } from "react-bootstrap";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiService.submitContact({
        name,
        email,
        message,
      });

      // Reset form values after submission
      setName("");
      setEmail("");
      setMessage("");

      // Show modal after successful submission
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to submit contact form");
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="contactUs">
      <div>
        <h4>Contact Us</h4>
        <h1>Always contact with us</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="contactUsDetails">
              <div>
                <input
                  placeholder="Name*"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <br />
                <input
                  placeholder="Email Address*"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />
                <textarea
                  placeholder="Your Message*"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="4"
                />
                <br />
                {error && <p style={{color: 'red'}}>{error}</p>}
                <Button className="submitBtn" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your form has been submitted successfully.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
