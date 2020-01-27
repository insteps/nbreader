/*<![CDATA[*/

/**
 * Copyright (c) 2015-2020 V.Krishn (vkrishn@insteps.net)
 *
 * This file is part of "Newsbeuter Reader";
 * See accompanying main package for license and more details.
 * ----
 *
 * Newsbeuter Frontend Client API (NbClient)
 *  Async/Get Json data and return/dispatch or store it.
 *
 */

;(function( NbClient, undefined ) {
  var config = NbClient.Config = function (conf) {
    this.config = conf;
    this.version = conf.version;

    this.copyright = 'Copyright (c) 2015-2020 V.Krishn (insteps.net)';
    this.about = function () {
      alert(
        "\nVersion: "+this.version+
        "\n\nNbClient: \n \(Newsbeuter Client API\)\n\n"+
        this.copyright);
    };
    return this;
  };
}( this.NbClient = window.NbClient || {} ) );

;(function( NbClient, $, undefined ) {
  /**
   * Api baseurl eg. (http://localhost/nbreader/api/rss)
   */
  var api = NbClient.Api = {
    event: function (e) {
      return this;
    },
    init: function () {
      return this;
    },
    version: function () {
      this.cls_ = 'version';
      this.opts_ = [];
      return this;
    },
    about: function () {
      this.cls_ = 'about';
      this.opts_ = [];
      return this;
    },
    template: function () {
      this.cls_ = 'template';
      this.opts_ = [];
      return this;
    },
    category: function () {
      /**
       * /category : 
       * category      = Function call (get list of top category i.e. dbnames)
       */
      this.cls_ = 'category';
      this.opts_ = [];
      return this;
    },
    urls: function () {
      /**
       * /urls/cat/dev : 
       * urls      = Function call
       *   cat/<dbname>         = Load category/database named <dbname>
       */
      this.cls_ = 'url';
      this.opts_ = ['cat'];
      return this;
    },
    urls_as_key: function () {
      return this;
    },
    appdb: function () {
      this.cls_ = 'appdb';
      this.opts_ = [];
      return this;
    },
    feed: function () {
      /**
       * /feed/cat/dev/row/<limit>-<offset>/hash/<sha1sum> : 
       * feed      = Function call
       *   cat/<dbname>         = Load category/database named <dbname>
       *   row/<limit>-<offset> = Fetch number of rows = <limit> starting at <offset>
       *   hash/<sha1sum>       = Fetch rss feeds list (with hash row values has no effect)
       */
      this.cls_ = 'feed';
      this.opts_ = ['cat', 'row', 'hash'];
      return this;
    },
    item: function () {
      /**
       * /item/cat/dev/row/<limit>-<offset>/id/<idnum> : 
       * item      = Function call
       *   cat/<dbname>         = Load category/database named <dbname>
       *   row/<limit>-<offset> = Fetch number of rows = <limit> starting at <offset>
       *   id/<idnum>           = Fetch rss item by id (with id row values has no effect)
       *   hash/<sha1sum>       = Fetch/filter rss item/records by hash
       *   filter/<default>     = Apply security filters on articles
       *   unread               = yes|no (show list that is read or unread)
       */
      this.cls_ = 'item';
      this.opts_ = ['cat', 'row', 'id', 'hash', 'filter', 'unread'];
      return this;
    },
    count: function () {
      /**
       * /count/cat/dev/unread/yes :
       * count     = Function call
       *   cat/<dbname> = Load category/database named <dbname>
       *   unread       = yes|no (show list that is read or unread)
       */
      this.cls_ = 'count';
      this.opts_ = ['cat', 'unread'];
      return this;
    },
    meta: function () {
      /**
       * /meta/cat/dev/tag/<tag>/unread/<yes|no> : 
       * meta      = Function call
       *   cat/<dbname>       = Load from category/database named <dbname>
       *   tag/<rss category> = Rss category (`~` as separator, eg business~seo~example.com)
       *   unread/<yes|no>    = yes|no (get list that is either read or unread)
       *   refresh/<yes|no>   = yes|no (use cached data)
       */
      this.cls_ = 'meta';
      this.opts_ = ['cat', 'tag', 'unread', 'refresh'];
      return this;
    },
    _allmeta: function () {
    },
    _meta: function () {
    },
    icon: function () {
      /**
       * /icon/cat/dev/tag/<tag>/hash/<sha1sum>/refresh/<yes|no> :
       * icon      = Method/Function call
       *   hash/<sha1sum>             = Fetch icons by hash (filter records by hash)
       *   cat/<dbname>               = Load from category/database named <dbname>
       *   group/<sha1sum 1st letter> = Fetch icons by hash group (filter records by sha1sum 1st letter) # TODO
       *   tag/<rss category>         = Rss category (`~` as separator, eg business~seo~example.com) # TODO
       *   refresh/<yes|no>           = yes|no (use cached data)
       */
      this.cls_ = 'icon';
      this.opts_ = ['hash', 'cat', 'group', 'tag', 'refresh'];
      return this;
    },
    unread_: function () {
      /**
       * /unread_/cat/dev/id/<idnum>/unread/<yes|no> : 
       * unread_      = Function call
       *   cat/<dbname>    = Update category/database named <dbname>
       *   id/<idnum>      = update rss item for <id>
       *   unread/<yes|no> = update item to read or unread
       */
      this.cls_ = 'unread_';
      this.opts_ = ['cat', 'id', 'unread'];
      return this;
    },
 
    get: function (callback, fe) {
      // fe = frontend object with initialized fe.Client
      req = NbClient.Call.Async(this.url_, '', callback, fe);
      return req;
    },
    set: function (params) {
      var items = []; items.push(this.cls_);
      for(var i=0; i<this.opts_.length; i++) {
        o = this.opts_[i];
        if (params[o]) { items.push(o+'/'+params[o]); }
      }
      this.url_ = items.join("/");
      return this;
    }

  };
}( NbClient ) );

;(function( NbClient, $, undefined ) {
  var call = NbClient.Call = {
    getJson: function (url, d, success) { //no sense
      var request = $.getJSON( url, function( data ) {
        return data;
      });
    },
    beforeSend: function(xhr, settings) {
      settings.url = this.config.apiurl+'/'+settings.url+'/format/json/';
    },
    Async: function (url, d, callback, fe) {
      var request = $.ajax({
        beforeSend: this.beforeSend,
        dataType: 'json',
        method: 'GET',
        cache: true,
        //context: document.body,
        context: fe,
        url: url,
        data: d,
        //timeout: 12000,
        statusCode: {
          404: function() { alert( "page not found" ); },
          200: this.status200,
          301: this.status301 //moved
        },
        error: this.error,
        dataFilter: function(data, type) {
          return data;
        },
        success: callback,
        complete: function( xhr, status ) {
        }
      });
      request.done(function(data, status, xhr) {
      });
      request.fail(function(xhr, status, error) {
      });
      request.always(function(data, status, xhr) {
      });
      request.then(function(data, status, xhr) {
      });
      return request;
    },
    error: function( xhr, status, error ) {
      this.Client.Log.con('Error: Async '+status+'|'+error);
    },
    status200: function( xhr, status, error ) { this.Client.Log.con('Async:: 200 (OK)'); },
    status301: function( xhr, status, error ) {
      this.Client.Log.con('Async:: request url has moved');
    },
    toggle: function (url, id) {
      data = this.getJson(url);
      if(String(data.result) == 'true') {
        return true;
      }
      return false;
    },
    set_toggle: function (items, status) {
      return this;
    }
  
  };
}( NbClient, jQuery = window.jQuery || {} ) );

;(function( NbClient, $, undefined ) {
  var optims = NbClient.Optims = {
    default: [
      data=100
    ],
    checksize: function (text) {
    },
    optimsize: function (text) {
    }
  };
}( NbClient, jQuery = window.jQuery || {} ) );

;(function( NbClient, $, undefined ) {
  var logs = NbClient.Log = {
    con: function (text) {
      if ( console && console.log ) {
        //console.log( NbClient.Util.epoch() + ': ' + text );
        console.log( text );
      }
    },
    lstor: function (text) {
      this.con(text);
    },
    objs: function (obj, act, jstr) {
      var items = []; items.push(obj.length);
      for(var i=0; i<obj.length; i++) { o = obj[i]; items.push(o); }
      var j = (jstr) ? jstr : '\n';
      if(act == 1) { alert(items.join(j)); }
      if(act == 2) { this.con(items.join(j)); }
    }
  };

  var notify = NbClient.Notify = {
    init: function (obj) {
    },
    con: function (text) {
    },
    page: function (text) {
    },
    modal: function (text) {
    }
  };
  
  var util = NbClient.Util = {
    epoch: function () {
     var now = new Date();
     return now.getTime();
    },
    fixEpoch: function (epoch) {
      var mEpoch = parseInt(epoch);
      if(mEpoch < 10000000000) { mEpoch *= 1000; }
      return mEpoch;
    },
    fmtEpoch: function (epoch, fmt) {
      now = new Date(); now.setTime(this.fixEpoch(epoch));
      return dateFormat(now, fmt); //remember to load 3rd party script
    },
    datefmts: {
      article: 'ddd, mmm dS, yyyy, h:MM TT',
      articleshort: 'mm/dd/yy, h:MM TT',
      time: 'h:MM TT'
    },
    fmtDt: function (epoch, fmt) {
      return dateFormat(this.fmtEpoch(epoch), this.datefmts[fmt]);
    },
    Url2Hash: function (obj) {
      if(obj.href) {
        return (/\/[^\/]*\.xml$/i).exec(obj.href)[0].replace(/\//g, '').replace(/\.xml$/, '');
      }
    },
    Hash2Url: function (hash) {
    },
    IsXml: function (obj) {
      if( (/\.xml$/i).test(obj.href) ) { return true; }
      return false;
    }
  };
}( NbClient, jQuery = window.jQuery || {} ) );



;(function( $, window, document, undefined ) {

  // NbClients constructor
  var NbClients = function( elem, options ) {
    this.elem = elem;
    this.$elem = $(elem);
    this.options = options;

    // This next line takes advantage of HTML5 data attributes
    // to support customization of the plugin on a per-element
    // basis. For example,
    // <div class=item' data-plugin-options='{"message":"Hello World!"}'></div>
    this.metadata = this.$elem.data( 'plugin-options' );
  };

  NbClients.prototype = window.NbClient; //redefine prototype ??
  
  // NbClients prototype
  NbClients.prototype.defaults = {
    message: 'Welcome to Newsbeuter Reader!'
  };

  NbClients.prototype.init = function() {
    // Introduce defaults that can be extended either
    // globally or using an object literal.
    this.config = $.extend({}, this.defaults, this.options,
    this.metadata);

    // Sample usage:
    // Set the message per instance:
    // $('#elem').nbclient({ message: 'Hello World!'});
    // or
    // var p = new NbClients(document.getElementById('elem'),
    // { message: 'Hello World!'}).init()
    // or, set the global default message:
    // NbClients.defaults.message = 'Hello World!'

    this.init_msg();
    return this;
  };

  NbClients.prototype.init_msg = function() {
    // eg. show the currently configured message
    this.Log.con(this.config.message);
  };

  NbClients.defaults = NbClients.prototype.defaults;

  $.fn.nbclients = function(options) {
    return this.each(function() {
      new NbClients(this, options).init();
    });
  };

  // Expose it to global
  window.NbClients = NbClients;


})( jQuery, window , document );




/*]]>*/

