
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
            req.session.login = true;
            req.session.uid = results[0].uid;
            req.session.user = results[0];
            console.log(results[0].uid);
            res.redirect('/');
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
exports.events = function(req, res){
   var sql = "SELECT ename,rule , event_id FROM `event`";
   db.query(sql, function(err, result){  
      console.log(result);
      res.render('events.ejs',{data:result});
   });   
}
//--------------------------------render rule-----------------------------------------------
exports.rule = function(req, res){
   
      var id= req.params.event_id;
      console.log(id); 
      var sql="SELECT event_id,ename, rule, min_team_mem, max_team_mem FROM `event` WHERE `event_id`='"+id+"'";   
                           
      db.query(sql, function(err, results){    
         res.render('rule.ejs',{data:results});  
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
//------------------------------------------render registration-------------------------------------------
exports.register = function(req, res){
   if(req.method == "POST"){
      var post  = req.body;
      console.log(post);
      res.redirect('/');
      /*var uid= post.uid;
      var pass= post.password;
     console.log(pass);
      var sql="SELECT uid, password, uname FROM `user` WHERE `uid`='"+uid+"' and password = '"+pass+"'";                         
      db.query(sql, function(err, results){    
          console.log(results[0]);
         if(results.length){
            req.session.login = true;
            req.session.uid = results[0].uid;
            req.session.user = results[0];
            console.log(results[0].uid);
            res.redirect('/');
         }
         else{
            message = '帳號或密碼輸入錯誤';
            res.render('login.ejs',{message: message});
         }
                 
      });*/
   } 
   else {
      var id= req.params.event_id;
      console.log(id); 
      var sql="SELECT event_id, ename, min_team_mem, max_team_mem FROM `event` WHERE `event_id`='"+id+"'";   
      db.query(sql, function(err, results){    
         res.render('register.ejs',{data:results});  
      });
   }       
      
}
//---------------------------------------------Delete annc-----------------------------------------------
exports.anncDelete = function(req, res){

      var id = req.params.annc_id;
      var sql = "Delete FROM `announce` WHERE `announce_id`='"+id+"'";

      db.query(sql, function(err,results){
         res.redirect("/");
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
