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