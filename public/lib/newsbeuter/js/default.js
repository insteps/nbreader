/*<![CDATA[*/

/**
 * Copyright (c) 2015 V.Krishn (insteps.net)
 *
 * This file is part of "Newsbeuter Reader";
 * See accompanying main package for license and more details.
 *
 */

(function( NbReader, undefined ) {
  var config = NbReader.Config = function (config) {
    NbReader.Config = config;
  }
  NbReader.version = config.version;
  NbReader.copyright = 'Copyright (c) 2015 V.Krishn (insteps.net)';
  NbReader.about = function () {
    alert(
      "\nVersion: "+this.version+
      "\n\nNbReader: \n \(RSS Reader / Web frontend for Newsbeuter\)\n\n"+
      this.copyright);
  }
}( this.NbReader = this.NbReader || {} ) );

//var NBR_CONFIG = {"nodes" : "nbrroot"};
//NbReader.Config(NBR_CONFIG);

(function( NbReader, $, undefined ) {
  var SetRssList = NbReader.SetRssList = function (config) {
    NbReader.Config(config); root = config.nodes;
    if(typeof root !== 'object') {
      rssfeeds = NbReader.RssListRoot = document.getElementById(root);
      list = NbReader.RssList = rssfeeds.getElementsByTagName(config.list);
      rss = NbReader.RssAct = document.getElementById(config.rssactive);
      rsspager = NbReader.RssActPgs = document.getElementById('rssactive-pager');
      NbReader.rsspagerwrap = document.getElementById('rssactive-pager-wrap'); 
      NbReader.breadcrumb = document.getElementById('breadcrumb'); 
      NbReader.rsspgrsm = $("#rss div.pager-simple");
      NbReader.feedoffset = 0; NbReader.doNodeRefresh = ''; NbReader.doXmlRefresh = ''
      rssview = NbReader.RssView = document.getElementById('rssview');
    }

    // ## ------------
    NbReader.A = rssfeeds.onclick = function(e) {
      e.preventDefault();
      if(e.target) { obj = e.target } else { obj = e; }; title = obj.title;
      NbReader.activenode = obj;
      
      if ((obj.tagName) == 'INPUT') { return; }

      if( (obj.tagName) == 'IMG' && $(obj).hasClass('favicon') ) {
        return;
      }
      
      if( (obj.tagName) == 'SPAN' && $(obj).hasClass('glyphicon') ) {
        return;
      }

      if( (obj.tagName) == 'SPAN' && $(obj).hasClass('badge') ) {
        a = obj.parentNode;
        if( NbReader.IsXml(a) ) { NbReader.doXmlRefresh = 'yes'; }
          else { NbReader.doNodeRefresh = 'yes'; }
      }
      if( (obj.tagName) == 'SPAN' && $(obj).hasClass('text') ) {
        a = obj.parentNode;
      }
      
      if ((obj.tagName) == 'A') {
        a = obj;
      }
      
      // ## Get/Set Rss/Xml file
      if( NbReader.IsXml(a) ) { NbReader.SetXml(a); return false; }

      // ## else not xml link (nodes/feedlist)
      $(NbReader.activenodeA).removeClass('active');
      NbReader.activenodeA = a; NbReader.nodeType = 'node';
      
      if( NbReader.doNodeRefresh != 'yes' ) { NbReader.ToggleNode(a); } // TODO - add popup opts
      NbReader.GetFeedList(config); // no action if already fetched
      
      return false;
    }

    // ## ------------ Click Rss file item to View Item Content
    NbReader.Rss = rss.onclick = function(e) {
      if(e.target) { obj = e.target } else { obj = e; }; title = obj.title;
      if ((obj.tagName) == 'INPUT') { return; }
      newslist = NbReader.NewsList = NbReader.RssAct.getElementsByTagName(config.list);
      $(newslist).removeClass('active');

      if ((obj.tagName) == 'SPAN') {
        a = obj.parentNode;
      }
      if ((obj.tagName) == 'A') {
        a = obj;
      }
      var id = (/(\#)([\d]+)$/).exec(a.href)[2];
      data = $(NbReader.RssAct).data(NbReader.activehash);
      now = new Date();
      $.each( data.query, function( key ) {
        if(id == data.query[key].id)
        d = data.query[key];
        return;
      });
      var mEpoch = parseInt(d.pubDate); 
      if(mEpoch < 10000000000) { mEpoch *= 1000; }
      now.setTime(mEpoch);
      var dt = dateFormat(now, "ddd, mmm dS, yyyy, h:MM TT");
      var items = [];
        items.push( 
        "<div class='list-group-item l0'>" + NbReader.pagersm
        + "<a href='"+d.url+"'" + "class=' '" + "title='"+d.title+"'" + ">" 
        + "<span class='glyphicon glyphicon-tags " + "' aria-hidden='true'></span> "
        + "<span class='title'>" + d.title + "</span>"
        + "</a>"
        + "<div class='author'><strong>Author:</strong> " + d.author + "</div>"
        + NbReader.readsm + "<div class='pubdate'><strong>Published:</strong> " + dt + "</div>"
        + "<hr />"
        + "<div class='text'>" + d.content + "</div>"
        + NbReader.pagersm + "</div>"
        );
      content = "<div class='list-group '" + ">"  + items.join("") + "</div>";

      $(a).toggleClass('active');
      NbReader.RssView.innerHTML = content;
      console.log(newslist.length);
      NbReader.activerss = a;

      rssViewPgrSm = $('#rssview .list-group-item .pager-simple');
      rssViewPgrSm[0].onclick = NbReader.SetRssViewPgrSm;
      rssViewPgrSm[1].onclick = NbReader.SetRssViewPgrSm;

      rssViewReadTog = $('#rssview .list-group-item .readtog')[0];
      rssViewReadTog.onclick = NbReader.SetRssViewReadTog;
      if( ! $(NbReader.activerss).hasClass('unread')) {
        NbReader.SetRssViewReadTog(rssViewReadTog, true) }

      return false;
    }

    NbReader.pagersm = '<div class="btn-group pager-simple">'
        + '<button type="button" class="btn prev">&laquo;</button>'
        + '<button type="button" class="btn next">&raquo;</button>'
        + '</div>';
    NbReader.readsm = '<a href="#" class="btn btn-default btn-sm readtog" role="button">'
        + '<span class="glyphicon glyphicon-unchecked ' + '" aria-hidden="true"></span>'
        + '</a>';

    // ## ------------ Double Click Rss item to mark as read
    $(rss).dblclick(function(e) {
      obj = e.target;
      if ((obj.tagName) == 'A') { id = obj.hash.replace(/\#/, ''); r = obj; }
        else  { r = obj.parentNode; id = obj.parentNode.hash.replace(/\#/, ''); }

      unread = ($(r).hasClass('unread')) ? 'no' : 'yes';
      a = NbReader.activenodeXml;
      atn = $(a)[0].title; _s = "a[title='"+atn+"']";
      db = $( a ).attr( "data-db" ); if( ! db ) return;
      url = NbReader.Config.apiurl+'/unread_/cat/'+db+'/id/'+id+'/unread/'+unread+'/format/json';

      $.getJSON( url, function( data ) {
        if(String(data.result) == 'true') {
          console.log('change read status of: ' + id);
          $(r).toggleClass('unread');
          NbReader.doNodeRefresh = 'yes';
          $( "#collapseOne " + _s).children('.badge').first().trigger( "click" );
        }
      });      

    });

    // ## ------------
    NbReader.rsspgrsm[0].onclick = NbReader.SetRssPagerSimple;

    // ## ------------
    h = $('#navbar-header');
    h[0].onclick = function(e) {
      e.preventDefault; obj = e.target;
      if(obj.tagName != 'A') { return; }
      //$('#accordion').hide(); //# TODO basic transitions/effects
      //$('#rss').hide();
      //$('#rssview').hide();
      hash = obj.hash;
      //$(hash).css('display', 'block');
      $('html, body').finish().animate({
         'scrollTop': ($(hash).offset().top)-55,
      }, 1500, 'swing');
    }

    // ## ------------
    NbReader.SetHeights();
    window.onresize = function() { NbReader.SetHeights(); }

    // ## ------------
    
  }
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {

  NbReader.SetHeights = function (e) {
    if($( window ).width() > 768) {
      var contentHt = $( window ).height()-$('#breadcrumb').height()- $('.navbar').height()-10;
      $('#rsslist').height(contentHt).css({ overflow: "auto" });
      $('#rss').height(contentHt).css({ overflow: "auto" });
      $('#rssview').height(contentHt).css({ overflow: "auto" });
    } else {
      $('#rsslist').css({ height: "auto" });
      $('#rss').css({ height: "auto" });
      $('#rssview').css({ height: "auto" });
    }
  }
  
  NbReader.ToggleNode = function (obj) {
      $(obj).toggleClass('active');
      $(obj).next("div").toggleClass('hidden');
      if($(obj).next("div").next('div')) { $(obj).next("div").next('div').toggleClass('hidden'); }
      $(obj).children('.glyphicon').toggleClass('glyphicon-folder-close');
      $(obj).children('.glyphicon').toggleClass('glyphicon-folder-open');
  }
  NbReader.ToggleNodeXml = function (obj) {
    if( ! $(obj).hasClass('activexml') ) { $(obj).toggleClass('activexml'); }
  }

  NbReader.GetUrl2Hash = function (obj) {
    return (/\/[^\/]*\.xml$/i).exec(obj.href)[0].replace(/\//g, '').replace(/\.xml$/, '');
  }
  NbReader.GetHash2Url = function (hash) {
  }
  
  NbReader.IsXml = function (obj) {
    if( (/\.xml$/i).test(obj.href) ) { return true; }
    return false;
  }
  NbReader.SetXml = function (obj) {
    $(NbReader.activenodeXml).removeClass('activexml');
    NbReader.activenodeXml = obj; NbReader.nodeType = 'xml';
    NbReader.activenodeXmlHref = obj.href;
    var hash = NbReader.GetUrl2Hash(obj);
    NbReader.SetBreadCrumb(obj, true);
    NbReader.ToggleNodeXml(obj);
    if(hash == NbReader.activehash && NbReader.doXmlRefresh != 'yes')
      { return false; } //same as previous
    NbReader.activehash = hash; NbReader.feedoffset = 0;
    NbReader.GetFeed(NbReader.Config);
  }
  NbReader.IsActiveXmlUpdated = function (newNum) {
    var oldn = NbReader.GetNodeCount(NbReader.activenodeXml);
    //if( parseInt(newNum) == NaN || parseInt(oldn) == NaN ) { return false; }
    if(oldn !== newNum) { return true; }
    return false;
  }

  NbReader.GetNodeCount = function (obj) {
    return parseInt($(obj).children('.badge')[0].innerHTML);
  }
  NbReader.GetNodeBadge = function (obj) {
    return $(obj).children('.badge')[0];
  }
  
  NbReader.SetBreadCrumb = function (obj, isXml) {
    $(NbReader.breadcrumb).children('ol').children('.xml').remove();
    // ## set breadcrumb
    var bc = obj.title.split(/\//); var _bc = [];
    for (var i = 0; i < bc.length-1; i++) {
      _bc.push( '<li><a href="#">' + bc[i] + '</a></li>' );
    } _bc.push( '<li class="active">' + bc[i] + '</li>' );
    $(NbReader.breadcrumb).children('ol')[0].innerHTML = _bc.join("");
    if(isXml) {
      // ## append to breadcrumb
      $(NbReader.breadcrumb).children('ol').append('<li class="xml">'+obj.text+'</li>');
    }
  }

  NbReader.SetRssPagerSimple = function (e) {
    obj = e.target;
    var li = $(NbReader.RssActPgs).children('li');
    if(li.length < 3) { return; }
    prev = $(NbReader.RssActPgs).children('li.prev').children('a');
    next = $(NbReader.RssActPgs).children('li.next').children('a');
    if( $(obj).hasClass('prev') ) { $(prev[0]).trigger( "click" ); }
    if( $(obj).hasClass('next') ) { $(next[0]).trigger( "click" ); }
  }
  NbReader.SetRssViewPgrSm = function (e) {
    obj = e.target;
    if( $(obj).hasClass('prev') ) {
      $(NbReader.activerss).prev('a').trigger( "click" ); }
    if( $(obj).hasClass('next') ) {
      $(NbReader.activerss).next('a').trigger( "click" ); }
  }
  NbReader.SetRssViewReadTog = function (e, isInit) {
    if(e.target) { obj = e.target } else { obj = e; }; obj.preventDefault; 
    if(obj.tagName == 'SPAN') { obj = obj.parentNode; }
    if( isInit != true ) { $(NbReader.activerss).trigger( "dblclick" ); }
    // NOTE: activexml badge color turns default // FIXED

    setTimeout(function() {
      obj = $('#rssview .list-group-item .readtog')[0];
      $(obj).toggleClass('active');
      $(obj).children('.glyphicon').toggleClass('glyphicon-check');
      $(obj).children('.glyphicon').toggleClass('glyphicon-unchecked');
    }, 500);
    return false;
  }

  NbReader.GetIconByDbname = function (dbname) {
    console.log('GetIconByDbname:: '+dbname);
    isfetch = $(NbReader.RssListRoot).data('isfetch.icon.'+dbname); //unset ?
    isdata = $(NbReader.RssListRoot).data('icon.'+dbname);
    NbReader.RefreshNodeIcon(NbReader.activenodeA);
    if(isfetch == 'yes' || isdata) return;
    $(NbReader.RssListRoot).data('isfetch.icon.'+dbname, 'yes');
    setTimeout(function() {
      $.ajax({
        dataType: "json",
        url: NbReader.Config.apiurl+'/icon/format/json/cat/'+dbname,
        data: '',
        success: function(data) {
          $(NbReader.RssListRoot).data('icon.'+dbname, data);
          $(NbReader.RssListRoot).data('isfetch.icon.'+dbname, 'done');
          NbReader.RefreshNodeIcon(NbReader.activenodeA);
        }
      });
    }, 500);
  }

  NbReader.RefreshNodeIcon = function (node) {
    alist = $(NbReader.activenodeA).next('div').children('a');
    for (var i = 0; i < alist.length; i++) {
      var t1 = alist[i];
      if( NbReader.IsXml(t1) ) {
        hash = NbReader.GetUrl2Hash(t1);
        db = $( t1 ).attr( "data-db" );
        data = $(NbReader.RssListRoot).data('icon.'+db);
        //console.log(data.icon[hash]);
        if(data && data.icon[hash]) {
          img = '<img class="favicon" src="data:'+data.icon[hash]+'" align="left" />';
          span = $(t1).children('.glyphicon')[0];
          if(span) {
            $(span).removeClass('glyphicon-tags');
            span.innerHTML = img;
            //$(span).removeClass('.glyphicon');
          }
        }
      }
    }
  }
  
  
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var GetFeedList = NbReader.GetFeedList = function (config) {
    obj = NbReader.activenode; a = NbReader.activenodeA;

    f = $(a).data('fetched'); refresh = '/refresh/no'
    if( typeof f != 'undefined' && NbReader.doNodeRefresh != 'yes' ) { return; }
    if (NbReader.doNodeRefresh != 'yes')
    { NbReader.SetBreadCrumb(obj, false); } else { refresh = '/refresh/yes';  }
    NbReader.doNodeRefresh = '';
    console.log('GetFeedList:: '+a.title+' (unfetched)');

    ai = a.parentNode;
    //$(obj).css('background-color', 'red');
    var ac = (/ (l)(\d)/i).exec(ai.className);
    l = 'l'+(parseInt(ac[2])+1);

    title = a.title; title = title.replace(/\//g, '~');

    $.ajax({
      dataType: "json",
      url: NbReader.Config.apiurl+'/meta/unread/yes/tag/'+title+'/format/json'+refresh,
      data: '',
      success: function(data) {
        var items = []; var now = new Date(); var n = now.getTime(); var dbs = [];
        $.each( data._by_cat[a.title], function( key, val ) {
          if( ! (/\.xml$/i).test(key) ) { return; }; //check for xml url
          var db = val.title.split(/::/);
          dbs.push( db[0] );
          items.push(
          "<a href='" + key + "' class='list-group-item xml'" + "title='"+a.title+"'" + "data-db='"+db[0]+"'" + ">" 
          + "<span class='badge'>" + val.count + "</span>"
          + "<span class='glyphicon glyphicon-tags' aria-hidden='true'></span> "
          + "<span class='text'>"+db[1]+"</span>"
          + "</a>" );
        });

        // update badge values/number
        $.each( data._category, function( key, val ) {
          _s = "a[title='"+key+"']";
          $( "#collapseOne " + _s).children('.badge')[0].innerHTML = val;
        });
        $(a).data('fetched', { time: n, count: 1 });
        if( ! items.length ) { return; }
        rsslist = "<div class='list-group hidden " + l + "'" 
                   + "title='" + a.title + "'"
                   + ">" + items.join("") 
                   + "</div>";
        cnShow = '';
        if( typeof $(a).next()[0] != 'undefined' ) {
          if( $(a).next()[0].tagName == 'DIV' && $(a).next()[0].title !== '') {
            cnShow = ($(a).next("div").next('div').hasClass('hidden')) ? 'no' : 'yes';
            $(a).next("div").remove();
          }
        }
        $(a).after(rsslist);

        // re-activate activenodeXml as active
        setTimeout(function() {
          da = $(a).next("div").first().children('a');
          $.each( da, function( key, val ) {
            if ( NbReader.activenodeXmlHref == val.href) {
              $(val).toggleClass('activexml'); NbReader.activenodeXml = val;
              return; }
          });
        }, 100);

        if( $(a).hasClass('active')) {
          $(a).next("div").toggleClass('hidden');
        } else {
//          NbReader.A(a); //to check
        }
        if(cnShow == 'yes') { $(a).next("div").removeClass('hidden'); }
        
        // Fetch icon files
        $.each( dbs, function( key, val ) {
          NbReader.GetIconByDbname(val); //trigger icons fetch
        });
        
      }
    });

    //return false;
  }
}( NbReader, jQuery = window.jQuery || {} ) );


(function( NbReader, $, undefined ) {
  var GetFeed = NbReader.GetFeed = function (config) {
    a = NbReader.activenodeXml;
    NbReader.doXmlRefresh = '';

    f = $(a).data('fetched');
    //if( typeof f != 'undefined' ) { return; } # TODO

    db = $( a ).attr( "data-db" );
    if( ! db ) return;
    var hash = NbReader.activehash
    var ofs = NbReader.feedoffset;

    console.log( 'GetFeed:: ' + hash + ' at ' + ofs );
    $.ajax({
      dataType: "json",
      url: NbReader.Config.apiurl+'/item/cat/'+db+'/hash/'+hash+'/row/10-'+ofs+'/filter/default'+'/format/json',
      data: '',
      success: function(data) {
        $(NbReader.RssAct).data(hash, data);
        var items = []; var now = new Date(); var n = now.getTime();
        m = (data.count%10) > 0 ? 1 : 0; var pgs = parseInt(data.count/10)+m; //pager data
        // data.count = full count (unread+read)
        $.each( data.query, function( key ) {
          d = data.query[key];
          unread = d.unread; unreadc = unread ? 'unread' : '';

          var epoch = parseInt(d.pubDate); 
          if( epoch < 10000000000 ) { epoch *= 1000; }
          now.setTime(epoch);
          // dateFormat("Jun 9 2007", "fullDate");
          var dt = dateFormat(now, "ddd, mmm dS, yyyy, h:MM TT");

          items.push(
          "<a href=#" + d.id + " class='list-group-item "+ unreadc + "'" + "title='"+d.title+"'" + ">" 
          + "<span class='glyphicon glyphicon-flag green " + "' aria-hidden='true'></span> "
          + "<span class='glyphicon glyphicon-tag blue " + "' aria-hidden='true'></span> "
          + "<span class='glyphicon glyphicon-bookmark " + "' aria-hidden='true'></span> "
          + "<span class='pubdate'>" + dt + "</span>"
          + "<span class='author hidden'>" + d.author + "</span>"
          + "<span class='title'>" + d.title + "</span>"
          //+ "<span class='glyphicon glyphicon-edit " + "l0" + "' aria-hidden='true'></span> "
          + "<span class='glyphicon glyphicon-cog " + "' aria-hidden='true'></span> "
          + "</a>" );
        });
        $(a).data('fetched', { time: n, count: 1 });
        if( ! items.length ) { return; }
        rsslist = "<div class='list-group rss-items l0 '" + ">" + items.join("") + "</div>";
        NbReader.RssAct.innerHTML = rsslist;
        NbReader.SearchRSS(NbReader.Config);
        setTimeout(function() {
          $(NbReader.RssAct).children('.rss-items').children('a').first().trigger( "click" );
        }, 100);

        // ## make pagination and redo on new list
        // ---------------------------------------
        li = $(NbReader.RssActPgs).children('li');
        search2 = $("#rss input.search");
        if(li.length < 3 || NbReader.feedoffset == 0) {
          $(NbReader.RssActPgs).remove();
          test = '<ul id="rssactive-pager" class="pagination pagination-sm"><li>x</li></ul>';
          NbReader.rsspagerwrap.innerHTML = test;
          NbReader.RssActPgs = document.getElementById('rssactive-pager');
          setTimeout(function() {
            $(search2).attr( "placeholder", 'Search for...      Pgs: 1/'+pgs );
            $(NbReader.RssActPgs).twbsPagination({
              totalPages: pgs,
              visiblePages: 4,
              prev: '&lt;',
              next: '&gt;',
              first: '&lt;&lt;',
              last: '&gt;&gt;',
              onPageClick: function (event, page) {
                NbReader.feedoffset = (parseInt(page)-1)*10;
                NbReader.GetFeed(NbReader.Config);
                $(search2).attr( "placeholder", 'Search for...      Pgs: '+page+'/'+pgs );
              }
            });
          }, 100);
        }
        // ---------------------------------------

        // if rss feed got updated
        if( NbReader.IsActiveXmlUpdated(data.count_unread) ) {
          b = NbReader.GetNodeBadge($(a.parentNode).prev('a')[0]);
          setTimeout(function() {
            $(b).first().trigger('click');
          }, 100);
        }

        //rss = document.getElementById('rss'); //rssactive
        //$(NbReader.RssAct).hide();
        //$(rss).scrollTop().scroll();
      }
    });
      
    return false;
  }

}( NbReader, jQuery = window.jQuery || {} ) );


(function( NbReader, $, undefined ) {

  // ## Search Active RSS Items
  // ---------------------------
  NbReader.SearchRSS = function (config) {
    setTimeout(function() {
      var options = {
        valueNames: [ 'title', 'pubdate', 'author'],
        listClass: [ 'rss-items']
      };
      var rssItems = new List('rss', options);
    }, 200);
    return false;
  }

  // ## Search Feed list nodes
  // --------------------------
  NbReader.SearchFeedList = function (config) {
    obj = NbReader.activenode;

    rssfeeds = NbReader.RssListRoot = document.getElementById(config.nodes);
    list = NbReader.RssList = rssfeeds.getElementsByTagName(config.list);
    search = $("#collapseOne input.search");

    $(search).keydown(function(e) {
      if(this.value == '' && e.keyCode == 13) {
        // ## reset styles first
        $(list).removeClass('hiddenYES');
        $(list).next('div').removeClass('hiddenNO');
        $(list).next('div').next('div').removeClass('hiddenNO');
        $(list).children('.glyphicon').removeClass('allleft');
      }
    });

    $( search[0] ).change(function() {
      if(this.value == '') return false;
      $(list).next('div').addClass('hiddenNO');
      $(list).children('.glyphicon').addClass('allleft');
      for (var i = 0; i < list.length; i++) {
        var t1 = list[i].title; var e1 = 't1.search(/'+this.value+'/i)';
        var t2 = list[i].text; var e2 = 't2.search(/'+this.value+'/i)';
        var n1 = eval(e1); var n2 = eval(e2);
        if( n1 == -1 && n2 == -1 ) {
          $(list[i]).addClass('hiddenYES');
        }
      }
      //console.log(list.length);
    });
    return false;
  }

}( NbReader, jQuery = window.jQuery || {} ) );




