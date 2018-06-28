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
function event_available(data1,data2){
    console.log(data1);
    console.log(data2);
    if(data1-data2<0){
        return (true);
    }
    else{
        alert("報名額滿");
        return (false);
    }
}
function encrypt(key, data) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(text, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
}

function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
}
