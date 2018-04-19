import { JetView } from "webix-jet";
import contactsList from "views/contactsList";

export default class ContactsView extends JetView {
	config() {

		return { cols: [contactsList, {$subview: true}] }; 
	}

	ready(){
		this.show("contactsTemplateInfo");
	}
}