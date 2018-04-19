import { JetView } from "webix-jet";
import { data } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactsForm extends JetView {
	config() {

		var contactsForm = {
			view: "form",
			id: "contactsForm",
			autohieght: true,
			elementsConfig: {
				labelWidth: 90
			},
			elements: [{

				rows: [
					{ view: "label", id: "headerForm", height: 50 },
					{
						margin: 15, cols: [
							{
								rows: [
									{ css: "inputsForm", view: "text", label: "Fist name", name: "FirstName" },
									{ css: "inputsForm", view: "text", label: "Last name", name: "LastName" },
									{ css: "inputsForm", view: "datepicker", align: "right", label: "Joining date", format: webix.i18n.dateFormatStr, name: "StartDate" },
									{ css: "inputsForm", view: "richselect", label: "Status", name: "StatusID", options: { body: { data: statuses, template: "#Value#" } } },
									{ css: "inputsForm", view: "text", label: "Job", name: "Job" },
									{ css: "inputsForm", view: "text", label: "Company", name: "Company" },
									{ css: "inputsForm", view: "text", label: "Website", name: "Website" },
									{ css: "inputsForm", view: "text", label: "Address", name: "Address" },
									{}
								]
							},
							{
								rows: [
									{ css: "inputsForm", view: "text", label: "Email", type: "email", name: "Email" },
									{ css: "inputsForm", view: "text", label: "Skype", name: "Skype" },
									{ css: "inputsForm", view: "text", label: "Phone", name: "Phone" },
									{ css: "inputsForm", view: "datepicker", align: "right", label: "Birthday", name: "Birthday" },
									{
										margin: 15, cols: [
											{ id: "userPhotoForm", template: "<img src='#src# 'alt='user-photo' width: 60px; height: 180px;>", name: "Photo" },
											{
												rows: [
													{},
													{
														view: "uploader", value: "Change photo",
														accept: "image/jpeg, image/png",
														autosend: false,
														multiple: false,
														on: {
															onBeforeFileAdd: (upload) => {
																let id = this.getParam("id");
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
															let id = this.getParam("id");
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
		if (id) {
			this.$$("saveButton").setValue("Save");
			this.$$("headerForm").setValue("<h2 style='margin-top: 0px;'>Edit contact</h2>");
			data.waitData.then(() => {
				let values = data.getItem(id);
				this.$$("contactsForm").setValues(values);
			});
		} else {
			this.$$("saveButton").setValue("Add");
			this.$$("headerForm").setValue("<h2 style='margin-top: 0px;'>Add contact</h2>");
		}
	}
}