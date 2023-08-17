import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import RootRoute from "./routes/root";
import ErrorPage from "./error-page";
import Contact, { action as favoriteAction } from "./routes/contact";
import { loader as rootLoader } from "./routes/root";
import { action as rootAction } from "./routes/root";
import { loader as contactLoader } from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as deleteAction } from "./routes/delete";
import Index from "./routes";
// create a router
const router = createBrowserRouter([
	{
		path: "/",
		element: <RootRoute />,
		errorElement: <ErrorPage />,
		loader: rootLoader,
		action: rootAction,
		children: [
			{
				errorElement: <ErrorPage />,
				children: [
					{
						index: true,
						element: <Index />,
					},
					{
						path: "/contacts/:contactId",
						element: <Contact />,
						loader: contactLoader,
						action: favoriteAction,
					},
					{
						path: "/contacts/:contactId/edit",
						element: <EditContact />,
						loader: contactLoader,
						action: editAction,
					},
					{
						path: "/contacts/:contactId/destroy",
						action: deleteAction,
						errorElement: (
							<div>Opps! There was an error deleting!</div>
						),
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
