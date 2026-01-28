const params = new URLSearchParams(document.location.search);
const c = params.get("c");

async function submitComment() {
	addItem({"type":"class","for":c,"text":document.getElementById("commentText").value,"rating":document.getElementById("rating").value})
}

async function renderComments(name) {
	const allComments = await getAllItems()
	allComments.forEach(function (e) {
		if (e["data"]["type"]=="class"&&e["data"]["for"]==c) {
			document.getElementById("listedComments").innerHTML+=`<pre>${`${{"0":"","1":"Rating: ▲\n","-1":"Rating: ▼\n"}[e["data"]["rating"]]}`}${e["data"]["text"]}</pre>`
		}
	});
}

if (c === null) {
	console.error(`Invalid format.`)
} else {
	const cdata = getClass(c);
	if (cdata === null) {
		console.error(`No class found with the name ${c}.`)
	} else {
		//console.log(cdata);
		document.getElementById("nev").innerHTML=cdata["displayName"];
		document.getElementById("tipus").innerHTML=generateClassTypeList(cdata["credits"]).join("+");
		document.getElementById("kredit").innerHTML=generateNonNullList(cdata["credits"]).join("+");
		document.getElementById("orak").innerHTML=generateNonNullList(cdata["hours"]).join("+");
		if (cdata["primarySemester"] != null) document.getElementById("felev").innerHTML=cdata["primarySemester"];
		if (cdata["secondarySemesters"].length>0) document.getElementById("masodlagosFelev").innerHTML=`(${cdata["secondarySemesters"].join(", ")})`;
		let elofeltetelLista=[];
		cdata["dependencies"].forEach(function (e) {
			elofeltetelLista.push(`<a href="classinfo.html?c=${e}">${getClass(e)["displayName"]}</a>`);
		})
		document.getElementById("elofeltetel").innerHTML=elofeltetelLista.join(", ");
		document.getElementById("tanarok").innerHTML=cdata["teachers"].join(", ");
		document.getElementById("leiras").innerHTML=cdata["description"];
		document.getElementById("kotelezo").innerHTML={"K":"Kötelező","KV":"Kötelezően Választható","SZV":"Szabadon Választható","U":"Egyéb"}[cdata["category"]];
		renderComments()
	}
}

