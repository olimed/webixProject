import { JetView } from "webix-jet";
import { data } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactsForm extends JetView {
	config() {

		var contactsForm = {
			view: "form",
			id: "contactsForm",
			elementsConfig: {
				labelWidth: 90
			},
			elements: [{
				rows: [
					{ css: "headerContactsForm", view: "label", id: "headerForm", height: 50 },
					{
						gravity: 10, margin: 15,
						cols: [
							{
								margin: 10,
								rows: [
									{ view: "text", label: "Fist name", name: "FirstName" },
									{ view: "text", label: "Last name", name: "LastName" },
									{ view: "datepicker", align: "right", label: "Joining date", format: webix.i18n.dateFormatStr, name: "StartDate" },
									{ view: "richselect", label: "Status", name: "StatusID", options: { body: { data: statuses, template: "#Value#" } } },
									{ view: "text", label: "Job", name: "Job" },
									{ view: "text", label: "Company", name: "Company" },
									{ view: "text", label: "Website", name: "Website" },
									{ view: "text", label: "Address", name: "Address" },
									{}
								]
							},
							{
								margin: 10,
								rows: [
									{ view: "text", label: "Email", type: "email", name: "Email" },
									{ view: "text", label: "Skype", name: "Skype" },
									{ view: "text", label: "Phone", name: "Phone" },
									{ view: "datepicker", align: "right", label: "Birthday", name: "Birthday" },
									{
										margin: 15, cols: [
											{
												id: "userPhotoForm", name: "Photo", 
												template: (obj) => {
													return `${obj.src ? `<img src='${obj.src}' style='width: 185px;height: 165px;position: absolute;'>` : "<div class='webix_icon fa-user-circle' style='font-size: 170px; '></div>"}`;
												}
											},
											{
												rows: [
													{ height: 100 },
													{
														view: "uploader", value: "Change photo",
														accept: "image/jpeg, image/png",
														autosend: false,
														multiple: false,
														on: {
															onBeforeFileAdd: (upload) => {
																let id = this.getIdFromUrl();
																let file = upload.file;
																let reader = new FileReader();
																if (file.status == "error")
																	webix.message({ type: "error", text: "Error during photo upload" });
																else {
																	let photo = this.$$("userPhotoForm");

																	reader.onload = (event) => {
																		photo.setValues({ src: event.target.result });
																		if (id) {
																			let item = data.getItem(id);
																			item.Photo = event.target.result;
																			this.$$("contactsForm").setValues(item);
																		}
																	};
																	webix.message({ text: "Successful!!! Photo uploaded." });
																}

																reader.readAsDataURL(file);
																return false;
															}
														}
													},
													{
														view: "button", label: "Delete photo",
														click: () => {
															let id = this.getIdFromUrl();
															this.$$("userPhotoForm").setValues({});
															if (id) {
																let item = data.getItem(id);
																item.Photo = " ";
																this.$$("contactsForm").setValues(item);
															}
														}
													}
												]
											}
										]
									}, {}
								]
							}
						]
					},
					{
						cols: [
							{},
							{
								view: "button", label: "Cancel",
								click: () => {
									this.show("contactsTemplateInfo");
								}
							},
							{
								view: "button", id: "saveButton",
								click: () => {
									let values = this.$$("contactsForm").getValues();
									if (this.$$("contactsForm").validate()) {
										if (values.id) {
											data.updateItem(values.id, values);
										} else {
											data.add(values);
											this.app.callEvent("addContact", []);
										}
										this.show("contactsTemplateInfo");
									}
								}
							}
						]
					}
				]
			}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty
			}
		};

		return contactsForm;
	}

	init() {

		let id = this.getParam("id");
		let label = { header: "Add contact", button: "Add" };
		if (id) {
			label.header = "Edit contact"; label.button = "Save";
			data.waitData.then(() => {
				let values = data.getItem(id);
				this.$$("contactsForm").setValues(values);
				this.$$("userPhotoForm").setValues({ src: values.Photo });
			});
		}
		this.$$("saveButton").setValue(label.button);
		this.$$("headerForm").setValue(`<h2>${label.header}</h2>`);
	}

	getIdFromUrl() {
		return this.getParam("id");
	}
}