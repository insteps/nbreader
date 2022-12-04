
<div class="list-group list-group-sm l0">
<?php //echo count($_category);?>
<?php //echo "\n";?>
<?php foreach ($_category as $cat=>$total):?>
<?php
$ncat[]=$cat; $ncatcount=count($ncat);
$sl=substr_count($cat, '/');
$hide=''; $spacing=''; $l=0; $c=$cat; if( ! isset($t)) { $t=0; }
$liclass=''; $divstart=''; $divend=''; $divlast='';
if( ! (stripos($c, '/') > 0)) $t=$t+$total;

while (stripos($c, '/') > 0) {
    $c = dirname($c); $l++;
    $spacing=$spacing.'&nbsp;&nbsp;&nbsp;';
    $hide='';
}
if($ncatcount>1) {
  $slprev=substr_count($ncat[$ncatcount-2], '/');
  if( $sl > $slprev ) {
    $divstart = "\n".'<div class="list-group hidden '.'l'.$l.'">'."\n";
    //$divstart = "\n".'__start__'."\n";
  }
  if( $sl < $slprev ) {
    $divend = '</div>'."\n";
    //$divend = '__end__'."\n\n";
    $divend = str_repeat($divend, $slprev-$sl);
  }
  if( count($_category) == $ncatcount ) {
    $divlast = '</div>';
    //$divlast = '__end__'."\n\n";
    $divlast = str_repeat($divlast, $sl);
  }

}

//$a=array('/','.'); $b=array('_','');
//$liclass = ' _'.str_replace($a, $b, dirname($cat));
//if($liclass == '_') {$liclass = '__top'; }
$spacing=''; //use css

?>
<?php echo $divstart;?><?php echo $divend;?>
<?php //echo substr_count($ncat[$ncatcount-1], '/');?><?php //echo $sl;?><?php //echo $cat."\n";?>
<a href="#" class="list-group-item<?php echo $hide;?><?php echo $liclass;?>" title="<?php echo $cat;?>"><span class="badge"><?php echo $total;?></span><?php echo $spacing;?><span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span> <?php echo basename($cat);?></a>
<?php echo $divlast;?>
<?php endforeach;?>
<?php //echo $ncatcount;?>
</div><span id="data-total" data-total=<?php echo @$t;?>></span>

