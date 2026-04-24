import jwt  from "jsonwebtoken";

export function getToken(student) {
    return jwt.sign(
        {_id: student._id, email: student.email},
        {expiresIn: 3600}
    )
}