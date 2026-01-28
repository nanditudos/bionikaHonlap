function estimateFontSize(t) {
	let m = 0
	for (let i=0; i<t.length; i++) {
		if (t[i]=="m") m++
	}
	return Math.min(24,Math.floor(17/(t.length+m)*24))
}

function keres() {
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
	//rendering matches
	const verticalEmpty = 20
	const verticalBlock = 50
	const horizontalEmpty = 20
	const horizontalBlock = 200
	const colorScheme = {"U":"#ffffff","M":"#bdbdbd","G":"#ffd7cb","K":"#b6c7db","F":"#ffb56c","B":"#abcf91","I":"#ffffa5"}
	let out=""
	//rendering connections
	data["connections"].forEach(function (v) {
		if (matched.includes(v["source"])&&matched.includes(v["destination"])) {
			const posSource = getClass(v["source"])["position"];
			const posDestination = getClass(v["destination"])["position"];
			if (posSource["x"]+1==posDestination["x"]) {//Egymást követő félévekben
				out+=`<line x1="${(horizontalEmpty+horizontalBlock)*posSource["x"]}" y1="${1*verticalEmpty+0.5*verticalBlock+(verticalEmpty+verticalBlock)*posSource["y"]}" x2="${(horizontalEmpty+horizontalBlock)*posSource["x"]+horizontalEmpty}" y2="${1*verticalEmpty+0.5*verticalBlock+(verticalEmpty+verticalBlock)*posDestination["y"]}" style="stroke:${colorScheme[v["origin"]]};stroke-width:5" />`
			} else {
				const pos1 = {"x":posSource["x"]*(horizontalEmpty+horizontalBlock)+horizontalEmpty/2,"y":(verticalEmpty+verticalBlock)*v["position"]["y"]+verticalEmpty/2}
				const pos2 = {"x":(posDestination["x"]-1)*(horizontalEmpty+horizontalBlock)+horizontalEmpty/2,"y":(verticalEmpty+verticalBlock)*v["position"]["y"]+verticalEmpty/2}
				out+=`<line x1="${(horizontalEmpty+horizontalBlock)*posSource["x"]}" y1="${1*verticalEmpty+0.5*verticalBlock+(verticalEmpty+verticalBlock)*posSource["y"]}" x2="${pos1["x"]}" y2="${pos1["y"]}" style="stroke:${colorScheme[v["origin"]]};stroke-width:5" />`
				out+=`<line x1="${pos1["x"]}" y1="${pos1["y"]}" x2="${pos2["x"]}" y2="${pos2["y"]}" style="stroke:${colorScheme[v["origin"]]};stroke-width:5" />`
				out+=`<line x1="${pos2["x"]}" y1="${pos2["y"]}" x2="${(horizontalEmpty+horizontalBlock)*(posDestination["x"]-1)+horizontalEmpty}" y2="${1*verticalEmpty+0.5*verticalBlock+(verticalEmpty+verticalBlock)*posDestination["y"]}" style="stroke:${colorScheme[v["origin"]]};stroke-width:5" />`
			}
		}
	});
	//rendering blocks
	for (let i=0; i<7; i++) {
		out+=`<rect x="${horizontalEmpty+(horizontalEmpty+horizontalBlock)*i}" y="${verticalEmpty}" width="${horizontalBlock}" height="${verticalBlock}" fill="${colorScheme["U"]}" />`
		out+=`<text id="${`felev_${i}`}" x="${1*horizontalEmpty+0.5*horizontalBlock+(horizontalEmpty+horizontalBlock)*i}" y="${1*verticalEmpty+0.5*verticalBlock}" text-anchor="middle" dominant-baseline="middle" font-size="35" font-family="sans-serif" font-weight="bold" fill="black">${`${i+1}. félév`}</text>`
	}
	for (let i=0; i<matched.length; i++) {
		const cdata=getClass(matched[i]);
		if (cdata["position"] == null) continue;
		const x = cdata["position"]["x"]-1
		const y = cdata["position"]["y"]
		out+=`<a href="classinfo.html?c=${cdata["name"]}" target="_blank">`
		out+=`<rect x="${horizontalEmpty+(horizontalEmpty+horizontalBlock)*x}" y="${verticalEmpty+(verticalEmpty+verticalBlock)*y}" width="${horizontalBlock}" height="${verticalBlock}" fill="${colorScheme[cdata["origin"]]}" />`
		out+=`<text x="${1*horizontalEmpty+0.5*horizontalBlock+(horizontalEmpty+horizontalBlock)*x}" y="${1*verticalEmpty+0.33*verticalBlock+(verticalEmpty+verticalBlock)*y}" text-anchor="middle" dominant-baseline="middle" font-size="${estimateFontSize(cdata["displayName"])}" font-family="sans-serif" font-weight="bold" fill="black">${cdata["displayName"]}</text>`
		out+=`<text x="${1*horizontalEmpty+0.5*horizontalBlock+(horizontalEmpty+horizontalBlock)*x}" y="${1*verticalEmpty+0.78*verticalBlock+(verticalEmpty+verticalBlock)*y}" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="sans-serif" font-weight="bold" fill="red">${generateClassTypeListShort(cdata["credits"]).join("+")}</text>`
		out+=`</a>`
	}
	
	
	document.getElementById("drawArea").innerHTML = out

}
keres()
