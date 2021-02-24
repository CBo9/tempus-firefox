document.getElementById('lang-select').addEventListener('change', changeLanguage);
fillOptionsPage();

function fillOptionsPage(){
	let lang, langID;
	browser.storage.local.get('lang', (result) =>{
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
					browser.storage.local.set({"lang": langID});
				}


				const i = Object.keys(data).length;
				const keys = Object.keys(data);

				const select = document.getElementById('lang-select');
				select.innerHTML = ""; //empties select

				for(let j = 0; j < i; j++){
					let key = keys[j];

					

					const el = document.createElement('option');
					el.innerHTML = data[key].name;
					el.value = key;
					if(langID == key){
						el.setAttribute("selected", true);
					}
					select.appendChild(el);
				}

				document.getElementById('options').innerHTML = lang.options;
				document.querySelector('#lang>label').innerHTML = lang.lang + ": ";
			}
		};
		request.send();  	
	});
}






function changeLanguage(){
	let newLang = document.getElementById('lang-select').value;
	browser.storage.local.set({"lang": newLang});
	fillOptionsPage();
}