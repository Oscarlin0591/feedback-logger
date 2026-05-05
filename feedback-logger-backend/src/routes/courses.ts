import { Router, type Request, type Response } from 'express';
import Course from '../model/Course';
import Lesson from '../model/Lesson';

const router = Router();

// GET /api/courses
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    const courses = await Course.find()
        .populate<{ instructor: { name: string } | null }>('instructor', 'name')
        .sort({ courseCode: 1 });

    res.json(
        courses.map((c) => ({
            id: c._id,
            courseCode: c.courseCode,
            title: c.title,
            description: c.description ?? '',
            instructorName: c.instructor?.name ?? '',
        }))
    );
});

// GET /api/courses/:courseCode/lessons
router.get('/:courseCode/lessons', async (req: Request, res: Response): Promise<void> => {
    const courseCode = req.params.courseCode as string;

    const course = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
    }

    const lessons = await Lesson.find({ course: course._id }).sort({ lessonNumber: 1 });

    res.json({
        currentLesson: 6,
        lessons: lessons.map((l) => ({
            id: l._id,
            lessonNumber: l.lessonNumber,
            title: l.title,
            description: l.description ?? '',
        })),
    });
});

export default router;
