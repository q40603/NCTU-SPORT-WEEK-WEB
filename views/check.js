
function validateForm_signup(){
	alert("資料有誤，表單送出失敗！");
	/*if (!checkEmail(document.myform.email.value) || !checkPhone_num(document.myform.phone_num.value) || !checkid(document.myform.uid.value, data.uid)){
		alert("資料有誤，表單送出失敗！");
		return(false);
	}
	alert("資料正確無誤，立刻送出表單！");
	form.submit();*/
	//return(true);
}

/*function checkEmail(email){
	index = email.indexOf ('@', 0);		
	if (email.length==0) {
		alert("請輸入電子郵件地址！");
		return (false);
	} else if (index==-1) 
		alert("錯誤：必須包含「@」。");
		return (false);
	} else if (index==0) {
		alert("錯誤：「@」之前不可為空字串。");
		return (false);
	} else if (index==email.length-1) {
		alert("錯誤：「@」之後不可為空字串。");
		return (false);
	} else
		return (true);
}
function checkPhone_num(phone_num){
	if (phone_num.length==0) {
		alert("請輸入電話號碼！");
		return (false);
	} 
	else if (phone_num.length!=10){
		alert("請輸入正確電話號碼格式( ex: 0912345678 )");
		return (false);		
	}
	else{
		return (true);
	}
}
function checkid(uid , db_uid){
	for(var i =0 ; i< db_uid.length ; i++){
		if(uid == db_uid[i]){
			alert("該用戶已經存在 !");
			return (false);
		}
	}
	return (true);
}*/

