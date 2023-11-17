import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        completada: {
            type: Boolean,
            required: true,
            default: false
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    }
);

export default mongoose.model("Tarea", tareaSchema);