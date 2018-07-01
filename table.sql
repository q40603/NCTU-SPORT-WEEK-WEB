CREATE TABLE IF NOT EXISTS `announce`(
  `announce_date` datetime NOT NULL,
  `title` mediumtext NOT NULL,
  `content` mediumtext NOT NULL,
  `announce_id` int(11) NOT NULL AUTO_INCREMENT,
  UNIQUE KEY `announce_id` (`announce_id`)
);
ALTER TABLE announce CONVERT TO CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `event` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `ename` varchar(50) NOT NULL,
  `max_team` int(11) NOT NULL,
  `min_team_mem` int(11) NOT NULL,
  `max_team_mem` int(11) NOT NULL,
  `remain` int(11) NOT NULL,
  `rule` longtext NOT NULL,
  `event_date` date NOT NULL,
  PRIMARY KEY (`event_id`)
);
ALTER TABLE event CONVERT TO CHARACTER SET utf8;

INSERT INTO `final`.`event` (`ename`, `max_team`, `min_team_mem`, `max_team_mem`, `remain`, `rule`, `event_date`) VALUES ('傳說對決', '5', '2', '6', '4', '5排', '2018/7/5');
INSERT INTO `final`.`event` (`ename`, `max_team`, `min_team_mem`, `max_team_mem`, `rule`, `event_date`) VALUES ('三三', '6', '3', '4', '打呀', '2018/7/9');

CREATE TABLE IF NOT EXISTS `question` (
  `problem` mediumtext NOT NULL,
  `answer` int(11) NOT NULL,
  PRIMARY KEY (`answer`)
);
ALTER TABLE question CONVERT TO CHARACTER SET utf8;
INSERT INTO `final`.`question` (`problem`, `answer`) VALUES ('2+2=?', '4');
INSERT INTO `final`.`question` (`problem`) VALUES ('34+6');


CREATE TABLE IF NOT EXISTS `register` (
  `reg_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`reg_id`)
);
ALTER TABLE register CONVERT TO CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `team` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) NOT NULL,
  `team_mem` int(11) NOT NULL,
  PRIMARY KEY (`team_id`)
);
ALTER TABLE team CONVERT TO CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `teammem` (
  `team_id` int(11) NOT NULL,
  `uid` varchar(20) NOT NULL,
  `leader` int(1) NOT NULL,
  PRIMARY KEY (`team_id`,`uid`)
);
ALTER TABLE teammem CONVERT TO CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `user` (
  `uid` varchar(20) NOT NULL,
  `dcid` varchar(20) NOT NULL,
  `uname` varchar(30) NOT NULL,
  `gender` varchar(7) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_num` varchar(15) DEFAULT NULL,
  `password` mediumtext NOT NULL,
  `grade` int(11) NOT NULL,
  `class` varchar(30) DEFAULT NULL,
  `admin` int(1) DEFAULT NULL,
  PRIMARY KEY (`uid`)
);
ALTER TABLE user CONVERT TO CHARACTER SET utf8;