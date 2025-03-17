import express, { Request, Response, NextFunction, Router } from "express";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			res.clearCookie("token");
			res.status(200).json({ message: "Logout realizado com sucesso" });
		} catch (error) {
			next(error);
		}
	},
);

export default router;
