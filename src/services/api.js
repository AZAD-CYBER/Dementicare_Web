// API Service Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const ML_SERVICE_URL = process.env.REACT_APP_ML_URL || 'http://localhost:5000';

// Auth helper functions
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? JSON.parse(token) : null;
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('type');
};

// API service class
class APIService {
  // Auth endpoints
  async register(data) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async changePassword(oldPassword, newPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
    return this.handleResponse(response);
  }

  // Patient endpoints
  async getPatients() {
    const response = await fetch(`${API_BASE_URL}/api/patients`, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getPatient(id) {
    const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createPatient(data) {
    const response = await fetch(`${API_BASE_URL}/api/patients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async updatePatient(id, data) {
    const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async deletePatient(id) {
    const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Doctor endpoints
  async getDoctors() {
    const response = await fetch(`${API_BASE_URL}/api/doctors`, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Appointment endpoints
  async getAppointments() {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createAppointment(data) {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async updateAppointment(id, data) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async deleteAppointment(id) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Prescription endpoints
  async getPrescriptions(patientId = null) {
    const url = patientId 
      ? `${API_BASE_URL}/api/prescriptions?patient_id=${patientId}`
      : `${API_BASE_URL}/api/prescriptions`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createPrescription(data) {
    const response = await fetch(`${API_BASE_URL}/api/prescriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async updatePrescription(id, data) {
    const response = await fetch(`${API_BASE_URL}/api/prescriptions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async deletePrescription(id) {
    const response = await fetch(`${API_BASE_URL}/api/prescriptions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Quiz endpoints
  async getQuizResults(patientId = null) {
    const url = patientId 
      ? `${API_BASE_URL}/api/quiz/results?patient_id=${patientId}`
      : `${API_BASE_URL}/api/quiz/results`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async saveQuizResult(data) {
    const response = await fetch(`${API_BASE_URL}/api/quiz/results`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Job endpoints
  async getJobs() {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createJob(data) {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async updateJob(id, data) {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async deleteJob(id) {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // ML Service - Doctor Recommendation
  async recommendDoctor(location, experience) {
    const response = await fetch(`${API_BASE_URL}/api/recommend-doctor`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ location, experience })
    });
    return this.handleResponse(response);
  }

  // Contact form
  async submitContact(data) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Response handler
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    
    return data;
  }
}

export const apiService = new APIService();
export default apiService;
