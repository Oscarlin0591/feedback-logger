import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const studentSchema = new mongoose.Schema(
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

studentSchema.plugin(passportLocalMongoose.default, { usernameField: 'email', saltlen: 32 });

const Student = mongoose.model("Student", studentSchema);

export default Student;
