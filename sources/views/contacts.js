import { JetView } from "webix-jet";
import contactsList from "views/contactsList";
import contactsForm from "views/contactsTemplateInfo";

export default class ContactsView extends JetView {
	config() {

		return { cols: [contactsList, contactsForm] };
	}

}