import { deleteContact } from "../contacts";
import { redirect } from "react-router-dom";

// eslint-disable-next-line
export async function action({ params }: any) {
	console.log(params.contactId);
	await deleteContact(params.contactId);
	return redirect("/");
}
