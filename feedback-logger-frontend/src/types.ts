// API response shapes — mirror the backend route return values exactly

export interface ApiCourse {
    id: string;
    courseCode: string;
    title: string;
    description: string;
    instructorName: string;
}

export interface ApiLesson {
    id: string;
    lessonNumber: number;
    title: string;
    description: string;
}

export interface ApiLessonsResponse {
    currentLesson: number;
    lessons: ApiLesson[];
}

export interface ApiComment {
    id: string;
    authorName?: string;   // present in admin view only
    comment: string;
    createdAt: string;
}

export interface ApiUser {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'professor';
    classYear: number | null;
    major: string;
    department: string;
    profileImage: string;
}
