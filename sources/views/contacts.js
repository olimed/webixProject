import { JetView } from "webix-jet";
import contactsList from "views/contactsList";
import contactsForm from "views/contactsForm";

export default class ContactsView extends JetView {
	config() {

		return { cols: [contactsList, contactsForm] };
	}

}