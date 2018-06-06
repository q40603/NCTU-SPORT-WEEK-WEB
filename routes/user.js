
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var uname= post.uname;
      var uid= post.uid;
      var email= post.email;
      var phone_num= post.phone_num;
      var pass= post.password;
      var department = post.department;
      var gender = post.gender;
      console.log(phone_num);
      /*var dep_id_search = "select dcid from `department` where `dname`='"+department+"' ";
      var dcid;
      var query = db.query(dep_id_search, function(err, result) {
         dcid = result[0].dcid;
         console.log(dcid);
      });*/
      var sql = "INSERT INTO `user`(`uid`,`dcid`,`uname`,`gender`,`email`,`phone_num`, `password`) VALUES ('" + uid + "','"+ department +"','" + uname + "','" + gender + "','" + email + "','" + phone_num + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {
         console.log(result)
         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {

      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var uid= post.uid;
      var pass= post.password;
     console.log(pass);
      var sql="SELECT uid, password, uname FROM `user` WHERE `uid`='"+uid+"' and password = '"+pass+"'";                         
      db.query(sql, function(err, results){    
          console.log(results[0]);
         if(results.length){
            req.session.uid = results[0].uid;
            req.session.user = results[0];
            console.log(results[0].uid);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } 
   else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
      id = req.session.uid;
   console.log('ddd='+id);
   if(id == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM `user` WHERE `uid`='"+id+"'";

   db.query(sql, function(err, results){
      console.log(results);
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var id = req.session.uid;
   if(id == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `user` WHERE `uid`='"+id+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var id = req.session.id;
   if(id == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `user` WHERE `id`='"+id+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};
