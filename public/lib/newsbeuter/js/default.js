/*<![CDATA[*/

/**
 * Copyright (c) 2015 V.Krishn (insteps.net)
 *
 * This file is part of "Newsbeuter Reader";
 * See accompanying main package for license and more details.
 *
 */

(function( NbReader, undefined ) {
  var config = NbReader.Config = function (conf) {
    NbReader.config = conf;
    NbReader.version = conf.version;
  }
  NbReader.copyright = 'Copyright (c) 2015 V.Krishn (insteps.net)';
  NbReader.about = function () {
    alert(
      "\nVersion: "+this.version+
      "\n\nNbReader: \n \(RSS Reader / Web frontend for Newsbeuter\)\n\n"+
      this.copyright);
  }
}( NbReader = window.NbReader || {} ) );

(function( NbReader, $, undefined ) {
  var SetRssList = NbReader.SetRssList = function (config) {
    root = config.nodes;
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
      if(e.target) { e.preventDefault(); obj = e.target; }
        else { obj = e; }; title = obj.title;
      NbReader.activenode = obj;
      
      if ((obj.tagName) == 'INPUT') { return; }

      if( (obj.tagName) == 'IMG' && $(obj).hasClass('favicon') ) {
        return;
      }
      
      if( (obj.tagName) == 'SPAN' && $(obj).hasClass('glyphicon') ) {
        return;
      }

      if( (obj.tagName) == 'SPAN' && $(obj).hasClass('badge') ) {
        a = obj.parentNode; // TODO - add popup opts
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
      
      if( NbReader.doNodeRefresh != 'yes' ) {
        NbReader.ToggleNode(a); NbReader.SetBreadCrumb(obj, false); }
      NbReader.GetFeedList(config);
      
      return false;
    }

    // ## ------------ Click Rss file item to View Item Content
    NbReader.Rss = rss.onclick = function(e) {
      if(e.target) { var obj = e.target } else { var obj = e; };
      var title = obj.title;
      if ((obj.tagName) == 'INPUT') { return; }
      if ((obj.tagName) == 'SPAN') { a = obj.parentNode; }
      if ((obj.tagName) == 'A') { a = obj; }

      var alist = NbReader.NewsList = NbReader.RssAct.getElementsByTagName(config.list);
      $(alist).removeClass('active');
      $(a).toggleClass('active'); NbReader.activerss = a;
      data = $(NbReader.RssAct).data(NbReader.activehash);

      var id = (/(\#)([\d]+)$/).exec(a.href)[2];
      $.each( data.query, function( key ) {
        if(id == data.query[key].id) {
          d = data.query[key]; return; }
      });
      now = new Date();
      var mEpoch = parseInt(d.pubDate);
      if(mEpoch < 10000000000) { mEpoch *= 1000; }
      now.setTime(mEpoch);
      var dt = dateFormat(now, "ddd, mmm dS, yyyy, h:MM TT");
      var items = [];
        items.push( 
        "<div class='list-group-item l0'>" + NbReader.readsm
        + "<a href='"+d.url+"'" + "class=' '" + "title='"+d.title+"'" + ">" 
        + "<span class='title'>" + d.title + "</span>"
        + "</a>"
        + "<div class='author'><strong>Author:</strong> " + d.author + "</div>"
        + "<div class='pubdate'><strong>Published:</strong> " + dt + "</div>"
        + "<div class='status'>" + NbReader.pagersm
        + "<span class='glyphicon glyphicon-flag green " + "' aria-hidden='true'></span> "
        + "<span class='glyphicon glyphicon-tags blue " + "' aria-hidden='true'></span> "
        + "<span class='glyphicon glyphicon-bookmark " + "' aria-hidden='true'></span> "
        + "<span class='glyphicon glyphicon-picture " + "' aria-hidden='true'></span> "
        + "&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-edit " + "' aria-hidden='true'></span> "
        + "&nbsp;&nbsp;<span class='glyphicon glyphicon-cog " + "' aria-hidden='true'></span> "
        + "</div>"
        + "<hr />"
        + "<div class='text'>" + d.content + "</div>"
        + NbReader.pagersm + "</div>"
        );
      content = "<div class='list-group '" + ">"  + items.join("") + "</div>";
      NbReader.RssView.innerHTML = content;

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
      r = (obj.tagName == 'A') ? obj : obj.parentNode;
      id = r.hash.replace(/\#/, ''); 

      unread = ($(r).hasClass('unread')) ? 'no' : 'yes';
      a = NbReader.activenodeXml;
      db = $( a ).attr( "data-db" ); if( ! db ) return;

      url = NbReader.config.apiurl+'/unread_/cat/'+db+'/id/'+id+'/unread/'+unread+'/format/json';
      $.getJSON( url, function( data ) {
        if(String(data.result) == 'true') {
          console.log('change read status of: ' + db+'::'+id);
          $(r).toggleClass('unread');
          NbReader.doNodeRefresh = 'yes';
          atn = $(a)[0].title; _s = "a[title='"+atn+"']";
          $( "#collapseOne " + _s).children('.badge').first().trigger( "click" );
        }
      });      

    });

    // ## ------------
    NbReader.rsspgrsm[0].onclick = NbReader.SetRssPagerSimple;

    // ## ------------
    h = $('#navbar-header');
    h[0].onclick = function(e) {
      e.preventDefault(); obj = e.target;
      if(obj.tagName != 'A') { return; }
      //$('#accordion').hide(); //# TODO basic transitions/effects
      //$('#rss').hide();
      //$('#rssview').hide();
      hash = obj.hash;
      //$(hash).css('display', 'block');
      $('html, body').finish().animate({
         'scrollTop': ($(hash).offset().top)-55
      }, 1200, 'swing');
      return false;
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
//   NbReader.ToggleNodeXml = function (obj) {
// //    if( ! $(obj).hasClass('activexml') ) { $(obj).toggleClass('activexml'); }
//   }

  NbReader.GetUrl2Hash = function (obj) {
    return (/\/[^\/]*\.xml$/i).exec(obj.href)[0].replace(/\//g, '').replace(/\.xml$/, '');
  }
  NbReader.GetHash2Url = function (hash) {
  }
  
  NbReader.IsXml = function (obj) {
    if( (/\.xml$/i).test(obj.href) ) { return true; }
    return false;
  }
  NbReader.SetActiveXmlNode = function (a) {
    $(this.activenodeXml).removeClass('activexml');
    $(a).addClass('activexml');
    this.activenodeXml = a; this.activenodeXmlHref = a.href;
  }
  NbReader.SetXml = function (obj) {
    NbReader.nodeType = 'xml';
    NbReader.SetActiveXmlNode(obj);
    NbReader.SetBreadCrumb(obj, true);
    var hash = NbReader.GetUrl2Hash(obj);
    if(hash == NbReader.activehash && NbReader.doXmlRefresh != 'yes')
      { return false; } //same as previous
    NbReader.activehash = hash; NbReader.feedoffset = 0;
    NbReader.GetFeed(NbReader.config);
  }
  NbReader.IsActiveXmlUpdated = function (newNum) {
    var oldn = NbReader.GetNodeCount(NbReader.activenodeXml);
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

  NbReader.SetRssPagerPrev = function () {
    prev = $(NbReader.RssActPgs).children('li.prev').children('a');
    $(prev[0]).trigger( "click" );
  }
  NbReader.SetRssPagerNext = function () {
    next = $(NbReader.RssActPgs).children('li.next').children('a');
    $(next[0]).trigger( "click" );
  }
  NbReader.SetRssPagerSimple = function (e) {
    obj = e.target;
    var li = $(NbReader.RssActPgs).children('li');
    if(li.length < 3) { return; }
    if( $(obj).hasClass('prev') ) { NbReader.SetRssPagerPrev(); }
    if( $(obj).hasClass('next') ) { NbReader.SetRssPagerNext(); }
  }
  NbReader.SetRssViewPgrSm = function (e) {
    obj = e.target;
    if( $(obj).hasClass('prev') ) {
      if ( $(NbReader.activerss).prev('a')[0] ) {
        $(NbReader.activerss).prev('a').trigger( "click" );
      } else { NbReader.SetRssPagerPrev(); }
    }
    if( $(obj).hasClass('next') ) {
      if ( $(NbReader.activerss).next('a')[0] ) {
        $(NbReader.activerss).next('a').trigger( "click" ); 
      } else { NbReader.SetRssPagerNext(); }
    }
  }

  NbReader.SetRssViewReadTog = function (e, isInit) {
    if(e.target) { e.preventDefault(); }
    if( isInit != true ) { $(NbReader.activerss).trigger( "dblclick" ); }
    setTimeout(function() {
      obj = $('#rssview .list-group-item .readtog')[0];
      $(obj).toggleClass('active');
      $(obj).children('.glyphicon').toggleClass('glyphicon-check');
      $(obj).children('.glyphicon').toggleClass('glyphicon-unchecked');
    }, 500);
    return false;
  }

  NbReader.GetIconByDbname = function (dbname) {
    isfetch = $(NbReader.RssListRoot).data('isfetch.icon.'+dbname); //unset ?
    isdata = $(NbReader.RssListRoot).data('icon.'+dbname);
    if(isdata) { NbReader.RefreshNodeIcon(NbReader.activenodeA); }
    if(isfetch == 'yes' || isdata) return;
    console.log('GetIconByDbname:: '+dbname);
    $(NbReader.RssListRoot).data('isfetch.icon.'+dbname, 'yes');
    setTimeout(function() {
      $.ajax({
        dataType: "json",
        url: NbReader.config.apiurl+'/icon/format/json/cat/'+dbname,
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
    alist = $(node).next('div').children('a');
    for (var i = 0; i < alist.length; i++) {
      var t1 = alist[i];
      if( NbReader.IsXml(t1) ) {
        hash = NbReader.GetUrl2Hash(t1);
        db = $( t1 ).attr( "data-db" );
        data = $(NbReader.RssListRoot).data('icon.'+db);
        if(data && data.icon[hash]) {
          img = '<img class="favicon" src="data:'+data.icon[hash]+'" align="left" />';
          span = $(t1).children('.glyphicon')[0];
          if(span) {
            $(span).removeClass('glyphicon-tags');
            span.innerHTML = img;
          }
        }
      }
    }
  }
  
  
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var GetFeedList = NbReader.GetFeedList = function (config) {
    obj = NbReader.activenode; a = NbReader.activenodeA;

    refresh = NbReader.doNodeRefresh == 'yes' ? 'yes' : 'no';
    f = $(a).data('fetched'); // no action if already fetched
    if( typeof f != 'undefined' && refresh != 'yes' ) { return; }

    NbReader.doNodeRefresh = '';
    console.log('GetFeedList:: '+a.title+' (unfetched)');
    //$(obj).css('background-color', 'red');
    title = a.title; title = title.replace(/\//g, '~');

    $.ajax({
      dataType: "json",
      url: NbReader.config.apiurl+'/meta/unread/yes/tag/'+title+'/format/json/refresh/'+refresh,
      data: '',
      success: function(data) {
        var now = new Date(); var n = now.getTime(); 
        $(a).data('fetched', { time: n, count: 1 });

        // update badge values/number
        $.each( data._category, function( key, val ) {
          _s = "a[title='"+key+"']";
          $( "#collapseOne " + _s).children('.badge')[0].innerHTML = val;
        });

        var items = []; var dbs = [];
        $.each( data._by_cat[a.title], function( key, val ) {
          if( ! (/\.xml$/i).test(key) ) { return; }; //check for xml url
          var db = val.title.split(/::/);
          dbs.push( db[0] );
          axml = NbReader.activenodeXmlHref == key ? 'activexml' : '';
          items.push(
          "<a href='" + key + "' class='list-group-item xml " + axml + "' title='"+a.title+"' data-db='"+db[0]+"'>" 
          + "<span class='badge'>" + val.count + "</span>"
          + "<span class='glyphicon glyphicon-tags' aria-hidden='true'></span> "
          + "<span class='text'>"+db[1]+"</span>"
          + "</a>" );
        });
        if( ! items.length ) { return; }
        if( typeof $(a).next()[0] != 'undefined'  ) {
          h = $(a).next('div').hasClass('hidden') ? 'hidden ' : '';
          if( $(a).next()[0].tagName == 'DIV' && $(a).next()[0].title !== '') {
            $(a).next("div").remove();
          }
        }
        var ac = (/ (l)(\d)/i).exec(a.parentNode.className);
        l = 'l'+(parseInt(ac[2])+1);
        rsslist = "<div class='list-group " + h + l + "' title='" + a.title + "'>"
                   + items.join("") 
                   + "</div>";
        $(a).after(rsslist);

        setTimeout(function() {
          aXML = $(a).next('div').first().children('.activexml')[0];
          if(aXML) NbReader.SetActiveXmlNode(aXML);
        }, 100);
        
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
      url: NbReader.config.apiurl+'/item/cat/'+db+'/hash/'+hash+'/row/10-'+ofs+'/filter/default'+'/format/json',
      data: '',
      success: function(data) {
        var now = new Date(); var n = now.getTime();
        $(a).data('fetched', { time: n, count: 1 });
        $(NbReader.RssAct).data(hash, data);

        var items = [];
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
        if( ! items.length ) { return; }
        rsslist = "<div class='list-group rss-items l0 '" + ">" + items.join("") + "</div>";
        NbReader.RssAct.innerHTML = rsslist;
        setTimeout(function() {
          $(NbReader.RssAct).children('.rss-items').children('a').first().trigger( "click" );
        }, 100);

        NbReader.SearchRSS(NbReader.config);

        // data.count = full count (unread+read)
        m = (data.count%10) > 0 ? 1 : 0; var pgs = parseInt(data.count/10)+m; //pager data
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
                NbReader.GetFeed(NbReader.config);
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
    list = NbReader.RssList;
    search = $("#collapseOne input.search");

    $(search).keydown(function(e) {
      if(this.value == '' && e.keyCode == 13) {
        NbReader.SearchFeedListReset(list)
      }
    });

    // reset styles first
    NbReader.SearchFeedListReset = function (list) {
      $(list).removeClass('hiddenYES');
      $(list).next('div').removeClass('hiddenNO');
      $(list).next('div').next('div').removeClass('hiddenNO');
      $(list).children('.glyphicon').removeClass('allleft');
    }

    $( search[0] ).change(function() {
      NbReader.SearchFeedListReset(list);
      if(this.value == '') return false;
      $(list).next('div').addClass('hiddenNO');
      $(list).next('div').next('div').addClass('hiddenNO');
      $(list).children('.glyphicon').addClass('allleft');
      for (var i = 0; i < list.length; i++) {
        var t1 = list[i].title; var e1 = 't1.search(/'+this.value+'/i)';
        var t2 = list[i].text; var e2 = 't2.search(/'+this.value+'/i)';
        var n1 = eval(e1); var n2 = eval(e2);
        if( n1 == -1 && n2 == -1 ) {
          $(list[i]).addClass('hiddenYES');
        }
      }
    });
    return false;
  }

}( NbReader, jQuery = window.jQuery || {} ) );




/*]]>*/

