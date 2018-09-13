/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50641
 Source Host           : localhost:3306
 Source Schema         : node

 Target Server Type    : MySQL
 Target Server Version : 50641
 File Encoding         : 65001

 Date: 13/09/2018 16:18:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(10) DEFAULT NULL,
  `content` longtext,
  `name` varchar(30) DEFAULT NULL,
  `datetime` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of news
-- ----------------------------
BEGIN;
INSERT INTO `news` VALUES (1, '日记', '<p>今天是个好日子</p>', '天朗气清', '1535603701000');
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openIdQQ` varchar(50) DEFAULT NULL,
  `verificationCode` varchar(6) DEFAULT NULL,
  `verificationTime` varchar(20) DEFAULT NULL,
  `userName` varchar(20) DEFAULT NULL,
  `headImg` varchar(200) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `gender` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (9, '9B6C01E2ACF80B2D8307FD8125AFDAA7', NULL, NULL, '★不求※甚解', 'http://qzapp.qlogo.cn/qzapp/101479867/9B6C01E2ACF80B2D8307FD8125AFDAA7/100', NULL, '男');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
