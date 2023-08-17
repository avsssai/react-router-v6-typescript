import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { Contact, getContact, updateContact } from "../contacts";

// interface Params {
// 	params: {
// 		contactId: string;
// 	};
// }
// eslint-disable-next-line
export async function loader({ params }: any) {
	const contact = await getContact(params.contactId);
	if (!contact) {
		throw new Response("", {
			status: 404,
			statusText: "Not Found",
		});
	}
	return { contact };
}

// eslint-disable-next-line
export async function action({ request, params }: any) {
	const contactId = params.contactId;
	const formData = await request.formData();
	return updateContact(contactId, {
		favorite: formData.get("favorite") === "true",
	});
}

export default function ContactPage() {
	const { contact } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
	return (
		<div id='contact'>
			<div>
				<img key={contact?.avatar} src={contact?.avatar || undefined} />
			</div>

			<div>
				<h1>
					{contact?.first || contact?.last ? (
						<>
							{contact.first} {contact.last}
						</>
					) : (
						<i>No Name</i>
					)}{" "}
					<Favorite contact={contact} />
				</h1>
				{contact?.twitter && (
					<p>
						<a
							href={`https://twitter.com/${contact?.twitter}`}
							target='_blank'>
							{contact?.twitter}
						</a>
					</p>
				)}
				{contact?.notes && <p>{contact.notes}</p>}
				<div>
					<Form action='edit'>
						<button type='submit'>Edit</button>
					</Form>
					<Form
						action='destroy'
						method='post'
						onSubmit={(e) => {
							if (
								!confirm(
									"Please confirm you want to delete this record."
								)
							) {
								e.preventDefault();
							}
						}}>
						<button type='submit'>Delete</button>
					</Form>
				</div>
			</div>
		</div>
	);
}

export const Favorite = ({ contact }: { contact: Contact | null }) => {
	const fetcher = useFetcher();
	let favorite = contact?.favorite;
	if (fetcher.formData) {
		favorite = fetcher.formData.get("favorite") === "true";
	}
	return (
		<fetcher.Form method='post'>
			<button
				name='favorite'
				value={favorite ? "false" : "true"}
				aria-label={
					favorite ? "Remove from favorites" : "Add to favorites"
				}>
				{favorite ? "★" : "☆"}
			</button>
		</fetcher.Form>
	);
};
