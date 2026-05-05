import { Router, type Request, type Response } from 'express';
import Student from '../model/Students';
import Professor from '../model/Professor';

const router = Router();

// GET /api/profile — look up by email so it works regardless of how the JWT id was issued
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const email = req.user!.email;

    const student = await Student.findOne({ email });
    if (student) {
        res.json({
            id: student._id,
            name: student.name,
            email: student.email,
            role: 'student',
            classYear: student.classYear ?? null,
            major: student.major ?? '',
            department: student.department ?? '',
            profileImage: student.profileImage,
        });
        return;
    }

    const professor = await Professor.findOne({ email });
    if (!professor) {
        res.status(404).json({ message: 'User not found — run the seed script first' });
        return;
    }

    res.json({
        id: professor._id,
        name: professor.name,
        email: professor.email,
        role: 'professor',
        classYear: professor.classYear ?? null,
        major: professor.major ?? '',
        department: professor.department ?? '',
        profileImage: professor.profileImage,
    });
});

// PUT /api/profile — update allowed fields only (name, classYear, major, department)
router.put('/', async (req: Request, res: Response): Promise<void> => {
    const email = req.user!.email;
    const { name, classYear, major, department } = req.body as {
        name?: string;
        classYear?: number;
        major?: string;
        department?: string;
    };

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (classYear !== undefined) update.classYear = classYear;
    if (major !== undefined) update.major = major;
    if (department !== undefined) update.department = department;

    const student = await Student.findOneAndUpdate(
        { email },
        { $set: update },
        { new: true }
    );

    if (student) {
        res.json({
            id: student._id,
            name: student.name,
            email: student.email,
            role: 'student',
            classYear: student.classYear ?? null,
            major: student.major ?? '',
            department: student.department ?? '',
            profileImage: student.profileImage,
        });
        return;
    }

    const professor = await Professor.findOneAndUpdate(
        { email },
        { $set: update },
        { new: true }
    );

    if (!professor) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.json({
        id: professor._id,
        name: professor.name,
        email: professor.email,
        role: 'professor',
        classYear: professor.classYear ?? null,
        major: professor.major ?? '',
        department: professor.department ?? '',
        profileImage: professor.profileImage,
    });
});

export default router;
