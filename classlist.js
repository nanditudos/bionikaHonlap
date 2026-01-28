async function shortDescription(c) {
	const cdata=getClass(c)
	const rating=await getRatingOf(c)
	return `<p><a href="classinfo.html?c=${cdata["name"]}">${cdata["displayName"]}</a> ${rating==0?"":(rating<0?`(▼${-rating})`:`(▲${rating})`)} ; Ajánlott félév: ${cdata["primarySemester"]} ; ${generateClassTypeListShort(cdata["credits"]).join("+")} ; ${generateNonNullList(cdata["credits"]).join("+")} kr</p>`
}
async function keres() {
	let matched=[]
	//selecting classes matching prerequisites
	data["classes"].forEach(function (v) {
		let matches=true
		const feletelTipusa = document.getElementById("felvetelTipusa").value
		if (feletelTipusa!="mind") {
			if (v["category"]!=feletelTipusa) matches=false
		}
		const kategoria = document.getElementById("kategoria").value
		if (kategoria!="mind") {
			if (!v["subcategory"].includes(kategoria)) matches=false
		}
		const felev = document.getElementById("felev").value
		if (felev!="mind") {
			if (v["primarySemester"]!=felev) matches=false
		}
		const targynev = document.getElementById("targynev").value
		if (targynev!="") {
			if (!v["displayName"].toLowerCase().includes(targynev.toLowerCase())) matches=false
		}
		if (!v["active"]) matches=false
		if (matches) {
			matched.push(v["name"])
		}
	})
	//sorting matches
	const sortmethod = document.getElementById("rendezes").value
	if (sortmethod=="ABC+"||sortmethod=="ABC-") {
		matched.sort();
	}
	if (sortmethod=="ABC-") {
		matched.reverse();
	}
	//rendering matches
	let out=""
	out+=`<table>`
	for (let i=0; i<matched.length; i++) {
		out+=`<tr><td>${await shortDescription(matched[i])}</td></tr>`
	}
	out+=`</table>`
	document.getElementById("listArea").innerHTML=out
}
keres()