import { JetView } from "webix-jet";
import { data } from "models/contacts";

export default class ContactsList extends JetView {
	config() {

		const _ = this.app.getService("locale")._;

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
			label: _("Add contact"),
			type: "iconButton",
			icon: "plus",
			css: "style_button",
			click: () => {
				this.show("contactsForm");
			}

		};

		var filter = {
			view:"text", placeholder: "type to find matching contacts", id: "filterList",
			on:{ 
				onTimedKeypress: () => {
					var text = this.$$("filterList").getValue().toString().toLowerCase();
					this.$$("contactslist").filter( (obj) => {
					  let filter = [obj.FirstName, obj.LastName, obj.StatusID, obj.Company, obj.Address, obj.Job, obj.Website, obj.Skype, obj.Phone, obj.Email, obj.Birthday, obj.StartDate].join("|");
					  filter = filter.toString().toLowerCase();
					  return (filter.indexOf(text) != -1);
					});

				}
			}
		  };

		return { rows: [filter, contactsList, addButton] };
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
			list.showItem(id);
		});
	}
}
