import { JetView } from "webix-jet";
import settingsStatusesTable from "views/settingStatusesTable";
import settingsActivityTypesTable from "views/settingsActivityTypesTable";

export default class SettingView extends JetView {
    config() { 

        const _ = this.app.getService("locale")._;
        const lang = this.app.getService("locale").getLang();
        
        var localeSelector = {
            name:"lang", optionWidth: 120, view:"segmented", label: _("Language"), options:[
                {id:"en", value: _("English")},
                {id:"ru", value: _("Russian")}
            ], click:() => this.toggleLanguage(), value:lang 

        };

        var langHeader = {
            view: "label",
            label: _("Settings language"),
            css: "settingsHeader"
        };

        var statusesHeader = {
            view: "label",
            label: _("Statuses table"),
            css: "settingsHeader"
        };

        var activitytypesHeader = {
            view: "label",
            label: _("Activity types table"),
            css: "settingsHeader"
        };

        return { rows: [langHeader, localeSelector, statusesHeader, settingsStatusesTable, activitytypesHeader, settingsActivityTypesTable ]}
    }

    toggleLanguage(){
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name:"lang" }).getValue();
		langs.setLang(value);
	}
}