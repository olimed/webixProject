import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {

		var menu = {
			view: "menu", id: "top:menu",
			width: 180, layout: "y", select: true,
			template: "<span class='webix_icon fa-#icon#'></span> #value# ",
			data: [
				{ value: "Contacts", id: "contacts", icon: "users" },
				{ value: "Activities", id: "activities", icon: "calendar" },
				{ value: "Settings", id: "settings", icon: "cog" }
			],
			/*on: {
				onAfterSelect: function (id) {
					this.$$("header").
					$$(id).show();
				}
			}*/
		};

		var ui = {
			type: "line", rows: [
				{ type: "header", id: "header", template: "#value#", css: "header" },
				{
					cols: [
						{
							type: "clean", css: "app-left-panel",
							padding: 10, margin: 20, borderless: true, rows: [menu]
						},
						{
							rows: [{ height: 10 },
								{
									type: "clean", css: "app-right-panel", padding: 4, rows: [
										{ $subview: true }
									]
								}
							]
						}
					]
				}]
		};


		return ui;
	}
	init() {
		this.use(plugins.Menu, "top:menu");
		this.$$("header").bind($$("top:menu"));
	}
}