"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconSettings, IconUser } from "@tabler/icons-react"; // Importe IconSettings

export function NavBar() {
	const navItems = [
		{
			name: "Inicio",
			link: "/",
			icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
		},
		{
			name: "Sobre",
			link: "/sobre",
			icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
		},
		{
			name: "Serviços",
			link: "/servicos",
			icon: (
				<IconSettings className="h-4 w-4 text-neutral-500 dark:text-white" />
			),
		},
	];
	return (
		<div className="relative w-full">
			<FloatingNav navItems={navItems} />
		</div>
	);
}
