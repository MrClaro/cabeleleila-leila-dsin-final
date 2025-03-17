import { SideBar } from "@/components/sidebar/sidebar";

export default function PrivateLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-col md:flex-row h-screen">
			<SideBar className="w-50 flex-shrink-0" />
			<div className="flex flex-1 overflow-y-auto">{children}</div>
		</main>
	);
}
