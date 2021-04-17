const browserType = navigator.userAgent.match(new RegExp('Chrome')) ? chrome : browser;

document.getElementById('lang-select').addEventListener('change', changeLanguage);
fillOptionsPage();

function fillOptionsPage(){
	let lang, langID;
	browserType.storage.local.get('lang', (result) =>{
		var userLang = navigator.language || navigator.userLanguage; //language of the user's browser
		
		var request = new XMLHttpRequest();
		request.overrideMimeType("application/json");
		request.open('GET', '../data/lang.json', true);
		request.onreadystatechange = function () {
			if (request.readyState == 4 && request.status == "200") {
				const data = JSON.parse(request.responseText);
							
				if(result.lang != undefined && data[result.lang] != undefined){  //if lang is already defined in storage
					lang = data[result.lang];
					langID = result.lang;
				}else{
					if(data[userLang] != undefined){    //else checks if browser's language is available 
						lang = data[userLang];
						langID = userLang;                   
					}else{
						lang = data["en"];					//else default is english
						langID = "en";
					}
					browserType.storage.local.set({"lang": langID});
				}


				const i = Object.keys(data).length;
				const keys = Object.keys(data);

				const select = document.getElementById('lang-select');
				select.innerText = ""; //empties select

				for(let j = 0; j < i; j++){
					let key = keys[j];

					

					const el = document.createElement('option');
					el.innerText = data[key].name;
					el.value = key;
					if(langID == key){
						el.setAttribute("selected", true);
					}
					select.appendChild(el);
				}

				document.getElementById('options').innerText = lang.options;
				document.querySelector('#lang>label').innerText = lang.lang + ": ";

				const credit = document.getElementById('credit');
				credit.innerText = lang.created_by + " ";
				let githubLink = document.createElement("a");
				githubLink.href="https://github.com/CBo9";
				githubLink.classList.add("link");
				githubLink.innerText = "CBo9";
				githubLink.target = "_blank";
				credit.appendChild(githubLink);

				const version = document.getElementById('versID');
				version.innerText = browserType.runtime.getManifest().version;
				version.href = 'https://github.com/CBo9/tempus-firefox/releases/tag/v' + browserType.runtime.getManifest().version;
				version.target = "_blank";

			}
		};
		request.send();  	
	});
}






function changeLanguage(){
	let newLang = document.getElementById('lang-select').value;
	browserType.storage.local.set({"lang": newLang});
	fillOptionsPage();
}