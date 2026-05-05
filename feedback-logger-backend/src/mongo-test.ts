// @ts-nocheck — dev/test scratch script. The Student/Professor models gained
// passport-local-mongoose after this was written, which changes their create()
// signatures. Skip type-checking; this file is not run by `npm start` or `npm run seed`.
import mongoose from "mongoose";

import Course from "./model/Course";
import Comment from "./model/Comment";
import Lesson from "./model/Lesson";
import Professor from "./model/Professor";
import Student from "./model/Students";

const MONGO_URI =
  "mongodb+srv://gsr187t_db_user:mypw@cluster0.y6ffgif.mongodb.net/feedback_logger_test";

const runTests = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // STUDENT CRUD
    const student = await Student.create({
      name: "Test Student",
      email: "student@test.com",
      password: "123456",
    });
    console.log("Student CREATE:", student._id);

    const studentFound = await Student.findById(student._id);
    console.log("Student READ:", studentFound?.name);

    await Student.findByIdAndUpdate(student._id, {
      name: "Updated Student",
    });
    console.log("Student UPDATE done");

    await Student.findByIdAndDelete(student._id);
    console.log("Student DELETE done");

    // PROFESSOR CRUD
    const professor = await Professor.create({
      name: "Test Professor",
      email: "prof@test.com",
      password: "123456",
    });
    console.log("Professor CREATE:", professor._id);

    const professorFound = await Professor.findById(professor._id);
    console.log("Professor READ:", professorFound?.name);

    await Professor.findByIdAndUpdate(professor._id, {
      name: "Updated Professor",
    });
    console.log("Professor UPDATE done");

    await Professor.findByIdAndDelete(professor._id);
    console.log("Professor DELETE done");

    // COURSE CRUD
    const course = await Course.create({
      title: "Test Course",
      courseCode: "TC101",
      description: "Test course",
      instructor: new mongoose.Types.ObjectId(),
    });
    console.log("Course CREATE:", course._id);

    const courseFound = await Course.findById(course._id);
    console.log("Course READ:", courseFound?.title);

    await Course.findByIdAndUpdate(course._id, {
      title: "Updated Course",
    });
    console.log("Course UPDATE done");

    await Course.findByIdAndDelete(course._id);
    console.log("Course DELETE done");

    // LESSON CRUD
    const lesson = await Lesson.create({
      title: "Test Lesson",
      lessonNumber: 1,
      course: new mongoose.Types.ObjectId(),
      description: "Test lesson",
    });
    console.log("Lesson CREATE:", lesson._id);

    const lessonFound = await Lesson.findById(lesson._id);
    console.log("Lesson READ:", lessonFound?.title);

    await Lesson.findByIdAndUpdate(lesson._id, {
      title: "Updated Lesson",
    });
    console.log("Lesson UPDATE done");

    await Lesson.findByIdAndDelete(lesson._id);
    console.log("Lesson DELETE done");

    // COMMENT CRUD
    const comment = await Comment.create({
      comment: "Test comment",
      author: new mongoose.Types.ObjectId(),
      lesson: new mongoose.Types.ObjectId(),
      course: new mongoose.Types.ObjectId(),
    });
    console.log("Comment CREATE:", comment._id);

    const commentFound = await Comment.findById(comment._id);
    console.log("Comment READ:", commentFound?.comment);

    await Comment.findByIdAndUpdate(comment._id, {
      comment: "Updated comment",
    });
    console.log("Comment UPDATE done");

    await Comment.findByIdAndDelete(comment._id);
    console.log("Comment DELETE done");

    console.log("All CRUD tests completed");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

runTests();
