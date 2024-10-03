# HealthEase Web Application

![HealthEase Logo](frontend/src/assets/images/logo.png)

**HealthEase** aims to enhance healthcare services in the Canadian market by offering a user-friendly application with the following features:

- **Search for Skilled Healthcare Physicians:** Find doctors by geolocation.
- **In-Home Lab Tests Scheduling:** Schedule lab tests from the comfort of your home.
- **Appointment Bookings:** Easily book appointments with healthcare providers.
- **Test Status Tracking:** Keep track of your lab test results.

## Features

| Module               | Description                              |
|---------------------|------------------------------------------|
| **Clinics**         | Manage clinic information and schedules.|
| **Diagnostic Centers** | Access and manage lab test data.      |
| **Patients**        | Patient profiles and history management.|
| **Administration**  | Admin tools for user and data management.|

## Getting Started

Follow these steps to launch the application:

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
- Have a MongoDB instance set up for data storage.

### Installation

1. **Install Dependencies:**
   - Navigate to the `frontend` directory and run:
        cd frontend
        npm install
     
   - Then, navigate to the `server` directory and run:
        cd server
        npm install

2. **Start the Backend Server:**
   - From the `server` directory, execute:
        npm start
     
   - You should see messages indicating that the backend server is running:
        HealthEase app is listening on port 3002
        MongoDB Connected..

3. **Start the Frontend Server:**
   - From the `frontend` directory, execute:
        npm run dev
     
   - The application should now be running at `http://localhost:5174/` (port may vary depending on availability).
