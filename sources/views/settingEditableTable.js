import { JetView } from "webix-jet";

export default class DataTableView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let table = {
			view: "datatable",
			gravity: 4,
			scrollX: false,
			editable: true,
			columns: [
				{ id: "Value", header: _("Value"), fillspace: true, editor: "text" },
				{ id: "Icon", header: _("Icon"), editor: "text" },
				{ id: "delete", header: "", width: 40, template: "<span class='webix_icon fa-trash'></span>" }
			],
			editaction: "dblclick",
			select: true,
			onClick: {
				"fa-trash": (e, id) => {
					let thisTable = this;
					webix.confirm({
						title: _("Information"),
						text: _("Delete?"),
						ok: _("OK"),
						cancel: _("Cancel"),
						callback: function (result) {
							if (result == true) {
								thisTable.delete(id);
							}
						}
					});
					return false;
				}
			}
		};

		var buttons = {
			cols: [
				{},
				{},
				{
					view: "button", value: _("Add"), gravity: 1,
					click: () => {
						this.add();
					}
				}
			]
		};
		return { rows: [table, buttons] };
	}

	init() {
		this.table = this.getRoot().queryView({ view: "datatable" });
	}
}