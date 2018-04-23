import { JetView } from "webix-jet";
import { activity } from "models/activities";
import { activityTypes } from "models/activity_types";
import { data } from "models/contacts";

export default class ToolbarView extends JetView {
	config() {

		const _ = this.app.getService("locale")._;

		var editForm = {
			view: "form",
			elements: [{
				rows: [
					{ view: "textarea", name: "Details", height: 200, label: _("Details"), labelAlign: "right" },
					{ view: "richselect", label: _("Type"), name: "TypeID", options: { data: activityTypes }, invalidMessage: "Please, choose type" },
					{ view: "richselect", label: _("Contact"), name: "ContactID", options: { data: data }, invalidMessage: "Please, choose contact" },
					{
						cols: [
							{ view: "datepicker", align: "right", label: _("Date"), name: "DueDate" },
							{ view: "datepicker", align: "right", label: _("Time"), type: "time", name: "formTime" }
						]
					},
					{ view: "checkbox", label: _("Completed"), name: "State", uncheckValue: "Open", checkValue: "Close", labelWidth: 90 },
					{
						cols: [
							{},
							{
								view: "button", label: buttonLabel, type: "form",
								click: () => {	
									let win = this.getRoot();								
									let values = win.getBody().getValues(); 
									if (win.getBody().validate()) {
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
								view: "button", label: _("Cancel"),
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
			height: 500,
			width: 700,
			position: "center",
			move: true,
			head: {
				template: (obj) => {
					return `${obj.id ? _("Edit activity") : _("Add activity")}`;
				}
			},
			body: editForm
		};

		return activitiesMess;
	}

	showWindow(data) {
		const _ = this.app.getService("locale")._;
		let win = this.getRoot();
		win.show();
		if (data.parentView)
			win.getBody().queryView({label: _("Contact")}).disable();
		win.getBody().setValues(data);
		win.getHead().setValues(data);
		let action = data.id ? _("Save") : _("Add");
		win.getBody().queryView({view: "button", type: "form"}).setValue(action);
	}

	hideForm(){
		let win = this.getRoot();
		win.getBody().hide();
		win.getBody().clear();
		win.getBody().clearValidation();
	}
}