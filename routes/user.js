
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
         if(err){
            res.render('signup.ejs',{message: "註冊失敗 請確認該用戶是否已存在"});
         }
         else{
            message = "Succesfully! Your account has been created.";
            res.render('signup.ejs',{message: message});            
         }
      });
   } 
   else{
      var sql="SELECT uid FROM `user`";
      db.query(sql, function(err, results){
         console.log(results);
         res.render('signup.ejs', {data:results, message: message});    
      });      
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
      var sql="SELECT admin, uid, password, uname FROM `user` WHERE `uid`='"+uid+"' and password = '"+pass+"'";                         
      db.query(sql, function(err, results){    
          console.log(results[0]);
         if(results.length){
            req.session.admin = false;
            if(results[0].admin == 1){
               req.session.admin = true;
            }
            req.session.login = true;
            req.session.valid_reg= true;
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
   var message = "";
   var sql = "SELECT announce_id, year(announce_date) as year, month(announce_date) as month, day(announce_date) as day, title from `announce`";
   db.query(sql, function(err, result){  
      res.render('index.ejs',{data:result, message: message});
   });   
}
//---------------------------------render announce content-----------------------------------------------
exports.anncs = function(req, res){
   
      console.log("fuck");
      var id= req.params.annc_id;
      console.log(id); 
      var sql="SELECT title, content, announce_date FROM `announce` WHERE `announce_id`='"+id+"'";   
                           
      db.query(sql, function(err, results){   
         if(results.length){
            res.render('anncs.ejs',{data:results});
         }
         else{
            res.render('anncadd.ejs');
         }   
      });
      
}
//------------------------------------------render registration-------------------------------------------
exports.register = function(req, res){
   var message = "" ;
   if(req.method == "POST"){
      var post  = req.body;
      var event_id = post.event_id;
      var team_name = post.team_name;
      var uid = post.uid;
      var leader = post.leader;
      var max_length = post.team_mem;
      console.log(post);
      var actual_length = 0;
      var isvalid=1;
      for(var i=0; i<max_length; i++){
         if(uid[i]>0){
            var sql0="SELECT uid FROM `user` WHERE `uid`='"+uid[i]+"'";
            db.query(sql0, function(err, result){
               console.log(result);
               if(!result.length){
                  message = "someone hasn't signup yet!";
                  req.session.valid_reg=false;
                  isvalid=0;
                  res.redirect('/register/'+event_id);
                  console.log("hen 棒嗎");
                  //req.flash('info', 'invalid user');              
               }          
            })
            actual_length ++ ;
         }
      }
      if(isvalid == 1){
         req.session.valid_reg=true;
      }
      console.log(actual_length);
      var sql1 = "INSERT INTO `team` (`team_name`,`team_mem`) VALUES ('"+team_name+"','"+actual_length+"'); " ;
      db.query(sql1, function(err, results){
         if(err){
            console.log("err");
         }
      });      
      var sql2 = "select team_id from `team` where `team_name`= '"+team_name+"'";

      db.query(sql2, function(err, results1){
         console.log(results1);
         var sql4 = "INSERT INTO `register` (`event_id`,`time`,`team_id`) VALUES ('"+event_id+"',NOW(),'"+results1[0].team_id+"'); " ;
         db.query(sql4, function(err, results2){
            if(err){
               console.log("err");
            }
         });           
         for(var i=0; i<actual_length; i++){
            
            var sql3 = "INSERT INTO `teammem` (`team_id`,`uid`,`leader`) VALUES ('"+results1[0].team_id+"','"+uid[i]+"','"+leader[i]+"');";
            db.query(sql3, function(err, results0){
               console.log(results0);
                if(err){
                  console.log("err");
               }
            });            
         }
      });
      var sql5 = "UPDATE event set remain = remain +1 WHERE `event_id` = "+event_id;
      console.log(sql5);
         db.query(sql5, function(err, result){
            if(!err){
               console.log("good good");
            }
         });      
      if(req.session.valid_reg == true){
         var sql = "SELECT announce_id, year(announce_date) as year, month(announce_date) as month, day(announce_date) as day, title from `announce`";
         db.query(sql, function(err, result){
         message = "registration Succesful";  
            res.render('index.ejs',{data:result, message: message});
         });
      }
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
//---------------------------------------delete event---------------------------------------------
exports.eventDelete = function(req, res){

      var id = req.params.event_id;
      var sql = "Delete FROM `event` WHERE `event_id`='"+id+"'";

      db.query(sql, function(err,results){
         res.redirect("/events");
      });
}
//----------------------------------register status-----------------------------------------------
exports.status=function(req,res){
   var sql = "SELECT max_team,ename, remain , event_id FROM `event`";
   db.query(sql, function(err, result){  
      console.log(result);
      res.render('status.ejs',{data:result});
   });
};
/*exports.id_status=function(req,res){
   var sql = "SELECT max_team,ename, remain , event_id FROM `event`";
   db.query(sql, function(err, result){  
      console.log(result);
      res.render('status.ejs',{data:result});
   });
};*/
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

//-----------------------------------add announcement-----------------------------------------------

exports.anncadd=function(req,res){
   if(req.method == "POST"){
      var post  = req.body;
      console.log(post);
      var title = post.title;
      var content = post.content;
      var sql = "INSERT INTO `announce` (`announce_date`,`title`,`content`) VALUES (NOW(),'"+title+"','"+content+"');";
      db.query(sql, function(err, results){
         if(!err){
            res.redirect('/');
         }
         
      }); 
   }
   else{
      var sql = "SELECT * FROM `announce`";
      db.query(sql, function(err, results){
         res.render('anncadd.ejs',{data: results});
      });      
   }
};
//--------------------------------------add event-------------------------------------------------------
exports.eventadd=function(req,res){
   if(req.method == "POST"){
      var post  = req.body;
      console.log(post);
      var ename = post.ename;
      var event_date = post.event_date;
      var max_team = post.max_team;
      var max_team_mem = post.max_team_mem ;
      var min_team_mem = post.min_team_mem ;
      var rule = post.rule ;
      var sql = "INSERT INTO `event` (`ename`,`max_team`,`min_team_mem`,`max_team_mem`,`remain`,`rule`,`event_date`) VALUES ('"+ename+"','"+max_team+"','"+min_team_mem+"','"+max_team_mem+"',0,'"+rule+"','"+event_date+"');";
      db.query(sql, function(err, results){
         if(!err){
            res.redirect('/events');
         }
         else{
            console.log("err");
            res.redirect('/events');
         }
      }); 
   }
   else{
      var sql = "SELECT * FROM `event`";
      db.query(sql, function(err, results){
         res.render('eventadd.ejs',{data: results});
      });      
   }
};

//----------------------------------------------event edit------------------------------------------------------
exports.eventedit=function(req,res){
   if(req.method == "POST"){
      var event_id = req.params.event_id;
      var post  = req.body;
      console.log(post);
      var ename = post.ename;
      var event_date = post.event_date;
      var max_team = post.max_team;
      var max_team_mem = post.max_team_mem ;
      var min_team_mem = post.min_team_mem ;
      var rule = post.rule ;
      var sql = "UPDATE event set ename = '"+ename+"',max_team = '"+max_team+"',min_team_mem = '"+min_team_mem+"',max_team_mem = '"+max_team_mem+"',rule = '"+rule+"',event_date = '"+event_date+"' where event_id = '"+event_id+"';";
      db.query(sql, function(err, results){ 
         if(!err){
            res.redirect('/events');
         }
         else{
            console.log("err");
            res.redirect('/events/');
         }
      }); 
   }
   else{
      var event_id = req.params.event_id;
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
      console.log(event_id);
      var sql = "SELECT event_id, ename, max_team, min_team_mem, max_team_mem,remain, rule, year(event_date) as year, month(event_date) as month , day(event_date) as day FROM event where event_id = '"+event_id+"' ;";
      db.query(sql, function(err, results){
         if(!err){
            console.log(results);
            res.render('eventedit',{data: results});            
         }
         if(err){
            console.log("errrrrrrr");
            res.redirect('/events');
         }

      });      
   }
};