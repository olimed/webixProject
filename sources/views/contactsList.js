import { JetView } from "webix-jet";
import { data } from "models/contacts";

export default class ContactsList extends JetView {
	config() {

		var contactsList = {
			view: "list",
			id: "contactslist",
			template: (obj) => { 
				return `
					<div id='wrapper'>
						<div id='avatar'>							
							${obj.Photo ? `<img id='img-avatar' src='${obj.Photo}' >` : "<span class='webix_icon fa-user-circle icon-avatar'></span>"}
						</div>
						<div>
							${obj.FirstName} ${obj.LastName}
							<div>${obj.Company}</div>							  	
						</div>
					</div>
				`;
			},
			width: 300,
			scrollX: false,
			select: true,
			type: {
				height: 60
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`?id=${id}`);
				},
				"data->onIdChange": (oldId, newId) => {
					this.app.show(`top/contacts?id=${newId}/contactsTemplateInfo`);
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

		return { rows: [contactsList, addButton] };
	}

	init() {
		this.$$("contactslist").sync(data);

		this.on(this.app, "delContact", () => {
			this.$$("contactslist").select(this.$$("contactslist").getFirstId());
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
