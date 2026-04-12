import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    lessonNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);

lessonSchema.index({ course: 1, lessonNumber: 1 }, { unique: true });

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
