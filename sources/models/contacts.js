export const data = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",

	scheme: {
		$change: (obj) => {
			obj.value = obj.FirstName + " " + obj.LastName; 
			let parser = webix.Date.strToDate("%d-%m-%Y");
			obj.Birthday = parser(obj.Birthday);
			obj.StartDate = parser(obj.StartDate);	
			if (obj.Photo == " ")		
				obj.Photo = "";
		},
		$save: (obj) => {
			let parser = webix.Date.dateToStr("%d-%m-%Y");
			obj.Birthday = parser(obj.Birthday);
			obj.StartDate = parser(obj.StartDate);
			if (obj.Photo == "")		
				obj.Photo = " ";
		}
	}
});