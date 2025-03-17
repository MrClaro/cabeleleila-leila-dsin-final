import {
	NextResponse,
	type MiddlewareConfig,
	type NextRequest,
} from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
	{
		path: "/",
		whenAuthenticated: "next",
	},
	{
		path: "/login",
		whenAuthenticated: "redirect",
	},
	{
		path: "/register",
		whenAuthenticated: "redirect",
	},
	{
		path: "/servicos",
		whenAuthenticated: "next",
	},
] as const;

interface TokenPayload {
	id: string;
	usuario: string;
	cargo: string;
	exp: number;
}

const ROTA_REDIRECIONAR_QUANDO_NAO_AUTENTICADO = "/";

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const publicRoute = publicRoutes.find((route) => route.path === path);
	const token = request.cookies.get("token")?.value;
	const authToken = token ? token : undefined;

	// Debug
	console.log("Path:", path);
	console.log("AuthToken:", authToken);
	console.log("PublicRoute:", publicRoute);

	if (!authToken && publicRoute) {
		return NextResponse.next();
	}

	if (!authToken && !publicRoute) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = ROTA_REDIRECIONAR_QUANDO_NAO_AUTENTICADO;
		return NextResponse.redirect(redirectUrl);
	}

	if (authToken && path === "/") {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/dashboard";
		return NextResponse.redirect(redirectUrl);
	}

	if (authToken && (path === "/login" || path === "/register")) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/dashboard";
		return NextResponse.redirect(redirectUrl);
	}

	if (authToken && !publicRoute) {
		try {
			if (token) {
				const decoded = jwtDecode<TokenPayload>(token);

				if (decoded.exp * 1000 < Date.now()) {
					const redirectUrl = request.nextUrl.clone();
					redirectUrl.pathname = "/login";
					return NextResponse.redirect(redirectUrl);
				}

				return NextResponse.next();
			} else {
				const redirectUrl = request.nextUrl.clone();
				redirectUrl.pathname = "/login";
				return NextResponse.redirect(redirectUrl);
			}
		} catch (error) {
			console.log(error);
			const redirectUrl = request.nextUrl.clone();
			redirectUrl.pathname = "/login";
			return NextResponse.redirect(redirectUrl);
		}
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
