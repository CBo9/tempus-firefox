document.getElementById('tempusBtn').addEventListener('click', tempus);

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
		resultDiv.innerHTML = `Les dates sont identiques`;
		message.append(resultDiv);
		return;
	}

	if( isNaN(date1.getTime()) || isNaN(date2.getTime())){
		let resultDiv = document.createElement('p');
		resultDiv.setAttribute('id', 'result');
		resultDiv.innerHTML = `Une date est incorrecte`;
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
		daysResult = diffDays == 1 ? `1 jour` : `${diffDays} jours`
	}

	if(diffMonths > 0){
		monthsResult = `${diffMonths} mois`;
	}

	if(diffYears > 0){
		yearsResult = diffYears == 1 ? `1 année` : `${diffYears} années`
	}



	if(yearsResult != null && daysResult != null && monthsResult != null){
		result = `${yearsResult}, ${monthsResult} et ${daysResult}`;
	}else if(yearsResult != null && monthsResult != null){
		result = `${yearsResult} et ${monthsResult}`;
	}else if(yearsResult != null && daysResult != null){
		result = `${yearsResult} et ${daysResult}`;
	}else if(monthsResult != null && daysResult != null){
		result = `${monthsResult} et ${daysResult}`;
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
		notif.innerHTML = "Copié";
		let removeNotif = setTimeout(() => {notif.innerHTML="Copier dans le presse-papier"}, 2000);

	});
	clipboard.innerHTML = 'Copier dans le presse-papier';
	

	let resultDiv = document.createElement('p');
	resultDiv.setAttribute('id', 'result');
	resultDiv.innerHTML = `Il s'est écoulé <span>${result}.</span>`;

	message.append(resultDiv);	
	message.append(clipboard);
}

