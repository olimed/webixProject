import { JetView } from "webix-jet";
import { activity } from "models/activities";
import { activityTypes } from "models/activity_types";
import  { data } from "models/contacts";

export default class DatatableView extends JetView{
	config(){
		var activitiesDatatable = {
			view: "datatable",
			id: "activitiesDatatable",
			scrollX: false,
			select: true,
			columns: [
				{ id: "State",     header: "", template:"{common.checkbox()}", width:40, uncheckValue:"Open", checkValue:"Close"},
				{ id: "TypeID",    header: ["Activity type", { content: "selectFilter" }],sort:"string", options: activityTypes, width: 250},
				{ id: "DueDate",   header: ["Due date",      { content: "datepickerFilter" }], format:webix.i18n.dateFormatStr, sort:"date", width: 150},
				{ id: "Details",   header: ["Details",       { content: "textFilter" }],fillspace: true, sort:"string", width: 300},
				{ id: "ContactID", header: ["Contact",       { content: "selectFilter"}], sort:"string", options: data, width: 200},
				{ id: "edit",      header: "", width: 40, template: "<span class='webix_icon fa-edit'></span>"},
				{ id: "delete",    header: "", width: 40, template: "<span class='webix_icon fa-trash'></span>"}
			],
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
					this.app.callEvent("dataEdit", [values]);
				}
			}
		};
		
		return activitiesDatatable;
	}

	init(){
		this.$$("activitiesDatatable").sync(activity);
	}
}