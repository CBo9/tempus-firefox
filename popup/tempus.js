document.getElementById('tempusBtn').addEventListener('click', tempus);


let lang, langID;
browser.storage.local.get('lang', (result) =>{
	var userLang = navigator.language || navigator.userLanguage; //language of the user's browser
	
	var request = new XMLHttpRequest();
	request.overrideMimeType("application/json");
	request.open('GET', 'lang.json', true);
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
			const data = JSON.parse(request.responseText);

			if(result.lang != undefined && data[result.lang] != undefined){  //if lang is already defined in storage
				lang = data[result.lang];
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
			setPopup();
		}
	};
	request.send();  	
});

function setPopup(){
	const button = document.getElementById('tempusBtn');
	button.innerHTML = lang.calc;
}

function tempus(){
	const message = document.getElementById('message');
	message.innerHTML = "";

	let input1 = document.getElementById('inputD1').value;
	let input2 = document.getElementById('inputD2').value;

	let date1 = new Date(input1);
	let date2 = new Date(input2);

	if(input1 == input2){
		let resultDiv = document.createElement('p');
		resultDiv.setAttribute('id', 'result');
		resultDiv.innerHTML = lang.sameDates;
		message.append(resultDiv);
		return;
	}

	if( isNaN(date1.getTime()) || isNaN(date2.getTime())){
		let resultDiv = document.createElement('p');
		resultDiv.setAttribute('id', 'result');
		resultDiv.innerHTML = lang.incorrectDate;
		message.append(resultDiv);
		return;
	}



	let diffDays = 0, diffMonths =0 , diffYears = 0;

	const daysPerMonth = {'0': 31, '2': 31, '3': 30,'4': 31, '5': 30, '6': 31, '7': 31, '8': 30, '9': 31, '10': 30, '11': 31};

	//swap the dates if needed, output: d2 always older than d1
	if(date1 > date2){
		let swap = date1;
		date1 = date2;
		date2 = swap;	
	}


	diffYears = date2.getFullYear() - date1.getFullYear();

	diffMonths = date2.getMonth() - date1.getMonth();
	if(diffMonths < 0){
		diffYears--;
		diffMonths+= 12;
	}

	diffDays = date2.getDate() - date1.getDate();
	if(diffDays < 0){
		diffMonths--;
		let month1 = date1.getMonth()
		if(month1 != 1){
			diffDays = ( daysPerMonth[month1] - date1.getDate() ) + date2.getDate();
		}else{
			let divEvenPer4 = date1.getFullYear() % 4 == 0 ? true : false;
			let divEvenPer100 = date1.getFullYear() % 100 == 0 ? true : false;
			let divEvenPer400 = date1.getFullYear() % 400 == 0 ? true : false;
			if( (divEvenPer4 == true && divEvenPer100 == false) || (divEvenPer4 == true && divEvenPer100 == true && divEvenPer400 == true) ){
				diffDays = ( 29 - date1.getDate() ) + date2.getDate();
			}else{
				diffDays = ( 28 - date1.getDate() ) + date2.getDate();
			}
		}
	}


	let result, daysResult, monthsResult, yearsResult;

	if(diffDays > 0){
		daysResult = diffDays == 1 ? `1 ${lang.d}` : `${diffDays} ${lang.ds}`
	}

	if(diffMonths > 0){
		monthsResult = diffMonths == 1 ? `1 ${lang.m}` : `${diffMonths} ${lang.ms}`
	}

	if(diffYears > 0){
		yearsResult = diffYears == 1 ? `1 ${lang.y}` : `${diffYears} ${lang.ys}`
	}



	if(yearsResult != null && daysResult != null && monthsResult != null){
		result = `${yearsResult}, ${monthsResult} ${lang.and} ${daysResult}`;
	}else if(yearsResult != null && monthsResult != null){
		result = `${yearsResult} ${lang.and} ${monthsResult}`;
	}else if(yearsResult != null && daysResult != null){
		result = `${yearsResult} ${lang.and} ${daysResult}`;
	}else if(monthsResult != null && daysResult != null){
		result = `${monthsResult} ${lang.and} ${daysResult}`;
	}else{
		if(yearsResult != null){
			result = yearsResult;
		}else{
			result = daysResult != null ? daysResult : monthsResult;
		}
	}

	let clipboard = document.createElement('div');
	clipboard.setAttribute('id', 'copyToClipboard');
	clipboard.addEventListener('click', () =>{
		const el = document.createElement('textarea');
		el.value = result;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.visibility = 'none';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);

		const notif = document.getElementById('copyToClipboard');
		notif.innerHTML = lang.copied;
		let removeNotif = setTimeout(() => {notif.innerHTML= lang.copyToClipboard}, 2000);

	});
	clipboard.innerHTML = lang.copyToClipboard;

	let resultDiv = document.createElement('p');
	resultDiv.setAttribute('id', 'result');
	resultDiv.innerHTML = `${lang.dur}: <span>${result}.</span>`;

	message.append(resultDiv);	
	message.append(clipboard);
}
