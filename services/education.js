"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { educationSchema } from "@/schema/sections";

export async function getUserEducations(userId) {
	return withErrorHandling(async () => {
		const educations = await prisma.education.findMany({
			where: { userId },
			select: {
				id: true,
				visible: true,
				institution: true,
				studyType: true,
				date: true,
				summary: true,
				logo: true,
				url: true,
			},
		});
		if (educations.length > 0) {
			return educations.map((item) => educationSchema.parse(item));
		}
		return [];
	});
}

export async function createEducation(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create education with additional metadata
		const edu = await prisma.education.create({
			data: {
				...data,
				user: { connect: { id: userId } },
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return edu;
	});
}

export async function editEducation(educationId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingEdu = await prisma.education.findUnique({
			where: { id: educationId, userId },
		});

		if (!existingEdu) {
			throw new Error(
				"Education not found or you do not have permission to update"
			);
		}

		const updatedEdu = await prisma.education.update({
			where: { id: educationId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedEdu;
	});
}

export async function deleteEducation(educationId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a education"
			);
		}

		const existingEdu = await prisma.education.findUnique({
			where: { id: educationId, userId },
		});

		if (!existingEdu) {
			throw new Error(
				"Education not found or you do not have permission to delete"
			);
		}

		const deletedEdu = await prisma.education.delete({
			where: { id: educationId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedEdu;
	});
}
