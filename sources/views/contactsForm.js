import {JetView} from "webix-jet";

export default class ContactsForm extends JetView{
	config(){

		var contactsTemplate = {
			view: "template",
			id: "contactsTemplate",
			template: "<div id='header'><div id='title'><h1 style='padding-left:18px'>#FirstName# #LastName#</h1></div><div id='action'><button>Delete</button>", 
		};	  

		return contactsTemplate;
	}
	
	init(){
		this.$$("contactsTemplate").bind($$("contactslist"));
	}
}