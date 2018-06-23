
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
      var grade = post.grade;
      console.log(post);
      var sql = "INSERT INTO `test`.`user` (`uid`, `dcid`, `uname`, `gender`, `email`, `phone_num`, `password`, `grade`) VALUES ('" + uid + "','"+ department +"','" + uname + "','" + gender + "','" + email + "','" + phone_num + "','" + pass + "','" + grade + "');"

      var query = db.query(sql, function(err, result) {
         console.log(result)
         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } 
   else {

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
            message = '帳號或密碼輸入錯誤';
            res.render('login.ejs',{message: message});
         }
                 
      });
   } 
   else {
      res.render('login.ejs',{message: message});
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
//---------------------------------render event list-----------------------------------------------
exports.evenlist = function(req, res){
   var sql = "SELECT ename, remain FROM `event`";
   db.query(sql, function(err, result){  
      res.render('evenlist.ejs',{data:result});
   });   
}
//---------------------------------render announce title-------------------------------------------
exports.index = function(req, res){
   var sql = "SELECT announce_id, year(announce_date) as year, month(announce_date) as month, day(announce_date) as day, title from `announce`";
   db.query(sql, function(err, result){  
      res.render('index.ejs',{data:result});
   });   
}
//---------------------------------render announce content-----------------------------------------------
exports.anncs = function(req, res){
   
      console.log("fuck");
      var id= req.params.annc_id;
      console.log(id); 
      var sql="SELECT title, content, announce_date FROM `announce` WHERE `announce_id`='"+id+"'";   
                           
      db.query(sql, function(err, results){    
         res.render('anncs.ejs',{data:results});  
      });
      
}
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
