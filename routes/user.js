var crypto = require("crypto");
function encrypt(key, data) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
}

function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
}
var key = "seven" ;
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var uname= post.uname;
      var uid= post.uid;
      var email= post.email;
      var phone_num= post.phone_num;
      var pass= encrypt(key, post.password);
      var department = post.department;
      var gender = post.gender;
      var grade = post.grade;

      console.log(post);
      var sql = "INSERT INTO `test`.`user` (`uid`, `dcid`, `uname`, `gender`, `email`, `phone_num`, `password`, `grade`) VALUES ('" + uid + "','"+ department +"','" + uname + "','" + gender + "','" + email + "','" + phone_num + "','" + pass + "','" + grade + "');"

      var query = db.query(sql, function(err, result) {
         if(err){
            var sql1="SELECT * FROM `question`";
            db.query(sql1, function(err, results){
               console.log(results);
               res.render('signup.ejs', {data:results, message: "註冊失敗 請確認該用戶是否已存在"});    
            });                 
         }
         else{
            var sql1="SELECT * FROM `question`";
            db.query(sql1, function(err, results){
               console.log(results);
               res.render('signup.ejs', {data:results, message: "Succesfully! Your account has been created."});    
            });        
         }
      });
   } 
   else{
      var sql="SELECT * FROM `question`";
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
      var pass= encrypt(key, post.password);

     console.log(pass);
      var sql="SELECT admin, uid, password, uname FROM `user` WHERE `uid`='"+uid+"' and password = '"+pass+"'";                         
      db.query(sql, function(err, results){    
          console.log(results[0]);
         if(results.length){
            if(results[0].admin == 1){
               req.session.admin = true;
            }
            else{
               req.session.admin = false;
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
   var message="";
   var sql = "SELECT max_team, remain, ename,rule , event_id FROM `event`";
   db.query(sql, function(err, result){  
      console.log(result);
      res.render('events.ejs',{data:result,message: message});
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
//-----------------------------------------取消報名---------------------------------------------------------
exports.cancle = function(req, res){
   var message = "";
   var uid = req.session.uid;
   var event_id= req.params.event_id;
   var sql = "select tt.leader,t.team_mem,u.uname,t.team_id,t.team_name , tt.uid , r.event_id,e.ename from team t inner join register r on r.team_id= t.team_id inner join event e on e.event_id = r.event_id inner join teammem tt on tt.team_id = t.team_id inner join user u on tt.uid = u.uid where r.event_id= '"+event_id+"' and tt.leader=1 and u.uid='"+uid+"';";          
   db.query(sql, function(err, result){  
      //console.log(result);
      if(result.length){
         message="is leader";
         console.log(result[0].team_id);
         var sql1 ="delete from register where team_id = '"+result[0].team_id+"' ;";
         var sql2 ="delete from team where team_id = '"+result[0].team_id+"' ;";
         var sql3 ="delete from teammem where team_id = '"+result[0].team_id+"' ;";
         var sql5 ="update event set remain = remain - 1 where event_id = '"+event_id+"'; ";
         db.query(sql5,function(err, result5){
            if(err){
               console.log("err5");
            }
         });
         db.query(sql1,function(err, result1){
            if(err){
               console.log("err1");
            }
         });
         //console.log(result1);
         db.query(sql2,function(err, result2){
            if(err){
               console.log("err2");
            }
         });
         db.query(sql3,function(err, result3){
            if(err){
               console.log("err3");
            }
         });
         var sql4 = "SELECT max_team, remain, ename,rule , event_id FROM `event`";
         db.query(sql4, function(err, result){  
            console.log(result);
            res.render('events.ejs',{data:result, message:message});
         });          
         //alert(message);
      }
      else{
         message="not leader";
         var sql4 = "SELECT max_team, remain, ename,rule , event_id FROM `event`";
         db.query(sql4, function(err, result){  
            console.log(result);
            res.render('events.ejs',{data:result, message:message});
         }); 
      }
   });
};
//-------------------------------------------修改報名------------------------------------------------------
exports.edit = function(req, res){
   var event_id= req.params.event_id;
   var user_id = req.params.user_id;
   if(req.method == "POST"){
        res.redirect('/register/'+event_id);
   }
   else{
      var sql2 ="select t.team_id from team t, team tt, register r where t.team_id = tt.team_id and r.team_id = t.team_id and r.event_id = '"+event_id+"';";

      db.query(sql2, function(err, result2){
         if(result2.length){
         var sql = "select tt.leader,t.team_mem,u.uname,t.team_id,t.team_name , tt.uid , r.event_id,e.ename from team t inner join register r on r.team_id= t.team_id inner join event e on e.event_id = r.event_id inner join teammem tt on tt.team_id = t.team_id inner join user u on tt.uid = u.uid where r.event_id= '"+event_id+"' and t.team_id='"+result2[0].team_id+"';";   
            db.query(sql, function(err , result){
               if(result.length && !err){
                  for(var i=0 ;i<result.length;i++){
                     if(result[i].leader==1){
                        var sq3="SELECT * FROM `event` WHERE `event_id`='"+event_id+"'";   
                        db.query(sq3, function(err, result3){    
                           var sql4 ="SELECT uid, uname from user;";
                           db.query(sql4, function(err, result4){
                              console.log(result2);
                              res.render('edit.ejs',{data:result3,user:result4,value: result, leader: i});
                           }); 
                        });
                     }
                  }
               }      
            });         
         }
               else{
                  var message="尚未報名";
                  var sql = "SELECT max_team, remain, ename,rule , event_id FROM `event`";
                  db.query(sql, function(err, results){  
                     console.log(results);
                     res.render('events.ejs',{data:results,message: message});
                  });            
               }            
      });

   }

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
         message = "報名成功";  
            res.render('index.ejs',{data:result, message: message});
         });
      }
   } 
   else {
      var id= req.params.event_id;
      
      var sql="SELECT * FROM `event` WHERE `event_id`='"+id+"'";   
      db.query(sql, function(err, results){    
         var sql2 ="SELECT uid, uname from user;";
         db.query(sql2, function(err, result2){
            console.log(result2);
            res.render('register.ejs',{data:results,user:result2});
         }); 
      });
   }       
      
}
//---------------------------------------------Delete annc-----------------------------------------------
exports.anncDelete = function(req, res){
      var message = "";
      var id = req.params.annc_id;
      var sql = "Delete FROM `announce` WHERE `announce_id`='"+id+"'";
      db.query(sql, function(err,results){
         if(!err){
            message = "公告刪除成功";
            var sql1 = "SELECT announce_id, year(announce_date) as year, month(announce_date) as month, day(announce_date) as day, title from `announce`";
            db.query(sql1, function(err, result1){  
               res.render('index.ejs',{data:result1, message: message});
            }); 
         }
      });
}
//---------------------------------------delete event---------------------------------------------
exports.eventDelete = function(req, res){

      var event_id = req.params.event_id;
      var sql3 = "select team_id from register where event_id = '"+event_id+"';";
      db.query(sql3,function(err, result){
         for(var i =0;i<result.length;i++){
            var sql4 = "delete from team where team_id = '"+result[i].team_id+"';";
            db.query(sql4,function(err, result1){
            });
            var sql5 ="delete from teammem where team_id = '"+result[i].team_id+"';";
            db.query(sql5,function(err,result1){
            });
         }
      });
      var sql = "Delete FROM `event` WHERE `event_id`='"+event_id+"'";
      var sql2 = "delete from register where `event_id`='"+event_id+"'";


      db.query(sql, function(err,results){
         res.redirect("/events");
      });
}
//----------------------------------ALL EVENT  status-----------------------------------------------
exports.status=function(req,res){
   var sql = "SELECT max_team,ename, remain , event_id FROM `event`";
   db.query(sql, function(err, result){  
      console.log(result);
      res.render('status.ejs',{data:result});
   });
};
//-----------------------------------SPECIFIED event status-----------------------------------------------
exports.eventstatus=function(req,res){
   console.log("specified status");
   var id = req.params.event_id;
   var sql = "select t.team_mem,u.uname,t.team_id,t.team_name , tt.uid , r.event_id,e.ename from team t inner join register r on r.team_id= t.team_id inner join event e on e.event_id = r.event_id inner join teammem tt on tt.team_id = t.team_id inner join user u on tt.uid = u.uid where r.event_id= '"+id+"';";

   db.query(sql, function(err, result){  
      console.log("specified status");
      console.log(result);
      res.render('eventstatus.ejs',{data:result});
   });
};
//-----------------------------edit users details after login----------------------------------
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
      var sql = "SELECT event_id, ename, max_team, min_team_mem, max_team_mem,remain, rule, year(event_date) as year, month(event_date) as month , day(event_date) as day FROM event where event_id = '"+event_id+"' ;";
      db.query(sql, function(err, results){
         if(!err){
            res.render('eventedit',{data: results});            
         }
         if(err){
            console.log("errrrrrrr");
            res.redirect('/events');
         }

      });      
   }
};