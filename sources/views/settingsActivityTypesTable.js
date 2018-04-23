import datatable from "views/settingEditableTable";
import { activityTypes } from "models/activity_types";

export default class ActivityTypesTableView extends datatable{
	ready(view){
		view.queryView({ view:"datatable"}).parse(activityTypes);
	}
	add(){
		activityTypes.add({Value:"Change value", Icon: "Change icon"});
	}
	delete(id){
		activityTypes.remove(id);
	}
}