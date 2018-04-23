import { JetView } from "webix-jet";
import settingsStatusesTable from "views/settingStatusesTable";
import settingsActivityTypesTable from "views/settingsActivityTypesTable";

export default class SettingView extends JetView {
	config() {

		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		var localeSelector = {
			name: "lang", optionWidth: 120, view: "segmented", label: _("Language"), options: [
				{ id: "en", value: _("English") },
				{ id: "ru", value: _("Russian") }
			], click: () => this.toggleLanguage(), value: lang

		};

		var langHeader = {
			type: "section",
			template: _("Settings language")
		};

		var statusesHeader = {
			type: "section",
			template: _("Statuses table")
		};

		var activitytypesHeader = {
			type: "section",
			template: _("Activity types table")
		};

		return {
			rows: [
				langHeader,
				localeSelector,
				statusesHeader,
				settingsStatusesTable,
				activitytypesHeader,
				settingsActivityTypesTable
			]
		};
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name: "lang" }).getValue();
		langs.setLang(value);
	}
}