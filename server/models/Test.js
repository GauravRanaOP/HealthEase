import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

// export Test model
const Test = mongoose.model('Test', TestSchema);
export default Test; 