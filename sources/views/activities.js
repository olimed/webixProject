import { JetView } from "webix-jet";
import { activity } from "models/activities";  
import { activityTypes } from "models/activity_types"; 
import { data } from "models/contacts"; 
import activitiesMess from "views/activitiesForm";

export default class DataView extends JetView {
	config() {

		const _ = this.app.getService("locale")._;

		var activitiesToolbar = {
			cols: [
				{
					view: "segmented",
					id: "activitiesToolbar",
					gravity: 6,
					options: [
						{ id: "all", value: _("All") },
						{ id: "overdue", value: _("Overdue") },
						{ id: "completed", value: _("Completed") },
						{ id: "today", value: _("Today") },
						{ id: "tomorrow", value: _("Tomorrow") },
						{ id: "thisWeek", value: _("This week") },
						{ id: "thisMonth", value: _("This month") }
					],
					on: {
						onChange:  () => {
							this.$$("activitiesDatatable").filterByAll();

							this.$$("activitiesDatatable").filter((obj) => {
								let value = obj.DueDate;
								let filter = this.$$("activitiesToolbar").getValue();
								let now = new Date();
								let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
								let tomorrow = new Date(today.valueOf() + 86400000);
								let day = today.getDay();
								let monday = today.getDate() - day + ( day == 0 ? -6 : 1);
								let mondayThisWeek = new Date(today.setDate(monday));
								let sundayThisWeek = new Date(today.setDate(monday + 6));
								switch (filter) {
									case "overdue":
										return today - value > 0 && obj.State == "Open";
										break;
									case "completed":
										return obj.State == "Close";
										break;
									case "today": 
										return today - value <= 0 && today - value >= -86400000;
										break;
									case "tomorrow": 
										return tomorrow - value <= 0 && tomorrow - value >= -86400000;
										break;
									case "thisWeek":
										return value >= mondayThisWeek && value <= sundayThisWeek;
										break;
									case "thisMonth":
										return value.getMonth() == today.getMonth();
										break;
									default: return true;
								}
							}, "", true);
						}
					}				
				}, {},
				{
					rows: [
						{
							view: "button", type: "iconButton", icon: "plus", label: _("Add activity"), autowidth: true,
							click: () => {
								this.app.callEvent("dataEdit", [{}]);
							}
						}
					]
				}
			]
		};

		var activitiesDatatable = {
			view: "datatable",
			id: "activitiesDatatable",
			scrollX: false,
			select: true,
			columns: [
				{ id: "State", header: "", template: "{common.checkbox()}", width: 40, uncheckValue: "Open", checkValue: "Close" },
				{ id: "TypeID", header: [ _("Activity type"), { content: "selectFilter" }], sort: "string", options: activityTypes, width: 250 },
				{ id: "DueDate", header: [ _("Due date"), { content: "datepickerFilter" }], format: webix.i18n.dateFormatStr, sort: "date", width: 150 },
				{ id: "Details", header: [ _("Details"), { content: "textFilter" }], fillspace: true, sort: "string", width: 300 },
				{ id: "ContactID", header: [ _("Contact"), { content: "selectFilter" }], sort: "string", options: data, width: 200 },
				{ id: "edit", header: "", width: 40, template: "<span class='webix_icon fa-edit'></span>" },
				{ id: "delete", header: "", width: 40, template: "<span class='webix_icon fa-trash'></span>" }
			],
			onClick: {
				"fa-trash": (e, id) => {
					webix.confirm({
						title:  _("Information"),
						text:   _("Delete?"),
						ok:     _("OK"), 
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
					this.app.callEvent("dataEdit", [values]);
				}
			}
		};

		return { rows: [activitiesToolbar, activitiesDatatable] };
	}

	init() {
		this.$$("activitiesDatatable").sync(activity); 

		this.winEdit = this.ui(activitiesMess);

		this.on(this.app, "dataEdit", (data) => {
			this.winEdit.showWindow(data);
		});		
	}
}