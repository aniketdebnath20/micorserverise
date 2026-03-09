export const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
            next(error);
        }
    };
};
//# sourceMappingURL=asynchandler.js.map