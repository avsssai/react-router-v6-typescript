import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { loader as contactLoader } from "./contact";
import { updateContact } from "../contacts";

// eslint-disable-next-line
export async function action({ request, params }: any) {
	const formData = await request.formData();
	const updates = Object.fromEntries(formData);
	await updateContact(params.contactId, updates);
	return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
	const navigate = useNavigate();
	const { contact } = useLoaderData() as Awaited<
		ReturnType<typeof contactLoader>
	>;
	return (
		<Form method='post' id='contact-form'>
			<p>
				<span>Name</span>
				<input
					name='first'
					type='text'
					placeholder='First'
					aria-label='First name'
					defaultValue={contact?.first}
				/>
				<input
					name='last'
					type='text'
					placeholder='Last'
					aria-label='Last name'
					defaultValue={contact?.last}
				/>
			</p>
			<label>
				<span>Twitter</span>
				<input
					type='text'
					placeholder='@jack'
					name='twitter'
					defaultValue={contact?.twitter}
					aria-label='twitter'
				/>
			</label>
			<label>
				<span>Avatar URL</span>
				<input
					type='text'
					placeholder='https://example.com/avatar.jpg'
					name='avatar'
					defaultValue={contact?.avatar}
					aria-label='Avatar'
				/>
			</label>
			<label>
				<span>Notes</span>
				<textarea
					placeholder='Notes'
					name='notes'
					defaultValue={contact?.notes}
					rows={6}
				/>
			</label>
			<p>
				<button type='submit'>Save</button>
				<button
					type='button'
					onClick={() => {
						navigate(-1);
					}}>
					Cancel
				</button>
			</p>
		</Form>
	);
}
