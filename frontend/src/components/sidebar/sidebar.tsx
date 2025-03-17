"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconSettings,
	IconUserBolt,
	IconCalendarEvent,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils"; // Importe cn

interface SideBarProps {
	className?: string;
}

export function SideBar({ className }: SideBarProps) {
	const router = useRouter();
	const HOST = process.env.NEXT_PUBLIC_HOST;
	const PORT = process.env.NEXT_PUBLIC_PORT;
	const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function logout(ev: React.MouseEvent<HTMLAnchorElement>) {
		ev.preventDefault();
		try {
			console.log(`http://${HOST}:${PORT}/logout`);
			const response = await fetch(`http://${HOST}:${PORT}/logout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			if (response.ok) {
				router.push("/");
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.message);
				setIsErrorDialogOpen(true);
			}
		} catch (error) {
			setErrorMessage("Um erro ocorreu ao tentar fazer logout");
			setIsErrorDialogOpen(true);
		}
	}

	const links = [
		{
			label: "Dashboard",
			href: "/",
			icon: (
				<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
			),
		},
		{
			label: "Usuários",
			href: "/dashboard/usuarios",
			icon: (
				<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
			),
		},
		{
			label: "Serviços",
			href: "#",
			icon: (
				<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
			),
		},
		{
			label: "Agendamentos",
			href: "#",
			icon: (
				<IconCalendarEvent className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
			),
		},
		{
			label: "Sair",
			href: "#",
			icon: (
				<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
			),
			onClick: logout,
		},
	];

	const [open, setOpen] = useState(false);

	return (
		<div
			className={cn(
				"rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
				"h-screen",
				className,
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, idx) => (
								<SidebarLink key={idx} link={link} />
							))}
						</div>
					</div>
				</SidebarBody>
			</Sidebar>
		</div>
	);
}

export const Logo = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-medium text-black dark:text-white whitespace-pre"
			>
				Cabeleleira Leila
			</motion.span>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
		</Link>
	);
};
