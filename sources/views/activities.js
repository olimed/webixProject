import { JetView } from "webix-jet";
import activitiesMess from "views/activitiesForm";
import activitiesDatatable from "views/activitiesDatatable";

export default class DataView extends JetView {
	config() {

		var activitiesToolbar = {
			cols: [
				{
					view: "segmented",
					id: "activitiesToolbar",
					gravity: 6,
					options: [
						{ id: "all", value: "All" },
						{ id: "overdue", value: "Overdue" },
						{ id: "completed", value: "Completed" },
						{ id: "today", value: "Today" },
						{ id: "tomorrow", value: "Tomorrow" },
						{ id: "thisWeek", value: "This week" },
						{ id: "thisMonth", value: "This month" }
					],
					on: {
						onChange: function () {
							this.$$("activitiesDatatable").filterByAll();
						}
					}
				}, {},
				{
					rows: [
						{
							view: "button", type: "iconButton", icon: "plus", label: "Add activity", autowidth: true,
							click: () => {
								this.app.callEvent("dataEdit", [{}]);
							}
						}]
				}
			]
		};

		return { rows: [activitiesToolbar, activitiesDatatable] };
	}

	init() {
		this.winEdit = this.ui(activitiesMess);

		this.on(this.app, "dataEdit", (data) => {
			this.winEdit.showWindow(data);
		});
	}
}