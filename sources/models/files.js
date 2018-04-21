export const files = new webix.DataCollection({
	data: [
		{ id: 1, name: "1.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 1 },
		{ id: 2, name: "2.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 2 },
		{ id: 3, name: "3.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 2 },
		{ id: 4, name: "4.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 3 },
		{ id: 5, name: "1.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 3 },
		{ id: 6, name: "2.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 3 }
	],

	/*scheme: {
		$init: (obj) => {
			let parserToDate = webix.Date.strToDate("%d-%m-%Y");
			let parserToStr = webix.Date.dateToStr("%d-%m-%Y");
			if (obj.ContactID)
				obj.lastModifiedDate = parserToDate(obj.lastModifiedDate);
			else {
				//obj.lastModifiedDate = parserToStr(obj.lastModifiedDate);
				obj.lastModifiedDate = obj.lastModifiedDate.getDate() + "-" + obj.lastModifiedDate.getMonth() + "-" + obj.lastModifiedDate.getFullYear();
			}
		},
		$save: (obj) => {
			let parser = webix.Date.dateToStr("%d-%m-%Y");
			obj.lastModifiedDate = parser(obj.lastModifiedDate);
		}
	}*/
});

export default function removeRelatedFiles(id){
	for ( let key in files.data.pull ){
		if ( files.getItem(key).ContactID == id)
			files.remove(key);
	}
};