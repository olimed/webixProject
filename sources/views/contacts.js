import { JetView } from "webix-jet";
import contactsList from "views/contactsList";
import contactsTemplate from "views/contactsTemplateInfo";

export default class ContactsView extends JetView {
	config() {

		return { cols: [contactsList, contactsTemplate] };  /*{ $subview: true}*/
	}

	ready(){
		//this.show("contactsTemplateInfo");
	}

}