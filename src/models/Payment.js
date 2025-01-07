import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], required: true },
    paymentMethod: { type: String },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;