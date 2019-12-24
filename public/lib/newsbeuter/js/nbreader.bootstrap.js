/*<![CDATA[*/

/**
 * Copyright (c) 2015-2016 V.Krishn (vkrishn@insteps.net)
 *
 * This file is part of "Newsbeuter Reader";
 * See accompanying main package for license and more details.
 * ----
 * 
 * Newsbeuter Reader UI Api (uses bootstrap framework)
 * 
 */

(function( NbReader, undefined ) {
  var Config = NbReader.Config = function(conf) {
    this.config = conf;
    this.version = conf.version;
    this.copyright = 'Copyright (c) 2015-2016 V.Krishn (insteps.net)';
    this.about = function() {
       alert(
         "\nVersion: "+this.version+
         "\n\nNbReader: \n \(RSS Reader / Web frontend for Newsbeuter\)\n\n"+
         this.copyright);
    };
    return this;
  };
}( this.NbReader = window.NbReader || {} ) );

(function( NbReader, $, undefined ) {
  var UI = NbReader.UI = {
    init: function(self) {
      this.Frame.init(self);
      this.Header.init(self);
      this.HeadNavs.init(self);
      this.BreadCrb.init(self);
      this.RssList.init(self);
      this.Rss.init(self);
      this.Article.init(self);
      return this;
    },
    isGlyph: function(obj) {
      return (obj.tagName) == 'SPAN' && $(obj).hasClass('glyphicon') ? true : false;
    },
    isFavicon: function(obj) {
      return (obj.tagName) == 'IMG' && $(obj).hasClass('favicon') ? true : false;
    },
    isBadge: function(obj) {
      return (obj.tagName) == 'SPAN' && $(obj).hasClass('badge') ? true : false;
    },
    isText: function(obj) {
      return (obj.tagName) == 'SPAN' && $(obj).hasClass('text') ? true : false;
    },
    isSearch: function(obj) {
      return (obj.tagName) == 'INPUT' ? true : false;
    }

  };

  var Data = NbReader.UI.Data = {
    glyphicon: function(glyphicon) {
      if( ! glyphicon ) { return ''; }
      return '<span class="glyphicon ' + glyphicon + '" aria-hidden="true"></span>';
    },
    btn: function(cls, text) {
      return '<button type="button" class="btn ' + cls + '">' + text + '</button>';
    },
    aBtnSt: function(href, cls) {
      return '<a href="'+ href +'" class="btn ' + cls + '" role="button">';
    },
    pgrSm: function() {
      return '<div class="btn-group pager-simple">'
        + this.btn('prev', '&laquo;') + this.btn('next', '&raquo;') + '</div>';
    },
    readSm: function() {
      return this.aBtnSt('#', 'btn-default btn-sm readtog')
        + this.glyphicon('glyphicon-unchecked') + '</a>';
    },
    icon: function(cls, type, base64) {
      cls = (cls === '') ? 'favicon' : cls;
      var src = (type == 'base64') ? 'data:'+base64 : type;
      return '<img class="'+cls+'" src="'+src+'" align="left" alt="" title="" />';
    },
    glyph2icon64: function(obj, gcls, cls, base64) {
      var span = $(obj).children('.glyphicon')[0];
      if(span) { $(span).removeClass(gcls);
        span.innerHTML = this.icon(cls, 'base64', base64); }
    },
    rsspgr: function() {
       return '<ul id="rssactive-pager" class="pagination pagination-sm"><li>x</li></ul>';
    }
  };
  
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var Frame = NbReader.UI.Frame = {
    init: function() {
      this.setHeights(2);
      window.onresize = function() { this.setHeights(); }
      return this;
    },
    setHeight1P: function(h) {
      $('#rsslist').css({ height: "auto" });
      $('#rss').css({ height: "auto" });
      $('#rssview').css({ height: "auto" });
      $('#rssactive').css({ height: "auto" });
      $('#article1').css({ height: "auto" });
      return this;
    },
    setHeight2P: function(h) {
      $('#rsslist').data('pLayout', 2);
      $('#rss').removeClass('col-md-6');
      $('#rss br').css({ display: 'none' });
      $('#rssview').removeClass('col-md-6');
      $('#rssactive').height(h/3.2).css({ overflow: "auto" });
      $('#article1').height(h-(h/1.60)).css({ overflow: "auto" });
      return this;
    },
    setHeight3P: function(h) {
      $('#rsslist').data('pLayout', 3);
      $('#rss').addClass('col-md-6').height(h-5).css({ overflow: "auto" });
      $('#rss br').css({ display: 'block' });
      $('#rssview').addClass('col-md-6').height(h-5).css({ overflow: "auto" });
      return this;
    },
    setHeights: function(p) {
      var contentHt = $( window ).height()-$('#breadcrumb').height()- $('.navbar').height()-10;
      if($('#rsslist').data('pLayout') !== p) {
        this.setHeight1P(contentHt); //reset
      }
      console.log(contentHt+' setting pLayout -> '+p);
      if($( window ).width() > 768) {
          $('#rsslist').height(contentHt).css({ overflow: "auto" });
          if(p == 2) { this.setHeight2P(contentHt); }
          if(p == 3) { this.setHeight3P(contentHt); }
          if( typeof p == 'undefined' ) {
            console.log(contentHt+ ' undefined -> pLayout');
          }
      }
      return this;
    }
  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var Header = NbReader.UI.Header = {
    event: function(e) {
      e.preventDefault(); 
      return this;
    },
    init: function(NBR) {
      this.header = $('#navbar-header');
      this.header[0].NBR = NBR;
      this.header[0].onclick = this.onclick;
      return this;
    },
    onclick: function(e) {
      e.preventDefault(); var obj = e.target;
      if(obj.tagName != 'A') { return; }
      var hash = obj.hash;
      $('html, body').finish().animate({
         'scrollTop': ($(hash).offset().top)-55
      }, 1200, 'swing');
      return this;
    }
  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var HeadNavs = NbReader.UI.HeadNavs = {
    event: function(e) {
      return this;
    },
    init: function(NBR) {
      this.hnavs = $('#navbar');
      this.hnavs[0].NBR = NBR;
      this.hnavs[0].onclick = this.menuClick;
      return this;
    },
    btns: function() {
      return this;
    },
    btnsClick: function() {
      return this;
    },
    menu: function() {
      return this;
    },
    menuClick: function(e) {
      e.preventDefault(); var obj = e.target;
      if(obj.tagName != 'A') { return; }
      //for (a in this.NBR.UI.Frame) { console.log(a); }
      //return;
      var hash = obj.hash;
      if(hash == '#toglayout' || hash == '#toglayout2') {
        obj.href = '#toglayout3';
        this.NBR.UI.Frame.setHeights(3);
      }
      if(hash == '#toglayout3') {
        obj.href = '#toglayout2';
        this.NBR.UI.Frame.setHeights(2);
      }
      return this;
    }
  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var BreadCrb = NbReader.UI.BreadCrb = {
    event: function(e) {
      return this;
    },
    init: function(NBR) {
      this.breadcrumb_ = NBR.config.breadcrumb;
      this.breadcrumb = document.getElementById(this.breadcrumb_); 
      return this;
    },
    set: function() {
      $(this.breadcrumb).children('ol').children('.xml').remove();
    },
    show: function() {
      return this;
    },
    hide: function() {
      return this;
    },
    update: function(obj, isXml) {
      this.set(); // ## set breadcrumb
      var bc = obj.title.split(/\//); var _bc = [];
      for (var i = 0; i < bc.length-1; i++) {
        _bc.push( '<li><a href="#">' + bc[i] + '</a></li>' );
      } _bc.push( '<li class="active">' + bc[i] + '</li>' );
      $(this.breadcrumb).children('ol')[0].innerHTML = _bc.join("");
      if(isXml) { // ## append to breadcrumb
        $(this.breadcrumb).children('ol').append('<li class="xml">'+obj.text+'</li>');
      }
      return this;
    }
  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var RssList = NbReader.UI.RssList = {
    event: function(e) {
      e.preventDefault();
      if(e.target) { obj = e.target; } else { obj = e; }
      this.NBR.UI.RssList.activenode = obj;
      this.NBR.UI.RssList.nodeClick(obj, this.NBR);
    },
    init: function(NBR) {
      var root = NBR.config.nodes;
      if(typeof root !== 'object') {
        this.Root = document.getElementById(root);
        this.Root.NBR = NBR;
        this.List = this.Root.getElementsByTagName(NBR.config.list);
        this.doNodeRefresh = ''; this.doXmlRefresh = '';
        this.Root.onclick = this.event;
        this.Search = $('#'+root+' input.search');
        this.search();
      }
      return this;
    },
    searchReset: function(list) {
      // reset styles first
      $(list).removeClass('hiddenYES');
      $(list).next('div').removeClass('hiddenNO');
      $(list).next('div').next('div').removeClass('hiddenNO');
      $(list).children('.glyphicon').removeClass('allleft');
      return this;
    },
    search: function() {
      var list = this.List; var RssList = this;

      $(this.Search).keydown(function(e) {
        if(this.value === '' && e.keyCode == 13) {
          RssList.searchReset(list);
        }
      });

      $( this.Search[0] ).change(function() {
        RssList.searchReset(list);
        if(this.value === '') { return false; }
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
      return this;
    },
    setActiveXmlNode: function(a) {
      $(this.activenodeXml).removeClass('activexml');
      $(a).addClass('activexml');
      this.activenodeXml = a; this.activenodeXmlHref = a.href;
    },
    getXmlFolder: function(a) {
      if( typeof $(a).next()[0] != 'undefined' ) {
        return ($(a).next()[0].tagName == 'DIV' &&
                $(a).next()[0].title !== '') ? $(a).next() : false;
      }
      return false;
    },
    getNextNode: function(a) {
      if( typeof $(a).next()[0] != 'undefined' ) {
        return $(a).next('div');
      }
      return false;
    },
    nodeBadge: function(obj) {
      return $(obj).children('.badge')[0];
    },
    nodeCount: function(obj) {
      return parseInt(this.nodeBadge(obj).innerHTML);
    },
    activeXmlBadge: function() {
        return this.nodeBadge($(this.activenodeXml.parentNode).prev('a')[0]);
    },
    isNodeUpdated: function(newNum, node) {
      var oldn = this.nodeCount(node);
      return (oldn !== newNum) ? true : false;
    },
    node: function(a, NBR) {
      this.nodeType = 'node';
      refresh = this.doNodeRefresh == 'yes' ? 'yes' : 'no';

      // ## Get/Set Rss/Xml file
      if( NBR.Client.Util.IsXml(a) ) { this.xmlClick(a, NBR); return this; }

      // ## else not xml link (nodes/feedlist)
      $(this.activenodeA).removeClass('active');
      this.activenodeA = a;

      if( refresh != 'yes' ) {
        this.nodeToggle(a);
        NBR.UI.BreadCrb.update(this.activenode, false);
      }
      this.folderClick(a, refresh, NBR);
      return this;
    },
    nodeToggle: function(a) {
      $(obj).toggleClass('active');
      $(obj).next('div').toggleClass('hidden');
      if($(obj).next('div').next('div')) { $(obj).next('div').next('div').toggleClass('hidden'); }
      $(obj).children('.glyphicon').toggleClass('glyphicon-folder-close');
      $(obj).children('.glyphicon').toggleClass('glyphicon-folder-open');
    },
    nodeClick: function(obj, NBR) {
      UI = NBR.UI;
      if( UI.isSearch(obj) ) { return; }
      if( UI.isFavicon(obj) ) { return; }
      if( UI.isGlyph(obj) ) { return; }
      if( UI.isBadge(obj) ) { a = obj.parentNode; this.badge(a, NBR); }
      if( UI.isText(obj) ) { a = obj.parentNode; }
      if((obj.tagName) == 'A') { a = obj; }
      this.node(a, NBR);
      return;
    },
    folder: function(data, status, xhr) {
      if(status != 'success' && xhr.readyState != 4) { return; }
      var NBR = this; var list = NBR.UI.RssList;
      var a = list.activenodeA;
      var n = NBR.Client.Util.epoch();
      $(a).data('fetched', { time: n, count: 1 });

      // update badge values/number
      $.each( data._category, function( key, val ) {
        list.badgeUpdate(key, val);
      });

      // create feeds list
      var items = []; var dbs = [];
      $.each( data._by_cat[a.title], function( key, val ) {
        if( ! (/\.xml$/i).test(key) ) { return; } //check for xml url
        var db = val.title.split(/::/);
        dbs.push( db[0] );
        var axml = list.activenodeXmlHref == key ? 'activexml' : '';
        items.push(
        "<a href='" + key + "' class='list-group-item xml " + axml 
        + "' title='"+a.title+"' data-db='"+db[0]+"'>" 
        + "<span class='badge'>" + val.count + "</span>"
        + NBR.UI.Data.glyphicon('glyphicon-tags')
        + "<span class='text'>"+db[1]+"</span>"
        + "</a>" );
      });
      if( ! items.length ) { return; }
      // update/add xml/feed list nodes
      var l = ''; var h = '';
      if( list.getNextNode(a) ) {
        var h = $(a).next('div').hasClass('hidden') ? 'hidden ' : '';
      }
      var ac = (/ (l)(\d)/i).exec(a.parentNode.className); // eg. l2
      var l = 'l'+(parseInt(ac[2])+1);
      rsslist = "<div class='list-group " + h + l + "' title='" + a.title + "'>"
                 + items.join("") 
                 + "</div>";
      var divXml = list.getXmlFolder(a);
      if( divXml ) { $(divXml).remove(); }
      $(a).after(rsslist);

      setTimeout(function() {
        var aXML = $(a).next('div').first().children('.activexml')[0];
        if(aXML) list.setActiveXmlNode(aXML);
      }, 100);

      // Fetch icon files
      $.each( dbs, function( key, val ) {
        list.getIconByDbName(val, a, NBR); //trigger icons fetch
      });
        
      return;
    },
    folderClick: function(a, refresh, NBR) {
      var f = $(a).data('fetched'); // no action if already fetched;
      if( typeof f != 'undefined' && refresh != 'yes' ) { return this; }

      this.doNodeRefresh = '';
      title = a.title.replace(/\//g, '~');
      NBR.Client.Log.con('GetFeedList:: ' + a.title);
      params = { unread: 'yes', tag: title, refresh: refresh };
      this.nreq_ = NBR.Client.Api.meta().set(params).get(this.folder, NBR);

      return this;
    },
    xml: function(data, status, xhr) {
      if(status != 'success' && xhr.readyState != 4) { return; }
      var NBR = this; var rss = NBR.UI.Rss; var list = NBR.UI.RssList;
      var n = NBR.Client.Util.epoch();
      $(list.activenodeA).data('fetched', { time: n, count: 1 });
      $(rss.Active).data(list.activehash, data);

      // if rss feed got updated
      if( list.isNodeUpdated(data.count_unread, list.activenodeXml) ) {
        setTimeout(function() {
          $(list.activeXmlBadge()).first().trigger('click');
        }, 100);
      }
      rss.list(data, NBR).search().pager(data, NBR);
      return;
    },
    getXml: function(NBR) {
      a = this.activenodeXml;
      this.doXmlRefresh = '';

      var f = $(a).data('fetched');
      //if( typeof f != 'undefined' ) { return; } # TODO

      db = $( a ).attr( "data-db" ); if( ! db ) { return this; }
      var hash = this.activehash;
      var ofs = NBR.UI.Rss.feedoffset;

      NBR.Client.Log.con( 'GetFeed:: ' + hash + ' at ' + ofs );
      params = { row: '10-'+ofs, cat: db, hash: hash, filter: 'default' };
      this.rreq_ = NBR.Client.Api.item().set(params).get(this.xml, NBR);
  
      return this;
    },
    xmlClick: function(obj, NBR) {
      this.nodeType = 'xml';
      this.setActiveXmlNode(obj);
      NBR.UI.BreadCrb.update(obj, true);
      var hash = NBR.Client.Util.Url2Hash(obj);
      if(hash == this.activehash && this.doXmlRefresh != 'yes') {
        return this; //same as previous
      }
      this.activehash = hash; NBR.UI.Rss.feedoffset = 0;
      this.getXml(NBR);
      return this;
    },
    badge: function(a, NBR) {
      // TODO - add popup opts
      if( NBR.Client.Util.IsXml(a) ) { this.doXmlRefresh = 'yes'; }
        else { this.doNodeRefresh = 'yes'; }
      NBR.Client.Log.con('Badge:: refresh (yes)');
      return this;
    },
    getBadgeByTitle: function(title) {
      _s = "a[title='"+title+"']";
      return $( "#collapseOne " + _s).children('.badge');
    },
    badgeUpdate: function(title, text) {
      this.getBadgeByTitle(title)[0].innerHTML = text;
      return this;
    },
    badgeShowOpts: function() {
      return this;
    },
    badgeHideOpts: function() {
      return this;
    },
    badgeClick: function() {
      return this;
    },
    refreshNodeIcon: function(node, NBR) {
      alist = $(node).next('div').children('a');
      for (var i = 0; i < alist.length; i++) {
        var t1 = alist[i];
        if( NBR.Client.Util.IsXml(t1) ) {
          hash = NBR.Client.Util.Url2Hash(t1);
          db = $( t1 ).attr( "data-db" );
          data = $(this.Root).data('icon.'+db);
          if(data && data.icon[hash]) {
            NBR.UI.Data.glyph2icon64(t1, 'glyphicon-tags', '', data.icon[hash]);
          }
        }
      }
      return this;
    },
    setIconByDbname: function(dbname, data) {
      $(this.Root).data('icon.'+dbname, data);
      $(this.Root).data('isfetch.icon.'+dbname, 'done');
      return this;
    },
    getIconByDbName: function(dbname, a, NBR) {
      isfetch = $(this.Root).data('isfetch.icon.'+dbname); //unset ?
      isdata = $(this.Root).data('icon.'+dbname);
      if(isdata) { this.refreshNodeIcon(a, NBR); }
      if(isfetch == 'yes' || isdata) { return this; }
      NBR.Client.Log.con('GetIconByDbname:: '+dbname);
      $(this.Root).data('isfetch.icon.'+dbname, 'yes');
      setTimeout(function() {
        params = { cat: dbname };
        this.ireq_ = NBR.Client.Api.icon().set(params).get('', NBR);
        this.ireq_.done(function(data, status, xhr) {
          if(status != 'success') { return this; }
          NBR.UI.RssList.setIconByDbname(dbname, data).refreshNodeIcon(a, NBR);
        });
      }, 500);
      return this;
    }
  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var Rss = NbReader.UI.Rss = {
    init: function(NBR) {
      this.Active = document.getElementById(NBR.config.rssactive); //list of 10 rss items
      this.feedoffset = 0;
      this.rsspager = document.getElementById('rssactive-pager');
      this.rsspagerwrap = document.getElementById('rssactive-pager-wrap'); 
      this.rsspgrsm = $("#rss div.pager-simple");
      this.rsspgrsm[0].NBR = NBR;
      this.rsspgrsm[0].onclick = this.pagersm;
      this.Active.NBR = NBR;
      this.Active.onclick = this.listClick;
      this.Active.ondblclick = this.listDblClick;
      return this;
    },
    search: function() {
      // Search Active RSS Items
      setTimeout(function() {
        var options = {
          valueNames: [ 'title', 'pubdate', 'author'],
          listClass: [ 'rss-items']
        };
        var rssItems = new List('rss', options);
      }, 200);
      return this;
    },
    searchChange: function() {
      // For persistent/sticky search
      return this;
    },
    pgrPrev: function() {
      prev = $(this.rsspager).children('li.prev').children('a');
      $(prev[0]).trigger( "click" );
      return this;
    },
    pgrNext: function() {
      next = $(this.rsspager).children('li.next').children('a');
      $(next[0]).trigger( "click" );
      return this;
    },
    pagersm: function(e) {
      e.preventDefault();
      var obj = e.target; var rss = this.NBR.UI.Rss;
      var li = $(rss.rsspager).children('li');
      if(li.length < 3) { return; }
      if( $(obj).hasClass('prev') ) { return rss.pgrPrev(); }
      if( $(obj).hasClass('next') ) { return rss.pgrNext(); }
    },
    list: function(data, NBR) {
      var items = []; var uD = NBR.UI.Data;
      $.each( data.query, function( key ) {
        d = data.query[key];
        unread = d.unread; unreadc = unread ? 'unread' : '';
        var dt = NBR.Client.Util.fmtDt(d.pubDate, 'article');
        items.push(
        "<a href=#" + d.id + " class='list-group-item "+ unreadc + "'" + "title='"+d.title+"'" + ">" 
        + uD.glyphicon('glyphicon-flag green')
        + uD.glyphicon('glyphicon-tags blue')
        + uD.glyphicon('glyphicon-bookmark')
        + "<span class='pubdate'>" + dt + ' ' + uD.glyphicon('glyphicon-cog') + " </span>"
        + "<span class='author hidden'>" + d.author + "</span>"
        + "<br class='br' /><span class='title'>" + d.title + "</span>"
        + "</a>" );
      });
      if( ! items.length ) { return this; }
      rsslist = "<div class='list-group rss-items l0 '" + ">" + items.join("") + "</div>";
      this.Active.innerHTML = rsslist;
      setTimeout(function() { // activate first item
        $(NBR.UI.Rss.Active).children('.rss-items').children('a').first().trigger( "click" );
      }, 100);
      return this;
    },
    pager: function(data, NBR) {
      // data.count = full count (unread+read)
      var m = (data.count%10) > 0 ? 1 : 0;
      var pgs = parseInt(data.count/10)+m; //pager data

      // make pagination and redo on new list
      var pgr = this.rsspager;
      li = $(pgr).children('li');
      search2 = $("#rss input.search");
      if(li.length < 3 || this.feedoffset === 0) {
        $(pgr).remove();
        this.rsspagerwrap.innerHTML = NBR.UI.Data.rsspgr();
        pgr = this.rsspager = $('#rssactive-pager');
        setTimeout(function() {
          $(search2).attr( "placeholder", 'Search for...      Pgs: 1/'+pgs );
          $(pgr).twbsPagination({
            totalPages: pgs,   visiblePages: 4,
            prev: '&lt;',      next: '&gt;',
            first: '&lt;&lt;', last: '&gt;&gt;',
            onPageClick: function(event, page) {
              NBR.UI.Rss.feedoffset = (parseInt(page)-1)*10;
              NBR.UI.RssList.getXml(NBR);
              $(search2).attr( "placeholder", 'Search for...      Pgs: '+page+'/'+pgs );
            }
          });
        }, 100);
      }
      return this;
    },
    listClick: function(e) {
      e.preventDefault(); 
      if(e.target) { obj = e.target; } else { obj = e; }
      var title = obj.title; var elm = obj.tagName;
      var NBR = this.NBR; var Rss = NBR.UI.Rss; var a = '';
      if(elm === 'INPUT') { return; }
      if(elm === 'SPAN') { a = obj.parentNode; }
      if(elm === 'A') { a = obj; }

      var lst = Rss.Active.getElementsByTagName(NBR.config.list);
      $(lst).removeClass('active'); $(a).toggleClass('active');
      Rss.activerss = a;
      data = $(Rss.Active).data(NBR.UI.RssList.activehash);

      var ar = NBR.UI.Article.view(a, data, NBR).pager(NBR).btnRead(NBR);
      // activate actions on current article view
      var ar = NBR.UI.Article.view(a, data, NBR)
                 .pager(NBR).btnRead(NBR).btnStatus(NBR);
      if( ! $(a).hasClass('unread')) { ar.btnReadTog(); }

      return;
    },
    listDblClick: function(e) {
      e.preventDefault();
      if(e.target) { obj = e.target; } else { obj = e; }
      r = (obj.tagName == 'A') ? obj : obj.parentNode;
      id = r.hash.replace(/\#/, ''); 
      var NBR = this.NBR; var rsslist = NBR.UI.RssList;

      unread = ($(r).hasClass('unread')) ? 'no' : 'yes';
      a = rsslist.activenodeXml;
      db = $( a ).attr( "data-db" ); if( ! db ) { return; }

      NBR.Client.Log.con('change read status of: ' + db+'::'+id);
      params = { cat: db, id: id, unread: unread };
      this.r_unread_ = NBR.Client.Api.unread_().set(params).get('', NBR);
      this.r_unread_.done(function(data, status, xhr) {
        if(String(data.result) == 'true') {
          $(r).toggleClass('unread'); NBR.UI.Article.btnReadTog();
          rsslist.doNodeRefresh = 'yes';
          atn = $(a)[0].title; _s = "a[title='"+atn+"']";
          $( "#collapseOne " + _s).children('.badge').first().trigger( "click" );
        }
      });

      return this;
    }

  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var Article = NbReader.UI.Article = {
    init: function(NBR) {
      this.rssview = document.getElementById('rssview');
      var id = this.rssview.id;
      this.pgr = '#'+id + ' .list-group-item .pager-simple';
      this.btnread = '#'+id + ' .list-group-item .readtog';
      this.btnstatus = '#'+id + ' .status';
      this.rssview.onclick = this.aClick;
      return this;
    },
    view: function(a, data, NBR) {
      var id = (/(\#)([\d]+)$/).exec(a.href)[2];
      $.each( data.query, function( key ) {
        if(id == data.query[key].id) {
          d = data.query[key]; return; }
      });
      var dt = NBR.Client.Util.fmtDt(d.pubDate, 'article');
      var items = []; var uD = NBR.UI.Data;
        items.push( 
        "<div class='list-group-item l0'>" + uD.readSm()
        + "<a href='"+d.url+"'" + "class=' '" + "title='"+d.title+"'" + " target='_blank'>" 
        + "<span class='title'>" + d.title + "</span>"
        + "</a>"
        + "<div class='author'><strong>Author:</strong> " + d.author + "</div>"
        + "<div class='pubdate'><strong>Published:</strong> " + dt + "</div>"
        + "<div class='status'>" + uD.pgrSm()
        + uD.glyphicon('glyphicon-flag flag green')
        + uD.glyphicon('glyphicon-tags tags blue')
        + uD.glyphicon('glyphicon-bookmark bookmark')
        + uD.glyphicon('glyphicon-picture picture')
        + uD.glyphicon('glyphicon-edit edit')
        + uD.glyphicon('glyphicon-cog options')
        + "</div>"
        + "<hr />"
        + "<div id='article1' class='text clearfix'>" + d.content + "</div>"
        + uD.pgrSm() + "</div>"
        );
      content = "<div class='list-group '" + ">"  + items.join("") + "</div>";
      this.rssview.innerHTML = content;
      NBR.UI.Frame.setHeights($('#rsslist').data('pLayout'));

      return this;
    },
    aClick: function(e) {
      var obj = e.target;
      if(obj.tagName == 'A') { obj.target = '_blank'; }
      return this;
    },
    btnReadTog: function() {
      obj = $(this.btnread)[0];
      $(obj).toggleClass('active');
      $(obj).children('.glyphicon').toggleClass('glyphicon-check');
      $(obj).children('.glyphicon').toggleClass('glyphicon-unchecked');
      return this;
    },
    btnReadClick: function(e) {
      e.preventDefault(); var ui = this.NBR.UI;
      $(ui.Rss.activerss).trigger( "dblclick" );
      return this;
    },
    btnRead: function(NBR) {
      var rtog = $(this.btnread)[0]; rtog.NBR = NBR;
      rtog.onclick = this.btnReadClick;
      return this;
    },
    btnStatusClick: function(e) {
      e.preventDefault(); var a = '';
      if(e.target) { obj = e.target; } else { obj = e; }

      var ui = this.NBR.UI;
      var NBR = this.NBR;  
	  var Rss = NBR.UI.Rss;

      var elm = obj.tagName;
      if(elm === 'SPAN') { a = obj.parentNode; }
      if(elm === 'DIV') { a = obj; }

      return this;
    },
    btnStatus: function(NBR) {
      var st = $(this.btnstatus)[0]; st.NBR = NBR;
      st.onclick = this.btnStatusClick;
      return this;
    },
    pagerClick: function(e) {
      e.preventDefault();
      var obj = e.target; var rss = this.NBR.UI.Rss;
      if( $(obj).hasClass('prev') ) {
        if( $(rss.activerss).prev('a')[0] ) {
          $(rss.activerss).prev('a').trigger( "click" );
        } else { rss.pgrPrev(); }
      }
      if( $(obj).hasClass('next') ) {
        if( $(rss.activerss).next('a')[0] ) {
          $(rss.activerss).next('a').trigger( "click" ); 
        } else { rss.pgrNext(); }
      }
      return this;
    },
    pager: function(NBR) {
      pgr = $(this.pgr);
      pgr[0].NBR = NBR; pgr[0].onclick = this.pagerClick;
      pgr[1].NBR = NBR; pgr[1].onclick = this.pagerClick;
      return this;
    }

  };
}( NbReader, jQuery = window.jQuery || {} ) );

(function( NbReader, $, undefined ) {
  var Footer = NbReader.UI.Footer = {
    event: function(e) {
      e.preventDefault();
      return this;
    },
    init: function() {
      return this;
    }
  };
}( NbReader, jQuery = window.jQuery || {} ) );





/*]]>*/


