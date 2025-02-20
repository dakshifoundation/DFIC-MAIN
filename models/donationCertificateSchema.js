const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    payment_id: { type: String, required: true, unique: true },
    donation: { type: Number, required: true },
    toward:  { type: String, default: "N/A" },
    modeOfDonation: { 
        type: String, 
        required: true, 
        enum: ['card', 'netbanking', 'wallet', 'upi', 'bank_transfer', 'emandate', 'cash', 'cod']
    },
    certificateId: { type: String, unique: true, required: true },
    certificateUrl: { type: String, required: true },
    emailSent: { type: Boolean, default: false }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
