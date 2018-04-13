import { JetView } from "webix-jet";
import activitiesMess from "views/activitiesForm";
import activitiesDatatable from "views/activitiesDatatable";

export default class DataView extends JetView {
    config() {

        var contactsForm = {
            view: "form",
            id: "contactsForm",
            elements: [{
                rows: [
                    { template: "Edit (*add) contacts"},
                    { cols: [
                        { rows: [
                            { view:"text", label:"Fist name", name: "FirstName" },
                            { view:"text", label:"Last name", name: "LastName" },
                            { view: "datepicker", align: "right", label:"Joining date", name: "StartDate" },
                            { view:"text", label:"Status",  name: "StatusID" },
                            { view:"text", label:"Job",  name: "Job" },
                            { view:"text", label:"Company",  name: "Company" },
                            { view:"text", label:"Website",  name: "Website" },
                            { view:"text", label:"Address",  name: "Address" }
                        ]},
                        { rows: [
                            { view:"text", label:"Email",  name: "Email" },
                            { view:"text", label:"Skype",  name: "Skype" },
                            { view:"text", label:"Phone",  name: "Phone"},
                            { view: "datepicker", align: "right", label: "Birthday", name: "Birthday"},
                            { cols: [
                                {template: '<img alt="user-photo">'},
                                { rows: [
                                    {},
                                    { view: "button", label: "Change photo"},
                                    { view: "button", label: "Delete photo"}
                                ]}
                            ]}
                        ]}
                    ]},
                    { },
                    { cols:[
                        {},
                        { view: "button", label: "Cancel", 
                            click: () => {
                                this.show("contactsTemplateInfo");
                            }
                        },
                        { view: "button", label: "Save"}
                    ]}
                ]}
            ],
        };

        return contactsForm;
    }
}