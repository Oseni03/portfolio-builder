"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ModeToggle from "../mode-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export const Header1 = () => {
	const navigationItems = [
		{
			title: "Sections",
			description: "Managing a small business today is already tough.",
			items: [
				{
					title: "Features",
					href: "/#features",
				},
				{
					title: "Contact us",
					href: "/contact-us",
				},
				{
					title: "Pricing",
					href: "/#pricing",
				},
				{
					title: "Newsletter",
					href: "/#newsletter",
				},
			],
		},
	];

	const [isOpen, setOpen] = useState(false);
	return (
		<header className="w-full z-40 fixed top-0 left-0 bg-background border-b">
			<div className="container relative mx-auto min-h-14 flex gap-4 flex-row lg:grid lg:grid-cols-2 items-center">
				<div className="justify-start items-center gap-4 lg:flex flex-row">
					<NavigationMenu className="flex justify-start items-start">
						<NavigationMenuList className="flex justify-start items-center gap-4 flex-row">
							<NavigationMenuItem>
								<Link href={""}>
									<Button variant="icon">
										<Image
											src={siteConfig.icon}
											alt={siteConfig.name}
											width={65}
											height={65}
											className="text-black dark:text-white" // This will handle the color switching
										/>
									</Button>
								</Link>
							</NavigationMenuItem>
							{navigationItems.map((item) => (
								<NavigationMenuItem key={item.title}>
									{item.href ? (
										<>
											<NavigationMenuLink>
												<Button variant="ghost">
													{item.title}
												</Button>
											</NavigationMenuLink>
										</>
									) : (
										<>
											<NavigationMenuTrigger className="font-medium text-sm hidden lg:flex">
												{item.title}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="!w-[450px] p-4">
												<div className="flex flex-col lg:grid grid-cols-2 gap-4">
													<div className="flex flex-col h-full justify-between">
														<div className="flex flex-col">
															<p className="text-base">
																{item.title}
															</p>
															<p className="text-muted-foreground text-sm">
																{
																	item.description
																}
															</p>
														</div>
														<ModeToggle />
													</div>
													<div className="flex flex-col text-sm h-full justify-end">
														{item.items?.map(
															(subItem) => (
																<NavigationMenuLink
																	href={
																		subItem.href
																	}
																	key={
																		subItem.title
																	}
																	className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
																>
																	<span>
																		{
																			subItem.title
																		}
																	</span>
																	<MoveRight className="w-4 h-4 text-muted-foreground" />
																</NavigationMenuLink>
															)
														)}
													</div>
												</div>
											</NavigationMenuContent>
										</>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex justify-end w-full gap-4">
					<ModeToggle />
					<div className="border-r hidden md:inline"></div>
					<SignedIn>
						<UserButton />
						<Link href={"/builder"}>
							<Button size="sm">Builder</Button>
						</Link>
					</SignedIn>
					<SignedOut>
						<Link href={"/sign-in"}>
							<Button variant="outline">Sign in</Button>
						</Link>
						<Link href={"/sign-up"}>
							<Button>Get started</Button>
						</Link>
					</SignedOut>
				</div>
				<div className="flex w-12 shrink lg:hidden items-end justify-end">
					<Button variant="ghost" onClick={() => setOpen(!isOpen)}>
						{isOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</Button>
					{isOpen && (
						<div className="absolute top-14 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
							{navigationItems.map((item) => (
								<div key={item.title}>
									<div className="flex flex-col gap-2">
										{item.href ? (
											<Link
												href={item.href}
												className="flex justify-between items-center"
											>
												<span className="text-lg">
													{item.title}
												</span>
												<MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
											</Link>
										) : (
											<p className="text-lg">
												{item.title}
											</p>
										)}
										{item.items &&
											item.items.map((subItem) => (
												<Link
													key={subItem.title}
													href={subItem.href}
													className="flex justify-between items-center"
												>
													<span className="text-muted-foreground">
														{subItem.title}
													</span>
													<MoveRight className="w-4 h-4 stroke-1" />
												</Link>
											))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
