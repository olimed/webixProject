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
								let filter = this.$$("activitiesToolbar").getValue();
								return filtering(obj, filter);								
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
			on: {
				onAfterFilter: () => {
					this.$$("activitiesDatatable").filter((obj) => {
						let filter = this.$$("activitiesToolbar").getValue();
						return filtering(obj, filter);
							
					}, "", true);
				}
			},
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

		function filtering(obj, filter){
			let value = obj.DueDate;
			let now = new Date();

			switch (filter) {
				case "overdue":
					return now - value > 0 && obj.State == "Open";
				case "completed":
					return obj.State == "Close";
				case "today": 
					return webix.Date.equal( webix.Date.dayStart( value, true), webix.Date.dayStart( now, true));
				case "tomorrow": 
					return webix.Date.equal( webix.Date.dayStart( value, true), webix.Date.add( webix.Date.dayStart( now, true), 1, "day", true));
				case "thisWeek":
					return webix.Date.equal( webix.Date.weekStart(value), webix.Date.weekStart(now));
				case "thisMonth":
					return webix.Date.equal( webix.Date.monthStart(value), webix.Date.monthStart(now));
				default: return true;
			}
		}
	}

	init() {
		this.$$("activitiesDatatable").sync(activity); 

		this.winEdit = this.ui(activitiesMess);

		this.on(this.app, "dataEdit", (data) => {
			this.winEdit.showWindow(data);
		});		
	}
}