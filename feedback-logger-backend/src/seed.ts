import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Professor from './model/Professor';
import Student from './model/Students';
import Course from './model/Course';
import Lesson from './model/Lesson';

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/feedback-logger');
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password', 10);

    // ── Professors (course instructors) ──────────────────────────────────────
    const professorData = [
        { name: 'Professor Johnson', email: 'johnson@qu.edu', major: 'Mathematics',         department: 'School of Computing and Engineering' },
        { name: 'Professor Shah',    email: 'shah@qu.edu',    major: 'Computer Science',    department: 'School of Computing and Engineering' },
        { name: 'Professor Blake',   email: 'blake@qu.edu',   major: 'Computer Science',    department: 'School of Computing and Engineering' },
        { name: 'Professor ElKharboutly', email: 'elkh@qu.edu', major: 'Software Engineering', department: 'School of Computing and Engineering' },
    ];

    const professors = [];
    for (const data of professorData) {
        const prof = await Professor.findOneAndUpdate(
            { email: data.email },
            { ...data, password: hashedPassword },
            { upsert: true, new: true }
        );
        professors.push(prof!);
    }
    console.log(`Seeded ${professors.length} course professors`);

    // ── Admin user (stored as Professor so GET /api/profile finds them) ───────
    await Professor.findOneAndUpdate(
        { email: 'admin@qu.edu' },
        {
            name: 'Alice Admin',
            email: 'admin@qu.edu',
            password: hashedPassword,
            major: 'Computer Science Ph.D',
            department: 'School of Computing and Engineering',
            classYear: 2006,
        },
        { upsert: true, new: true }
    );
    console.log('Seeded admin user (admin@qu.edu)');

    // ── Student user ─────────────────────────────────────────────────────────
    await Student.findOneAndUpdate(
        { email: 'user@qu.edu' },
        {
            name: 'John User',
            email: 'user@qu.edu',
            password: hashedPassword,
            major: 'Software Engineer',
            department: 'School of Computing and Engineering',
            classYear: 2027,
        },
        { upsert: true, new: true }
    );
    console.log('Seeded student user (user@qu.edu)');

    // ── Courses + 24 lessons each ─────────────────────────────────────────────
    const courseData = [
        { title: 'MA-229', courseCode: 'MA-229', description: 'Applied Statistics',    professorIdx: 0 },
        { title: 'SER-325', courseCode: 'SER-325', description: 'Database Systems',    professorIdx: 1 },
        { title: 'CSC-310', courseCode: 'CSC-310', description: 'Operating Systems',   professorIdx: 2 },
        { title: 'CSC-340', courseCode: 'CSC-340', description: 'Full Stack Development', professorIdx: 3 },
    ];

    for (const data of courseData) {
        const course = await Course.findOneAndUpdate(
            { courseCode: data.courseCode },
            {
                title: data.title,
                courseCode: data.courseCode,
                description: data.description,
                instructor: professors[data.professorIdx]._id,
            },
            { upsert: true, new: true }
        );

        const lessonIds = [];
        for (let i = 1; i <= 24; i++) {
            const lesson = await Lesson.findOneAndUpdate(
                { course: course!._id, lessonNumber: i },
                {
                    title: `Lesson ${i}`,
                    lessonNumber: i,
                    course: course!._id,
                    description: `This is Lesson ${i}`,
                },
                { upsert: true, new: true }
            );
            lessonIds.push(lesson!._id);
        }

        // Keep course.lessons in sync with the 24 upserted lessons
        await Course.updateOne({ _id: course!._id }, { $set: { lessons: lessonIds } });
        console.log(`Seeded course ${data.courseCode} with 24 lessons`);
    }

    await mongoose.disconnect();
    console.log('\nSeeding complete! Users: user@qu.edu / admin@qu.edu (password: "password")');
}

seed().catch((err: unknown) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
