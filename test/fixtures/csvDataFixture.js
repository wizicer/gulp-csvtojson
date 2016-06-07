module.exports = [
	{
		name : "Standard Headers",
		csv : "Header1,Header2,Header3\n"+
					"col1-row1,col2-row1,col3-row1\n"+
					"col1-row2,col2-row2,col3-row2",
		expected : [{"Header1":"col1-row1","Header2":"col2-row1","Header3":"col3-row1"},{"Header1":"col1-row2","Header2":"col2-row2","Header3":"col3-row2"}]
	},
	{
		name : "Complex Headers",
		csv : "fieldA.title, fieldA.children[0].name, fieldA.children[0].id,fieldA.children[1].name, fieldA.children[1].employee[].name,fieldA.children[1].employee[].name, fieldA.address[],fieldA.address[], description\n" +
		            "Food Factory, Oscar, 0023, Tikka, Tim, Joe, 3 Lame Road, Grantstown, A fresh new food factory\n" +
		            "Kindom Garden, Ceil, 54, Pillow, Amst, Tom, 24 Shaker Street, HelloTown, Awesome castle",
		expected : [{"fieldA":{"title":"Food Factory","children":[{"name":"Oscar","id":23},{"name":"Tikka","employee":[{"name":"Tim"},{"name":"Joe"}]}],"address":["3 Lame Road","Grantstown"]},"description":"A fresh new food factory"},{"fieldA":{"title":"Kindom Garden","children":[{"name":"Ceil","id":54},{"name":"Pillow","employee":[{"name":"Amst"},{"name":"Tom"}]}],"address":["24 Shaker Street","HelloTown"]},"description":"Awesome castle"}] 
	}
];