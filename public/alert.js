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
