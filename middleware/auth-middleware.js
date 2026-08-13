import jwt from 'jsonwebtoken';

// 1. Middleware Cek Token (Satpam Pintu Gerbang)
export const verifyToken = (req, res, next) => {
    // Ambil token dari cookie ATAU dari header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = req.cookies?.auth_token || bearerToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. Token not found."
        })
    }

    // Verifikasi Token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token Invalid or Expired."
            })
        }

        // controller bisa panggil req.user.id atau req.user.role
        req.user = decoded
        next()
    })
};

// 2. Middleware Cek Role (Satpam VIP)
// Cara pakainya nanti: verifyRole(['admin', 'dekanat'])
export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Akses terlarang. Role Anda tidak diizinkan."
            })
        }
        next()
    }
}