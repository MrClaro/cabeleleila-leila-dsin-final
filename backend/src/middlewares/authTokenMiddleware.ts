import jwt from "../utils/jwt";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

interface TokenPayload {
	id: string;
	name: string;
	role: string;
	exp: number;
}

interface AuthRequest extends Request {
	dados?: TokenPayload | { root: boolean };
}

const auth = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.headers.authorization) {
			throw createError.Unauthorized("Token de acesso é obrigatório");
		}

		const authHeader = req.headers.authorization;
		const parts = authHeader.split(" ");

		if (parts.length !== 2) {
			throw createError.Unauthorized("Token malformado");
		}

		const [scheme, token] = parts;

		if (!/^Bearer$/i.test(scheme)) {
			throw createError.Unauthorized("Token mal formatado");
		}

		if (token === process.env.ACCESS_TOKEN_SECRET) {
			req.dados = { root: true };
			return next();
		}

		try {
			const user = await jwt.verifyAccessToken(token);

			if (
				typeof user === "object" &&
				"name" in user &&
				"exp" in user &&
				"role" in user
			) {
				req.dados = user as TokenPayload;
				return next();
			}

			throw createError.Unauthorized("Token inválido");
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				next(createError.Unauthorized("Token expirado"));
			} else if (error instanceof JsonWebTokenError) {
				next(createError.Unauthorized("Token inválido"));
			} else {
				next(createError.Unauthorized("Não autorizado"));
			}
		}
	} catch (error) {
		next(error);
	}
};

export default auth;
