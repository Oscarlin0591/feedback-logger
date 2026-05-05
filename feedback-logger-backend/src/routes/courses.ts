import { Router, type Request, type Response } from 'express';
import Course from '../model/Course';
import Lesson from '../model/Lesson';
import Comment from '../model/Comment';
import Student from '../model/Students';

const router = Router();

// Roles allowed to see all comments + author names (teacher view)
const isTeacherRole = (role: string | undefined) => role === 'professor' || role === 'admin';

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
        // Hardcoded to match the original curWeek=3 (3 weeks × 2 lessons = 6).
        // Update this field to make the cutoff dynamic per course.
        currentLesson: 6,
        lessons: lessons.map((l) => ({
            id: l._id,
            lessonNumber: l.lessonNumber,
            title: l.title,
            description: l.description ?? '',
        })),
    });
});

// GET /api/courses/:courseCode/lessons/:lessonNumber/comments
// Teacher (professor/admin): all comments with author names. Student: own comments only.
router.get('/:courseCode/lessons/:lessonNumber/comments', async (req: Request, res: Response): Promise<void> => {
    const courseCode = req.params.courseCode as string;
    const lessonNumber = req.params.lessonNumber as string;

    const course = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (!course) { res.status(404).json({ message: 'Course not found' }); return; }

    const lesson = await Lesson.findOne({ course: course._id, lessonNumber: parseInt(lessonNumber) });
    if (!lesson) { res.status(404).json({ message: 'Lesson not found' }); return; }

    if (isTeacherRole(req.user!.role)) {
        const comments = await Comment.find({ lesson: lesson._id })
            .populate<{ author: { name: string } | null }>('author', 'name')
            .sort({ createdAt: 1 });

        res.json(
            comments.map((c) => ({
                id: c._id,
                authorName: c.author?.name ?? 'Unknown',
                comment: c.comment,
                createdAt: c.createdAt,
            }))
        );
        return;
    }

    // Student view: return only this student's own comments
    const studentDoc = await Student.findOne({ email: req.user!.email });
    const filter = studentDoc
        ? { lesson: lesson._id, author: studentDoc._id }
        : { lesson: lesson._id, author: null };

    const comments = await Comment.find(filter).sort({ createdAt: 1 });
    res.json(
        comments.map((c) => ({
            id: c._id,
            comment: c.comment,
            createdAt: c.createdAt,
        }))
    );
});

// POST /api/courses/:courseCode/lessons/:lessonNumber/comments
router.post('/:courseCode/lessons/:lessonNumber/comments', async (req: Request, res: Response): Promise<void> => {
    if (req.user!.role !== 'student') {
        res.status(403).json({ message: 'Only students can submit feedback' });
        return;
    }

    const courseCode = req.params.courseCode as string;
    const lessonNumber = req.params.lessonNumber as string;
    const { comment } = req.body as { comment: string };

    if (!comment?.trim()) {
        res.status(400).json({ message: 'Comment text is required' });
        return;
    }

    const course = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (!course) { res.status(404).json({ message: 'Course not found' }); return; }

    const lesson = await Lesson.findOne({ course: course._id, lessonNumber: parseInt(lessonNumber) });
    if (!lesson) { res.status(404).json({ message: 'Lesson not found' }); return; }

    const studentDoc = await Student.findOne({ email: req.user!.email });
    if (!studentDoc) {
        res.status(404).json({ message: 'Student account not found in database — run the seed script' });
        return;
    }

    const newComment = await Comment.create({
        comment: comment.trim(),
        author: studentDoc._id,
        lesson: lesson._id,
        course: course._id,
    });

    lesson.comments.push(newComment._id);
    await lesson.save();

    res.status(201).json({
        id: newComment._id,
        comment: newComment.comment,
        createdAt: newComment.createdAt,
    });
});

// PATCH /api/courses/:courseCode/lessons/:lessonNumber/comments/:commentId
router.patch('/:courseCode/lessons/:lessonNumber/comments/:commentId', async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;
    const { comment } = req.body as { comment: string };

    if (!comment?.trim()) {
        res.status(400).json({ message: 'Comment text is required' });
        return;
    }

    const commentDoc = await Comment.findById(commentId);
    if (!commentDoc) { res.status(404).json({ message: 'Comment not found' }); return; }

    const studentDoc = await Student.findOne({ email: req.user!.email });
    if (!studentDoc || commentDoc.author.toString() !== studentDoc._id.toString()) {
        res.status(403).json({ message: 'You can only edit your own feedback' });
        return;
    }

    commentDoc.comment = comment.trim();
    await commentDoc.save();

    res.json({
        id: commentDoc._id,
        comment: commentDoc.comment,
        createdAt: commentDoc.createdAt,
    });
});

export default router;
