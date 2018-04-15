import { JetView } from "webix-jet";
import { data } from "models/contacts";
import { statuses } from "models/statuses";
import contactsForm from "views/contactsForm";

export default class ContactsTemplate extends JetView {
	config() {

		var contactsTemplate = {
			view: "template",
			id: "contactsTemplate",
			template: (obj) => {
				return `
					<div id='user-header'>
						<div id='title'>
							<h1 style='padding-left:18px; min-height: 40px;'>${obj.FirstName} ${obj.LastName}</h1>
						</div>
						<div id='user-action'>
							<button class='webixbutton i-trash' ><span class='webix_icon fa-trash'></span>Delete</button>
							<button class='webixbutton i-edit'><span class='webix_icon fa-edit'></span>Edit</button>
						</div>
					</div>
					<div id='profile'>
						<div id='user-photo'>
							<img src='${obj.Photo}' alt='user-photo' style='width: 300px; height: 300px; border: black;'>
						</div>
						<div id='user-info'>
							<ul id='info'>
								<li><span class='webix_icon fa-envelope'></span>${obj.Email}</li>
								<li><span class='webix_icon fa-skype'></span>${obj.Skype}</li>
								<li><span class='webix_icon fa-tag'></span>${obj.Job}</li>
								<li><span class='webix_icon fa-briefcase'></span>${obj.Company}</li>
						  	
								<li><span class='webix_icon fa-calendar'></span>${obj.Birthday}</li>
								<li><span class='webix_icon fa-map-marker'></span>${obj.Address}</li>
						  	</ul>
						</div>
					</div>
					<div id='user-status'>${obj.StatusID}</div>
				`;
			},
			onClick: {
				"i-trash": () => {
					let id = this.getParam("id", true);
					webix.confirm({
						title: "Information",
						text: "Delete?",
						callback: function (result) {
							
							if (result == true) {
								data.remove(id);
							}
						}
					});
					return false;
				},
				"i-edit": () => {
					let id = this.getParam("id", true);
					let values = data.getItem(id);
					this.show("contactsForm");
					//this.app.callEvent("contactEdit", [values]);
				}

			}
		};

		return contactsTemplate;
	}

	init(){
		
		
	}

	urlChange(view, url) {
		
		webix.promise.all([
			data.waitData,
			statuses.waitData
		]).then(() => {
			let template = this.$$("contactsTemplate");
			let id = this.getParam("id", true);
			let item;
			
			if (id && data.exists(id))
				item = webix.copy(data.getItem(id));
			else
				item = webix.copy(data.getItem(data.getFirstId()));
			if (statuses.exists(item.StatusID))
				item.StatusID = statuses.getItem(item.StatusID).value;
			template.setValues(item);
		}
		);
		
	}
}