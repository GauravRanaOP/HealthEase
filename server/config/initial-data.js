import "./db.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Clinic from "../models/Clinic.js";
import Address from "../models/Address.js";
import Patient from "../models/Patient.js";

(async () => {
  // inserts initial data for addresses
  const addresses = [
    {
      streetAddress: "1 Street",
      city: "London",
      province: "Ontario",
      country: "Canada",
      postCode: "N1P1W1",
    },
    {
      streetAddress: "2 Hollywood",
      city: "California",
      province: "Ontario",
      country: "Canada",
      postCode: "N2P2R2",
    },
    {
      streetAddress: "3 Neverland",
      city: "Victoria",
      province: "BC",
      country: "Canada",
      postCode: "N3P3H3",
    },
    {
      streetAddress: "4 Netherwood",
      city: "Barry",
      province: "Ontario",
      country: "Canada",
      postCode: "N4P4F4",
    },
  ];

  // create addresses
  const createdAddresses = await Address.create(addresses);
  console.log("Addresses inserted successfully");

  // inserts initial data for users
  const users = [
    {
      email: "doctor1@healthease.com",
      password: "doc1health",
      firstName: "Mary",
      lastName: "Smith",
      contactNo: "1234567890",
      userRole: "Doctor",
      address: {
        streetAddress: createdAddresses[0].streetAddress,
        city: createdAddresses[0].city,
        province: createdAddresses[0].province,
        country: createdAddresses[0].country,
        postCode: createdAddresses[0].postCode,
      },
    },
    {
      email: "doctor2@healthease.com",
      password: "doc2health",
      firstName: "Jack",
      lastName: "Paul",
      contactNo: "2234567890",
      userRole: "Doctor",
      address: {
        streetAddress: createdAddresses[1].streetAddress,
        city: createdAddresses[1].city,
        province: createdAddresses[1].province,
        country: createdAddresses[1].country,
        postCode: createdAddresses[1].postCode,
      },
    },
    {
      email: "doctor3@healthease.com",
      password: "doc3health",
      firstName: "Mathew",
      lastName: "Perry",
      contactNo: "3234567890",
      userRole: "Doctor",
      address: {
        streetAddress: createdAddresses[2].streetAddress,
        city: createdAddresses[2].city,
        province: createdAddresses[2].province,
        country: createdAddresses[2].country,
        postCode: createdAddresses[2].postCode,
      },
    },
    {
      email: "patient1@gmail.com",
      password: "pat1health",
      firstName: "James",
      lastName: "Bond",
      contactNo: "4234567890",
      userRole: "Patient",
      address: {
        streetAddress: createdAddresses[3].streetAddress,
        city: createdAddresses[3].city,
        province: createdAddresses[3].province,
        country: createdAddresses[3].country,
        postCode: createdAddresses[3].postCode,
      },
    },
  ];

  // create users
  const createdUsers = await User.create(users);
  console.log("Users for doctors inserted successfully");

  // inserts initial data for doctors
  const doctors = [
    {
      userid: createdUsers[0]._id,
      clinicId: null,
      speciality: "General Practitioner",
      availabilityId: null,
    },
    {
      userid: createdUsers[1]._id,
      clinicId: null,
      speciality: "Pediatrician",
      availabilityId: null,
    },
    {
      userid: createdUsers[2]._id,
      clinicId: null,
      speciality: "General Practitioner",
      availabilityId: null,
    },
  ];

  // create doctors
  const createdDoctors = await Doctor.create(doctors);
  console.log("Doctors inserted successfully");

  // initial data for clinic
  const clinics = [
    {
      name: "Clinic 1",
      address: {
        streetAddress: createdAddresses[0].streetAddress,
        city: createdAddresses[0].city,
        province: createdAddresses[0].province,
        country: createdAddresses[0].country,
        postCode: createdAddresses[0].postCode,
      },
      contactNo: "1231231111",
      email: "abc@gmail.com",
      doctorIds: [createdDoctors[0]._id],
    },
    {
      name: "Clinic 2",
      address: {
        streetAddress: createdAddresses[1].streetAddress,
        city: createdAddresses[1].city,
        province: createdAddresses[1].province,
        country: createdAddresses[1].country,
        postCode: createdAddresses[1].postCode,
      },
      contactNo: "1231232222",
      email: "def@gmail.com",
      doctorIds: [createdDoctors[1]._id],
    },
    {
      name: "Clinic 3",
      address: {
        streetAddress: createdAddresses[2].streetAddress,
        city: createdAddresses[2].city,
        province: createdAddresses[2].province,
        country: createdAddresses[2].country,
        postCode: createdAddresses[2].postCode,
      },
      contactNo: "1231233333",
      email: "ghi@gmail.com",
      doctorIds: [createdDoctors[2]._id],
    },
  ];

  // create clinic
  await Clinic.create(clinics);
  console.log("Clinics inserted successfully");

  // initial data for patients
  const patients = [
    {
      userId: createdUsers[3]._id,
      healthCardNo: "H11AA",
      dob: "1978-01-01",
      appointmentId: [],
    },
  ];
  // create patients
  await Patient.create(patients);
  console.log("Patients inserted successfully");

  process.exit();
})();
