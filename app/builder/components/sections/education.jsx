import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import { useForm } from "react-hook-form";
import { defaultEducation, educationSchema } from "@/schema/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
	addEducation,
	addEducationInDatabase,
	removeEducation,
	removeEducationFromDatabase,
	toggleEducationVisibility,
	updateEducationInDatabase,
} from "@/redux/features/educationSlice";
import { EducationDialog } from "../dialogs/education-dialog";
import { createId } from "@paralleldrive/cuid2";

export const Education = () => {
	const dispatch = useDispatch();
	const [currentEducation, setCurrentEducation] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(educationSchema),
		defaultValues: defaultEducation,
	});
	const {
		reset,
		formState: { errors, defaultValues },
	} = form;

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form Validation Errors:", errors);
		}
	}, [errors, defaultValues]);

	// Access the specific section from the Redux state
	const section = useSelector((state) => state.education);
	if (!section) return null;

	// CRUD handlers
	const openCreateDialog = () => {
		reset({ ...defaultEducation, id: createId() });
		setCurrentEducation(null);
		setIsOpen(true);
	};
	const openUpdateDialog = (education) => {
		reset(education);
		setCurrentEducation(education);
		setIsOpen(true);
	};
	const onDuplicate = (item) => {
		const newItem = { ...item, id: createId() };

		dispatch(addEducation(newItem));
		dispatch(addEducationInDatabase(newItem));
	};
	const onDelete = (item) => {
		dispatch(removeEducation(item.id));
		dispatch(removeEducationFromDatabase(item.id));
	};
	const onToggleVisibility = (item) => {
		dispatch(toggleEducationVisibility(item.id));
		dispatch(
			updateEducationInDatabase({ ...item, visible: !item.visible })
		);
	};

	return (
		<motion.section
			id={"education"}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid gap-y-6"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">
						Education
					</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				<EducationDialog
					form={form}
					currentEducation={currentEducation}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				/>

				{section.items.length === 0 && (
					<Button
						onClick={openCreateDialog}
						variant="outline"
						className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
					>
						<Plus size={14} />
						<span className="font-medium">Add a new item</span>
					</Button>
				)}

				<AnimatePresence>
					{section.items.map((item) => (
						<SectionListItem
							key={item.id}
							id={item.id}
							visible={item.visible}
							title={item.institution}
							description={item.date}
							onUpdate={() => openUpdateDialog(item)}
							onDelete={() => onDelete(item)}
							onDuplicate={() => onDuplicate(item)}
							onToggleVisibility={() => onToggleVisibility(item)}
						/>
					))}
				</AnimatePresence>
			</main>

			{section.items.length > 0 && (
				<footer className="flex items-center justify-end">
					<Button
						variant="outline"
						className="ml-auto gap-x-2"
						onClick={openCreateDialog}
					>
						<Plus />
						<span>Add a new item</span>
					</Button>
				</footer>
			)}
		</motion.section>
	);
};
