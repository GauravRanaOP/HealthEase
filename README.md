# HealthEase Web Application

![HealthEase Logo](client/src/assets/images/logo.png)

**HealthEase** Application aims to improve existing healthcare services in the Canadian market. The application includes features such as:

- **Search for Skilled Healthcare Physicians:** Find doctors by geolocation.
- **In-Home Lab Tests Scheduling:** Schedule lab tests from the comfort of your home.
- **Appointment Bookings:** Easily book appointments with healthcare providers.
- **Test Status Tracking:** Keep track of your lab test results.

> ### Features

| Module               | Description                              |
|---------------------|------------------------------------------|
| 🏥 **Clinics/Doctors**    | Manage clinic and its doctors information and schedules.|
| 🧪 **Diagnostic Centers** | Access and manage lab test data.      |
| 🧑🏻 **Patients**           | Patient profiles and history management.|
| 🔧 **Administration**     | Admin tools for user and data management.|

> ### Getting Started

Follow these steps to launch the application:

> ### Prerequisites

- Ensure you have [`Node.js`](https://nodejs.org/) installed on your machine.
- Have a MongoDB instance set up for data storage.

> ### Installation

1. **Install Dependencies:**

   - Navigate to the `client` directory and run:
  
     ```bash
     cd client
     npm install
     
   - Then, navigate to the `server` directory and run:
  
     ```bash
     cd server
     npm install

2. **Start the Backend Server:**

   - From the `server` directory, execute:
  
     ```bash
     npm start
     
   - You should see messages indicating that the backend server is running:
  
     ```bash
     HealthEase app is listening on port 3002
     MongoDB Connected..

3. **Start the Client Server:**

   - From the `client` directory, execute:
  
     ```bash
     npm run dev
     
   - The application should now be running at `http://localhost:5173/` (port may vary depending on availability).
