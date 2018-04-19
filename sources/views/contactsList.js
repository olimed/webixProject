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
			type: {
				height: 60
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`?id=${id}`); 
				}
			}
		};

		var addButton = {
			view: "button",
			label: "Add Contact",
			type: "iconButton", 
			icon: "plus",
			css: "style_button",
			click: () => {
				this.show("contactsForm");				
			}
			
		};

		return {rows: [contactsList,  addButton]};
	}

	init() {
		this.$$("contactslist").sync(data);	
				
		this.on (this.app, "delContact", () => {
			this.$$("contactslist").select(this.$$("contactslist").getFirstId());
		});

		this.on (this.app, "addContact", () => {
			data.waitData.then(() => {
				this.$$("contactslist").select( this.$$("contactslist").getLastId());
			});			
		});
	}

	urlChange() {
		data.waitData.then(() => {
			let list = this.$$("contactslist");
			let id = this.getParam("id");
			if (id && data.exists(id))
				list.select(id);
			else
				list.select(list.getFirstId());
		});		
	}
}
