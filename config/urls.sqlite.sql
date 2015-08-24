BEGIN TRANSACTION;
DROP TABLE IF EXISTS `rss_url`;
CREATE TABLE `rss_url` (
    `rssurl`       VARCHAR(1024) PRIMARY KEY NOT NULL
  , `tags`         VARCHAR(1024) NOT NULL DEFAULT ""
  , `dbname`       VARCHAR(64) NOT NULL DEFAULT "default"
  , `lastmodified` INTEGER(11) NOT NULL DEFAULT 0
  , `lastfetch`    INTEGER(11) NOT NULL DEFAULT 0
  , `sha1sum`      INTEGER(40) NOT NULL DEFAULT 0
  , `icon`         BOOL
--  , is_rtl       INTEGER(1) NOT NULL DEFAULT 0
--  , etag         VARCHAR(128) NOT NULL DEFAULT ""
);
COMMIT;
