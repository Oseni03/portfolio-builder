import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
} from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import CustomProvider from "@/redux/provider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<CustomProvider>{children}</CustomProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
