import Clinic from "../models/Clinic.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Address from "../models/Address.js";


// controller function to fetch doctors by post code prefix
export const getDoctorsByPostcodePrefix = async (req, res ) => {
    const { postcodePrefix } = req.params;

    try {
        // finds clinics by postcode prefix
        const clinics = await Clinic.find({
            'address.postCode': { $regex: `^${postcodePrefix}` }
        });

        if (!clinics.length) {
            return res.status(404).json({
                message: "No clinics found in the provided postal code"
            });
        }

        // extracts the clinics ids and address 
        const clinicData = clinics.map(clinic => ({
            clinicId: clinic._id,
            clinicAddress: clinic.address
            })
        );

        // finds doctors by clinic ids
        const clinicIds = clinicData.map(clinic => clinic.clinicId);
        const doctors = await Doctor.find({
            clinicId: { $in: clinicIds }
        }).populate('userid', 'firstName lastName email contactNo');

        // checks if any doctors were found
        if (!doctors.length) {
            return res.status(404).json({
                message: "No doctors found in the postcode"
            });
        }

        // // sends the doctors data in the response
        // res.status(200).json(doctors);

        // combines doctor and clinic address 
        const doctorWithClinics = doctors.map(doctor => {
            const clinic = clinicData.find( c => String(c.clinicId) === String(doctor.clinicId));
            return {
                doctorId: doctor._id,
                firstName: doctor.userid.firstName,
                lastName: doctor.userid.lastName,
                email: doctor.userid.email,
                contactNo: doctor.userid.contactNo,
                speciality: doctor.speciality,
                clinicAddress: clinic.clinicAddress
            };
        });

        // sends doctor and clinic data
        res.status(200).json(doctorWithClinics);

    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({
            error: error
        });
    }

};  // end getDoctorsByPostcodePrefix
