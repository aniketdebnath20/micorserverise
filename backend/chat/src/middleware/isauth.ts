import Document, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
interface Iuser extends Document {
  _id: string;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: Iuser | null;
}

const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    /* ---------------- EXTRACT TOKEN ---------------- */
    const token: any = authHeader.split(" ")[1];

    /* ---------------- VERIFY TOKEN ---------------- */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    /* ---------------- ATTACH USER TO REQUEST ---------------- */
    req.user = decoded.user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


export default isAuth