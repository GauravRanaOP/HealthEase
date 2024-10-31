import Clinic from "../models/Clinic.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Address from "../models/Address.js";


// controller function to fetch doctors by post code prefix
export const getDoctorsByPostcodePrefix = async (req, res ) => {
    const { postcodePrefix } = req.params;

    try {
        // finds clinics where address matches the postcode prefix
        // const clinics = await Clinic.find({
        //     'address.postCode': { $regex: `^${postcodePrefix}` }
        // });

        const clinics = await Clinic.find().populate({
            path: 'addressId',
            match: { postCode: {$regex: `^${postcodePrefix}` } }
        });

        // if (!clinics.length) {
        //     return res.status(404).json({
        //         message: "No clinics found in the provided postal code"
        //     });
        // }

        // filters out any clinic where the address did not match the postcode
        const filteredClinics = clinics.filter(clinic => clinic.addressId);
        if (!filteredClinics.length) {
            return res.status(404).json({
                message: "No clinics found in the provided postal code"
            });
        }

        // extracts the clinics ids and address 
        // const clinicData = clinics.map(clinic => ({
        //     clinicId: clinic._id,
        //     clinicAddress: clinic.address
        //     })
        // );
        const clinicData = filteredClinics.map(clinic => ({
            clinicId: clinic._id,
            clinicAddress: clinic.addressId
            })
        );
        
        // gets clinic ids
        const clinicIds = clinicData.map(clinic => clinic.clinicId);

        // finds doctors by clinicid and populates user details
        const doctors = await Doctor.find({
            clinicId: { $in: clinicIds }
        }).populate('userid', 'firstName lastName email contactNo');

        // checks if any doctors were found
        if (!doctors.length) {
            return res.status(404).json({
                message: "No doctors found in the postcode"
            });
        }

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
            error: error.message
        });
    }

};  // end getDoctorsByPostcodePrefix
