import { JetView } from "webix-jet";
import { activity } from "models/activities";
import { activityTypes } from "models/activity_types";
import activitiesMess from "views/activitiesForm";
import { files } from "models/files";

export default class ContactsMultiview extends JetView {
	config() {

		const _ = this.app.getService("locale")._;

		var cells = [
			{
				header: _("Activities"), body: {
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
										title: _("Information"),
										text: _("Delete?"),
										ok: _("OK"), 
    									cancel: _("Cancel"),
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
									view: "button", label: _("Add activity"), type: "iconButton", icon: "plus", css: "style_button",
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
				header: _("Files"),
				body: {
					rows: [
						{
							view: "datatable",
							id: "contactFilesDatatable",
							scrollX: false,
							columns: [
								{ id: "name", header: _("Name"), sort: "string", fillspace: true },
								{ id: "lastModifiedDate", header: _("Change data"), width: 200, format: webix.i18n.dateFormatStr, sort: "date" },
								{ id: "size", header: _("Size (kb)"), sort: "int", width: 150 },
								{ id: "delete", header: "", width: 40, template: "<span class='webix_icon fa-trash'></span>" }
							],
							onClick: {
								"fa-trash": (e, id) => {
									let datatable = this.$$("contactFilesDatatable");
									webix.confirm({
										title: _("Information"),
										text: _("Delete?"),
										ok: _("OK"), 
    									cancel: _("Cancel"),
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
									label: _("Upload"), type: "iconButton", icon: "cloud-upload", css: "style_button",
									autosend: false,
									multiple: false,
									link: "contactFilesDatatable",
									on: {
										onBeforeFileAdd: (upload) => {
											let id = this.getParam("id", true);
											let file = upload.file;
												file.ContactID = id;
												files.add(file);
												webix.message({ text: _("Successful!!! File uploaded.") });
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
			data.parentView = true;
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
			this.$$("activitiesDatatable").filterByAll();
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