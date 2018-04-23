import datatable from "views/settingEditableTable";
import { statuses } from "models/statuses";

export default class StatusesTableView extends datatable{
	ready(view){
		view.queryView({ view:"datatable"}).parse(statuses);
	}
	add(){
		statuses.add({Value:"Change value", Icon: "Change icon"});
	}
	delete(id){
		statuses.remove(id);
	}
}