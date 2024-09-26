import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    streetAddress: {
        type: String
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    postCode: {
        type: String,
        required: true,
    },
});

// exports Address modal
const Address = mongoose.model('Address', AddressSchema);
export default Address;     // ES module