export const activity = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",

	scheme: {
		$init: (obj) => {
			let parser = webix.Date.strToDate("%d-%m-%Y");
			obj.DueDate = parser(obj.DueDate);

		},
		$save: (obj) => {
			let parser = webix.Date.dateToStr("%d-%m-%Y");
			obj.DueDate = parser(obj.DueDate);
		}
	}
});

export default function removeRelatedActivities(id){
	for ( let key in activity.data.pull ){
		if ( activity.getItem(key).ContactID == id)
			activity.remove(key);
	}
};