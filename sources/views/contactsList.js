import { JetView } from "webix-jet";
import { data } from "models/contacts";

export default class ContactsList extends JetView {
	config() {
		var contactsList = {
			view: "list",
			id: "contactslist",
			template: "<span class='webix_icon fa-user-circle'></span> #FirstName# #LastName# <div style='padding-left:18px'>#Address#</div>",
			width: 300,
			scrollX: false,
			select: true,
			type:{
				height: 60
			},
		};

		return contactsList;
	}

	init() {
		this.$$("contactslist").sync(data);
	}

	ready(){
		this.$$("contactslist").select(this.$$("contactslist").getFirstId());
	}
}
