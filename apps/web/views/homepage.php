<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- ## -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="favicon.ico">

    <title>Newsbeuter Reader</title>

    <!-- Bootstrap core CSS -->
    <link href="lib/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="lib/bootstrap/3.3.5/css/bootstrap-theme.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="lib/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="lib/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link href="nbreader/theme/default/css/default.css" rel="stylesheet">
  <style type="text/css">


  </style>
</head>
<body>
<?php include_once '_navbar_top.php' ?>

<?php include_once 'breadcrumb.php' ?>

<div class="content-wrap">
<div id="container" class="container-fluid">
<div class="row">

<div id='rsslist' class="col-md-4">
<?php include_once '_navbar_left.php' ?>
</div>

<div id='rsscol2' class="col-md-8">
<div id='rss'>
<?php include_once '_navbar_center.php' ?>
</div>
<div class="clearfix visible-xs-block"></div>
<div id='rssview'>
<?php include_once '_content.php' ?>
</div>
</div>


</div>
</div>
</div>

  <div class="modal fade about" tabindex="-1" role="dialog" aria-labelledby="about">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="about">About</h4>
        </div>
        <div class="modal-body">
          Newsbeuter RSS Reader (Mobile Friendly)
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->

  <div class="modal fade contact" tabindex="-1" role="dialog" aria-labelledby="contact">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="contact">Contact</h4>
        </div>
        <div class="modal-body">
          Email: vkrishn4@gmail.com <br> http://github.com/insteps/nbreader
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="lib/jquery/1.11.3/jquery.min.js"></script>
    <script src="lib/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="lib/holderjs/2.8.0/holder.min.js"></script>
    <script src="lib/bootstrap/starter/js/ie10-viewport-bug-workaround.js"></script>
    <!-- Misc utils/tools
    ================================================== -->
    <script src="lib/util/dt/date.format.js"></script>
    <script src="lib/twbs-pagination/1.2.5/jquery.twbsPagination.min.js"></script>
    <script src="lib/listjs/1.1.1/list.min.js"></script>

    <!-- NbReader libs
    ================================================== -->
    <script type="text/javascript">/*<![CDATA[*/
    var NbReader_Config = <?php echo $jsconf."\n"; ?>
    /*]]>*/</script>
    <script type="text/javascript" src="nbreader/default/js/newsbeuter.api.js"></script>
    <script type="text/javascript" src="nbreader/default/js/nbreader.bootstrap.js"></script>

<script type="text/javascript">
/*<![CDATA[*/
//$(window).on('load', function () {
//})
setTimeout(function() {

 var Cl = new NbClients(document.body, {message: '~~ New Client ~~'});
 Cl.init().Config(NbReader_Config);
 var NB = Object.create(NbReader);
 NB.Config(NbReader_Config);
 NB.Client = Cl;
 NB.config.breadcrumb = 'breadcrumb';
 NB.UI.init(NB);

}, 50);


/*]]>*/
</script>

</body>
</html>
