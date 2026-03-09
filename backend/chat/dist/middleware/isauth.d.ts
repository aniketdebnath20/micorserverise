import Document, { type NextFunction, type Response, type Request } from "express";
interface Iuser extends Document {
    _id: string;
    name: string;
    email: string;
}
export interface AuthenticatedRequest extends Request {
    user?: Iuser | null;
}
declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Document.Response<any, Record<string, any>> | undefined>;
export default isAuth;
//# sourceMappingURL=isauth.d.ts.map