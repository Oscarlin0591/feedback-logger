import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

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

// passport-local-mongoose is CJS; the actual plugin function lives at `.default` at runtime
// even though the TS types claim the module export itself is the function.
const plmPlugin = (passportLocalMongoose as any).default ?? passportLocalMongoose;
professorSchema.plugin(plmPlugin, { usernameField: 'email', saltlen: 32 });

const Professor = mongoose.model("Professor", professorSchema);

export default Professor;
