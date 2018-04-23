export const files = new webix.DataCollection({
	data: [
		{ id: 1, name: "1.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 1 },
		{ id: 2, name: "2.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 2 },
		{ id: 3, name: "3.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 2 },
		{ id: 4, name: "4.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 3 },
		{ id: 5, name: "1.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 3 },
		{ id: 6, name: "2.png", lastModifiedDate: "16-08-2017", size: 678790, ContactID: 3 }
	]
});

export default function removeRelatedFiles(id){
	for ( let key in files.data.pull ){
		if ( files.getItem(key).ContactID == id)
			files.remove(key);
	}
};