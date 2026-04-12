import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    major: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    classYear: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: "/default-avatar.jpg",
    },
  },
  { timestamps: true },
);

const Professor = mongoose.model("Professor", professorSchema);

export default Professor;
