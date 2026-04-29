import { Router, type Response } from 'express';
import Student from '../model/Students';
import Professor from '../model/Professor';
import type { AuthRequest } from '../types';

const router = Router();

// GET /api/profile — look up by email so it works with the in-memory auth JWT (id is a string, not ObjectId)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    const email = req.user!.email;

    const student = await Student.findOne({ email }).select('-password');
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

    const professor = await Professor.findOne({ email }).select('-password');
    if (!professor) {
        res.status(404).json({ message: 'User not found — run the seed script first' });
        return;
    }

    res.json({
        id: professor._id,
        name: professor.name,
        email: professor.email,
        role: 'admin',
        classYear: professor.classYear ?? null,
        major: professor.major ?? '',
        department: professor.department ?? '',
        profileImage: professor.profileImage,
    });
});

// PUT /api/profile — update allowed fields only (name, classYear, major, department)
router.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
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
    ).select('-password');

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
    ).select('-password');

    if (!professor) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.json({
        id: professor._id,
        name: professor.name,
        email: professor.email,
        role: 'admin',
        classYear: professor.classYear ?? null,
        major: professor.major ?? '',
        department: professor.department ?? '',
        profileImage: professor.profileImage,
    });
});

export default router;
