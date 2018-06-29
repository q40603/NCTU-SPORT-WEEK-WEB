function sure_logout(){
	var retVal = confirm("確定要登出嗎 ?");
    if (retVal == true)
    {
        return true;
    } 
    else
    {
        return false;
    }
}
function sure_delete_annc(){
	var retVal = confirm("確定要刪除公告嗎 ?");
    if (retVal == true)
    {
        return true;
    } 
    else
    {
        return false;
    }
}
function event_available(data1,data2,admin){
    console.log(data1);
    console.log(data2);
    console.log(admin);
    if(admin == 'true'){
        alert("哈囉 管理員 你想幹嘛");
        return true;
    }
    if(data1-data2<0){
        alert("還有名額 趕快報名");
        return (true);
    }
    else{
        alert("報名額滿");
        return (false);
    }
}
function confir(){
    if(myform.password.value == myform.password_confirm.value){
        return(true);
    }
    else{
        alert("密碼與確認密碼不一致");
        return(false);
    }
}
function myFunction(){
    var x=document.getElementById("login-username");
    x.value=x.value.toUpperCase();
}

