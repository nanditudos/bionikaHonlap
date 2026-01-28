const params = new URLSearchParams(document.location.search);
const c = params.get("c");

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function submitComment() {
	if (document.getElementById("commentText").value==""&&document.getElementById("rating").value=="0") return
	await addItem({"type":"class","for":c,"text":document.getElementById("commentText").value,"rating":document.getElementById("rating").value})
	document.getElementById("commentText").value=""
	await renderComments(c, true)
	
}

async function renderComments(name, forceReload=false) {
	let allComments = await getAllItems(forceReload)
	let comments = []
	allComments.sort((a, b) => b["timestamp"]-a["timestamp"]);
	allComments.forEach(function (e) {
		if (e["data"]["type"]=="class"&&e["data"]["for"]==c) {
			comments.push(e)
		}
	});
	
	const container = document.getElementById("listedComments");
	container.innerHTML = "";

	if (comments.length === 0) {
	  container.innerHTML = `
		<div class="empty-state">
		  Még nincs hozzászólás ehhez a tárgyhoz.
		</div>
	  `;
	} else {
	  for (const e of comments) {
		const rating = e.data.rating;
		const text = e.data.text || "";
		const time = formatTimestamp(e.timestamp);

		let ratingHtml = "-";
		if (rating == 1) {
		  ratingHtml = `<span class="rating-up">▲ Jó</span>`;
		} else if (rating == -1) {
		  ratingHtml = `<span class="rating-down">▼ Rossz</span>`;
		}

		container.innerHTML += `
		  <div class="comment-card">
			<div class="comment-meta">
			  ${ratingHtml}
			  <span class="comment-time">${time}</span>
			</div>
			<div class="comment-text">${text}</div>
		  </div>
		`;
	  }
	}
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
		document.title = cdata["displayName"];
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

