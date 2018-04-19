import { JetView } from "webix-jet";
import { activity } from "models/activities";
import { activityTypes } from "models/activity_types";
import activitiesMess from "views/activitiesForm";
import { files } from "models/files";

export default class ContactsMultiview extends JetView {
	config() {

		var cells = [
			{
				header: "Activities", body: {
					rows: [
						{
							view: "datatable",
							id: "activitiesDatatable",
							scrollX: false,
							select: true,
							columns: [
								{ id: "State", header: "", template: "{common.checkbox()}", width: 40, uncheckValue: "Open", checkValue: "Close" },
								{ id: "TypeID", header: { content: "selectFilter" }, sort: "string", options: activityTypes, width: 250 },
								{ id: "DueDate", header: { content: "datepickerFilter" }, format: webix.i18n.dateFormatStr, sort: "date", width: 150 },
								{ id: "Details", header: { content: "textFilter" }, sort: "string", fillspace: true },
								{ id: "edit", header: "", width: 40, template: "<span class='webix_icon fa-edit'></span>" },
								{ id: "delete", header: "", width: 40, template: "<span class='webix_icon fa-trash'></span>" }
							],

							on: {
								onAfterFilter: () => {
									let id = this.getParam("id", true);
									this.$$("activitiesDatatable").filter((obj) => {
										return obj.ContactID == id;
									}, "", true);
								}
							},
							onClick: {
								"fa-trash": (e, id) => {
									webix.confirm({
										title: "Information",
										text: "Delete?",
										callback: function (result) {
											if (result == true) {
												activity.remove(id);
											}
										}
									});
									return false;
								},
								"fa-edit": (e, id) => {
									let values = activity.getItem(id);
									this.app.callEvent("activityChange", [values]);
								}
							}

						},
						{
							cols: [
								{}, {},
								{
									view: "button", label: "Add activity", type: "iconButton", icon: "plus", css: "style_button",
									click: () => {
										let id = this.getParam("id", true);
										this.app.callEvent("activityChange", [{ ContactID: id }]);
									}
								}
							]
						}
					]
				}
			},
			{
				header: "Files",
				body: {
					rows: [
						{
							view: "datatable",
							id: "contactFilesDatatable",
							scrollX: false,
							columns: [
								{ id: "Name", header: "Name", sort: "string", fillspace: true },
								{ id: "ChangeData", header: "Change data", width: 200, format: webix.i18n.dateFormatStr, sort: "date" },
								{ id: "Size", header: "Size (kb)", sort: "int", width: 150 },
								{ id: "Delete", header: "", width: 40, template: "<span class='webix_icon fa-trash'></span>" }
							],
							onClick: {
								"fa-trash": (e, id) => {
									let datatable = this.$$("contactFilesDatatable");
									webix.confirm({
										title: "Information",
										text: "Delete?",
										callback: function (result) {
											if (result == true) {
												datatable.remove(id);
											}
										}
									});
									return false;
								}
							}
						},
						{
							cols: [
								{},
								{
									view: "uploader",
									label: "Upload", type: "iconButton", icon: "cloud-upload", css: "style_button",
									autosend: false,
									multiple: false,
									on: {
										onBeforeFileAdd: (upload) => {
											var file = upload.file;
											var reader = new FileReader();
											if (file.status == "error")
												webix.message({ type: "error", text: "Error during photo upload" });
											else {

												this.$$("contactFilesDatatable").add({ Name: file.name, ChangeData: file.lastModifiedDate, Size: file.size });
												reader.readAsDataURL(file);
												webix.message({ text: "Successful!!! Photo uploaded." });
											}
											return false;
										}
									}
								},
								{}]
						}
					]
				}
			}
		];

		return { view: "tabview", cells: cells };
	}

	init() {

		this.addActivity = this.ui(activitiesMess);

		this.on(this.app, "activityChange", (data) => {
			this.addActivity.showWindow(data);
		});
	}

	urlChange() {
		activity.waitData.then(() => {

			let id = this.getParam("id", true);
			this.$$("activitiesDatatable").data.sync(activity, () => {
				this.$$("activitiesDatatable").filter((obj) => {
					return obj.ContactID == id;
				});
			});
		});

		files.waitData.then(() => {

			let id = this.getParam("id", true);
			this.$$("contactFilesDatatable").data.sync(files, () => {
				this.$$("contactFilesDatatable").filter((obj) => {
					return obj.ContactID == id;
				});
			});
		});
	}
}