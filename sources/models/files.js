export const files = new webix.DataCollection({
	data: [
		{ id: 1, Name: "1.png", ChangeData: "16-08-2017", Size: 678790, ContactID: 1 },
		{ id: 2, Name: "2.png", ChangeData: "16-08-2017", Size: 678790, ContactID: 2 },
		{ id: 3, Name: "3.png", ChangeData: "16-08-2017", Size: 678790, ContactID: 2 },
		{ id: 4, Name: "4.png", ChangeData: "16-08-2017", Size: 678790, ContactID: 3 },
		{ id: 5, Name: "1.png", ChangeData: "16-08-2017", Size: 678790, ContactID: 3 },
		{ id: 6, Name: "2.png", ChangeData: "16-08-2017", Size: 678790, ContactID: 3 }
	],

	scheme: {
		$init: (obj) => {
			let parser = webix.Date.strToDate("%d-%m-%Y");
			obj.ChangeData = parser(obj.ChangeData);
		},
		$save: (obj) => {
			let parser = webix.Date.dateToStr("%d-%m-%Y");
			obj.ChangeData = parser(obj.ChangeData);
		}
	}
});