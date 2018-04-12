import { JetView } from "webix-jet";
import { activity } from "models/activities";

export default class ToolbarView extends JetView {
	config() {
		var editForm = {
			view: "form",
			id: "editForm",
			elements: [{
				rows: [
					{ view: "textarea", name: "formTextarea", height: 200, label: "Details", labelAlign: "right" },
					{ view: "richselect", label: "Type", name: "formType" },
					{ view: "richselect", label: "Contact", name: "formRSelect" },
					{
						cols: [
							{ view: "datepicker", align: "right", label: "Date", name: "formDate" },
							{ view: "datepicker", align: "right", label: "Time", type: "time", name: "formTime" }
						]
					},
					{ view: "checkbox", label: "Completed", name: "formCheckbox" },
					{
						cols: [
							{},
							{
								view: "button", label: "Add (*save)", type: "form", id: "formAddButton",
								click: () => {
									let values = this.$$("editForm").getValues();
									if (values.id) {
										activity.updateItem(values.id, values);
										this.$$("activitiesMess").hide();
									} else {
										activity.add(values);
										this.$$("activitiesMess").hide();
									}

								}
							},
							{
								view: "button", label: "Cancel",
								click: () => { this.$$('activitiesMess').hide(); this.$$("editForm").clear(); },
							}
						]
					},

				]
			}],
			rules: {
				formType: webix.rules.isNotEmpty,
				formRSelect: webix.rules.isNotEmpty
			}
		};

		var activitiesMess = {
			view: "window",
			id: "activitiesMess",
			height: 500,
			width: 700,
			position: "center",
			move: true,
			head: { view: "label", label: "Add (*edit) activity", align: "center" },
			body: editForm
		};

		return activitiesMess;
	}

	init() {
		this.on(this.app, "dataEdit", (data) => {
			if (data) {
				this.$$("editForm").setValues(data);
			}
		});
	}

	showWindow() {
		this.getRoot().show();
	}

}