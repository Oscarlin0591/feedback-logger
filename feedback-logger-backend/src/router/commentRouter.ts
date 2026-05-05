import { Router, type Response } from 'express';
import { authenticate, type AuthRequest } from './auth';
import Comment from '../model/Comment';
import Course from '../model/Course';
import Lesson from '../model/Lesson';

const commentRouter = Router();

// Finds the lesson by courseCode + lessonNumber, auto-creating it if it doesn't exist yet
async function resolveLesson(courseCode: string, lessonNumber: number) {
    const course = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (!course) return null;

    let lesson = await Lesson.findOne({ course: course._id, lessonNumber });
    if (!lesson) {
        lesson = await Lesson.create({
            title: `Lesson ${lessonNumber}`,
            lessonNumber,
            course: course._id,
        });
    }
    return { course, lesson };
}

// GET /api/comments/:courseCode/:lessonNumber
// Professor → all comments with author name; Student → only their own
commentRouter.get('/:courseCode/:lessonNumber', authenticate, async (req: AuthRequest, res: Response) => {
    const { courseCode, lessonNumber } = req.params;
    const { id, role } = req.user!;

    const resolved = await resolveLesson(courseCode, parseInt(lessonNumber));
    if (!resolved) { res.status(404).json({ message: 'Course not found' }); return; }

    const filter: Record<string, unknown> = { lesson: resolved.lesson._id };
    if (role === 'student') filter.author = id;

    const comments = await Comment.find(filter)
        .populate('author', 'name')
        .sort({ createdAt: 1 })
        .lean();

    res.json(comments);
});

// POST /api/comments/:courseCode/:lessonNumber — student only
commentRouter.post('/:courseCode/:lessonNumber', authenticate, async (req: AuthRequest, res: Response) => {
    const { courseCode, lessonNumber } = req.params;
    const { id, role } = req.user!;
    const { comment } = req.body as { comment?: string };

    if (role !== 'student') { res.status(403).json({ message: 'Only students can post feedback' }); return; }
    if (!comment?.trim()) { res.status(400).json({ message: 'Comment text is required' }); return; }

    const resolved = await resolveLesson(courseCode, parseInt(lessonNumber));
    if (!resolved) { res.status(404).json({ message: 'Course not found' }); return; }

    const newComment = await Comment.create({
        comment: comment.trim(),
        author: id,
        lesson: resolved.lesson._id,
        course: resolved.course._id,
    });

    resolved.lesson.comments.push(newComment._id as any);
    await resolved.lesson.save();

    const populated = await newComment.populate('author', 'name');
    res.status(201).json(populated);
});

// PUT /api/comments/:commentId — student only, must be author
commentRouter.put('/:commentId', authenticate, async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const { id, role } = req.user!;
    const { comment } = req.body as { comment?: string };

    if (role !== 'student') { res.status(403).json({ message: 'Only students can edit feedback' }); return; }
    if (!comment?.trim()) { res.status(400).json({ message: 'Comment text is required' }); return; }

    const existing = await Comment.findById(commentId);
    if (!existing) { res.status(404).json({ message: 'Comment not found' }); return; }
    if (existing.author.toString() !== id) { res.status(403).json({ message: 'You can only edit your own feedback' }); return; }

    existing.comment = comment.trim();
    await existing.save();

    const populated = await existing.populate('author', 'name');
    res.json(populated);
});

export default commentRouter;
