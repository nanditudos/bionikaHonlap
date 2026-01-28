async function shortDescription(c) {
	const cdata=getClass(c)
	const rating=await getRatingOf(c)
	return `
	  <td class="col-name">
		<a href="classinfo.html?c=${cdata["name"]}">
		  ${cdata["displayName"]}
		</a>
		${rating==0 ? "" : (rating < 0 ? `<span class="rating-down">▼${-rating}</span>` : `<span class="rating-up">▲${rating}</span>`)}
	  </td>
	  <td class="col-semester">
		${cdata["primarySemester"]?cdata["primarySemester"]:"-"}
	  </td>
	  <td class="col-type">
		${generateClassTypeListShort(cdata["credits"]).join("+")}
	  </td>
	  <td class="col-credit">
		${generateNonNullList(cdata["credits"]).join("+")} kr
	  </td>
`;
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
	let out = "";
	if (matched.length === 0) {
		out = `<div class="empty-state">Nincs a feltételeknek megfelelő tárgy.</div>`;
	} else {
		out += `<table class="class-table">`;
		out += `<thead><tr><th>Tárgynév</th><th>Ajánlott félév</th><th>Óratípus</th><th>Kredit</th></tr></thead><tbody>`;
		for (let i = 0; i < matched.length; i++) {
			out += `<tr>${await shortDescription(matched[i])}</tr>`;
		}
		out += `</tbody></table>`;
	}
	document.getElementById("listArea").innerHTML = out;
}
keres()