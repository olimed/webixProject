import { JetView } from "webix-jet";
import { activity } from "models/activities";
import { activityTypes } from "models/activity_types";
import { data } from "models/contacts";

export default class ToolbarView extends JetView {
	config() {

		var editForm = {
			view: "form",
			id: "editForm",

			elements: [{
				rows: [
					{ view: "textarea", name: "Details", height: 200, label: "Details", labelAlign: "right" },
					{ view: "richselect", label: "Type", name: "TypeID", options: { data: activityTypes }, invalidMessage: "Please, choose type" },
					{ view: "richselect", label: "Contact", name: "ContactID", options: { data: data }, invalidMessage: "Please, choose contact" },
					{
						cols: [
							{ view: "datepicker", align: "right", label: "Date", name: "DueDate" },
							{ view: "datepicker", align: "right", label: "Time", type: "time", name: "formTime" }
						]
					},
					{ view: "checkbox", label: "Completed", name: "State", uncheckValue: "Open", checkValue: "Close", labelWidth: 90 },
					{
						cols: [
							{},
							{
								view: "button", id: "actionButton", label: buttonLabel, type: "form",
								click: () => {
									let values = this.$$("editForm").getValues();
									if (this.$$("editForm").validate()) {
										if (values.id) {
											activity.updateItem(values.id, values);
										} else {
											activity.add(values);
										}
										this.hideForm();
									}
								}
							},
							{
								view: "button", label: "Cancel",
								click: () => {
									this.hideForm();
								},
							}
						]
					},

				]
			}],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};

		let buttonLabel = (obj) => obj;

		var activitiesMess = {
			view: "window",
			id: "activitiesMess",
			height: 500,
			width: 700,
			position: "center",
			move: true,
			head: {
				id: "headMess",
				template: (obj) => {
					return `${obj.id ? "Edit" : "Add"} activity`;
				}
			},
			body: editForm
		};

		return activitiesMess;
	}

	showWindow(data) {
		this.getRoot().show();
		this.$$("editForm").setValues(data);
		this.$$("headMess").setValues(data);
		let action = data.id ? "Save" : "Add";

		this.$$("actionButton").setValue(action);

	}

	hideForm(){
		this.$$("editForm").hide();
		this.$$("editForm").clear();
		this.$$("editForm").clearValidation();
	}
}