import { JetView } from "webix-jet";
import { data } from "models/contacts";
import contactsForm from "views/contactsForm";
import { statuses } from "models/statuses";

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
					//this.setParam("id", id, true);
					this.show(`?id=${id}`); //../contacts
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
				//this.app.callEvent("addContact")
				//let id = this.getParam("id");
				this.show("contactsForm"); //top/contacts?id=1
				//this.$scope.app.show("/contactsForm/");
			}
			
		};

		return {rows: [contactsList, {}, addButton]};
	}

	init() {
		this.$$("contactslist").sync(data);
		//this.use(plugins.UrlParam, ["id"]);
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
