import { JetView } from "webix-jet";
import { data } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactsForm extends JetView {
	config() {

		const _ = this.app.getService("locale")._;

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
									{ view: "text", label: _("Fist name"), name: "FirstName" },
									{ view: "text", label: _("Last name"), name: "LastName" },
									{ view: "datepicker", align: "right", label: _("Joining date"), format: webix.i18n.dateFormatStr, name: "StartDate" },
									{ view: "richselect", label: _("Status"), name: "StatusID", options: { body: { data: statuses, template: "#Value#" } } },
									{ view: "text", label: _("Job"), name: "Job" },
									{ view: "text", label: _("Company"), name: "Company" },
									{ view: "text", label: _("Website"), name: "Website" },
									{ view: "text", label: _("Address"), name: "Address" },
									{}
								]
							},
							{
								margin: 10,
								rows: [
									{ view: "text", label: _("Email"), type: "email", name: "Email" },
									{ view: "text", label: _("Skype"), name: "Skype" },
									{ view: "text", label: _("Phone"), name: "Phone" },
									{ view: "datepicker", align: "right", label: _("Birthday"), name: "Birthday" },
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
														view: "uploader", value: _("Change photo"),
														accept: "image/jpeg, image/png",
														autosend: false,
														multiple: false,
														on: {
															onBeforeFileAdd: (upload) => {
																let file = upload.file;
																let reader = new FileReader();
																	let photo = this.$$("userPhotoForm");

																	reader.onload = (event) => {
																		photo.setValues({ src: event.target.result });
																		this.$$("contactsForm").setValues({Photo: event.target.result}, true);
																		
																	};
																	webix.message({ text: _("Successful!!! Photo uploaded.") });
																}

																reader.readAsDataURL(file);
																return false;
															}
														}
													},
													{
														view: "button", label: _("Delete photo"),
														click: () => {
															let id = this.getIdFromUrl();
															this.$$("userPhotoForm").setValues({});
															if (id) {
																this.$$("contactsForm").setValues({ Photo: "" }, true);
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
								view: "button", label: _("Cancel"),
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
		const _ = this.app.getService("locale")._;
		let id = this.getParam("id");
		let label = { header: _("Add contact"), button: _("Add") };
		if (id) {
			label.header = _("Edit contact"); label.button = _("Save");
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