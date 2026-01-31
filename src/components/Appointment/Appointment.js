import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import "./Appointment.css";
import image from "../../image/bgimg.jpg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import appointmentData from "../../data/AppointmentData";
import AppointmentType from "../AppointmentType/AppointmentType";

import { ErrorBoundary } from "react-error-boundary";

const Appointment = () => {
  function ErrorFallback() {
    return <h1>Oops, something went wrong!</h1>;
  }
  const type = localStorage.getItem("type");
  const T="doctor"
  console.log(type);
  
  const [startDate, setStartDate] = useState(new Date());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = startDate.getDate();
  const month = months[startDate.getMonth()];
  const month1 = startDate.getMonth();
  const year = startDate.getFullYear();
  const fullDate = day + " " + month + " " + year;
  const fullDate1 = month1 + 1 + "/" + day + "/" + year;

  return (
    <div className="appointmentInfo">
      <div className="patientAppointment">
        <div className="doctorNav">
          <Nav className="justify-content-end">
            <Nav.Item>
              <Nav.Link className="navLink" href="/">
                Home
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
                            <Nav.Link className="navLink" href="/reviews">Reviews</Nav.Link>
                        </Nav.Item> */}
            <Nav.Item>
            {type=== "doctor"?  ( <Nav.Link className="navLink" href="/dashboard">
                Doctors Dashboard
              </Nav.Link> ):null }
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="navLink" href="/contactUs">
                Contact Us
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="mainBody">
          <div>
            <div className="appointmentText">
              <h1>Appointment</h1>
              <div>
                <div>
                  <Calendar
                    className="calender"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="doctorImg">
              <img src={image} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="appointmentDetails">
        <h3>Available Appointments on {fullDate}</h3>
        <p style={{color: '#666', marginTop: '10px'}}>Select a time slot to book your appointment</p>
      </div>
      <div className="container">
        <div className="row">
          {appointmentData.map((app) => (
            <div className="col-md-4 col-sm-6 col-12 mb-4" key={app.key}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppointmentType
                  appointmentData={app}
                  fullDate1={fullDate1}
                />
              </ErrorBoundary>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
