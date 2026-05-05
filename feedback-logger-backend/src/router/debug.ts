import { Router, type Request, type Response } from 'express';
import Course from '../model/Course';
import Student from '../model/Students';
import Professor from '../model/Professor';

const debugRouter = Router();

// GET /api/debug/professors
debugRouter.get('/professors', async (_req: Request, res: Response) => {
    const professors = await Professor.find({}, 'name email').lean();
    res.json(professors);
});

// GET /api/debug/students
debugRouter.get('/students', async (_req: Request, res: Response) => {
    const students = await Student.find({}, 'name email courses').lean();
    res.json(students);
});

// GET /api/debug/courses
debugRouter.get('/courses', async (_req: Request, res: Response) => {
    const courses = await Course.find().populate('instructor', 'name email').lean();
    res.json(courses);
});

// POST /api/debug/course — { title, courseCode, description, instructorId }
debugRouter.post('/course', async (req: Request, res: Response) => {
    const { title, courseCode, description, instructorId } = req.body as {
        title?: string; courseCode?: string; description?: string; instructorId?: string;
    };

    if (!title || !courseCode || !instructorId) {
        res.status(400).json({ message: 'title, courseCode, and instructorId are required' });
        return;
    }

    const professor = await Professor.findById(instructorId);
    if (!professor) {
        res.status(404).json({ message: 'Professor not found' });
        return;
    }

    try {
        const course = await Course.create({ title, courseCode, description, instructor: instructorId });
        // Add the course to the professor's courses list
        professor.courses.push(course._id as any);
        await professor.save();
        res.status(201).json(course);
    } catch (err: any) {
        if (err.code === 11000) {
            res.status(409).json({ message: `Course code "${courseCode.toUpperCase()}" already exists` });
        } else {
            res.status(500).json({ message: err.message ?? 'Failed to create course' });
        }
    }
});

// POST /api/debug/enroll — { studentId, courseId }
debugRouter.post('/enroll', async (req: Request, res: Response) => {
    const { studentId, courseId } = req.body as { studentId?: string; courseId?: string };

    if (!studentId || !courseId) {
        res.status(400).json({ message: 'studentId and courseId are required' });
        return;
    }

    const [student, course] = await Promise.all([
        Student.findById(studentId),
        Course.findById(courseId),
    ]);

    if (!student) { res.status(404).json({ message: 'Student not found' }); return; }
    if (!course)  { res.status(404).json({ message: 'Course not found' });  return; }

    const alreadyEnrolled = student.courses.some((c: any) => c.toString() === courseId);
    if (alreadyEnrolled) {
        res.status(409).json({ message: 'Student is already enrolled in this course' });
        return;
    }

    student.courses.push(course._id as any);
    await student.save();
    res.json({ message: `${student.name} enrolled in ${course.title}` });
});

export default debugRouter;
