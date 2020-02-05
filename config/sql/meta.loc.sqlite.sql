BEGIN TRANSACTION;
DROP TABLE IF EXISTS `rss_item_activity`;
DROP TABLE IF EXISTS `rss_meta`;
DROP TABLE IF EXISTS `rss_config`;

CREATE TABLE `rss_item_activity` (
    `id`           INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL
  , `rssid`        INTEGER     UNIQUE NOT NULL
--  , `urlsha1`      INTEGER(40) PRIMARY KEY NOT NULL
  , `dbname`       VARCHAR(64) NOT NULL DEFAULT "default"
  , `flags`        VARCHAR(52)
  , `tags`         VARCHAR(52)
  , `unread`       INTEGER(1)  NOT NULL
  , `deleted`      INTEGER(1)  NOT NULL DEFAULT 0
  , `lastmodified` INTEGER(11) NOT NULL DEFAULT 0
);
CREATE INDEX `idx_rssid`       ON `rss_item_activity` (`rssid`);

CREATE TABLE `rss_meta` (
    `id`           INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL
);

CREATE TABLE `rss_config` (
    `id`           INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL
);

COMMIT;
