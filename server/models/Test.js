import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    diagnosticCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiagnosticCenter'
    }
});

// export Test model
const Test = mongoose.model('Test', TestSchema);
module.exports = Test;