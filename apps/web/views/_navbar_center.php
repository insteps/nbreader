
    <div id="rss-input-group" class="input-group">
      <div class="input-group-btn">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span><span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu">
          <li><a href="#">Today</a></li>
          <li><a href="#">This Week</a></li>
          <li><a href="#">Last Week</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Toggle Sticky Search</a></li>
          <li><a href="#">Toggle [Un]read</a></li>
          <li><a href="#">Options</a></li>
          <li><a href="#">Apply Filter</a></li>
        </ul>
      </div>
      <input type="text" class="form-control search" placeholder="Search for...">
      <div class="input-group-btn pager-simple">
        <button type="button" class="btn btn-default prev">&laquo;</button>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span><span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-right">
          <li><nav id='rssactive-pager-top-wrap'>
            <form id="gotoPage" class="input-with-button">
            <input id="rssactive-pager2" type="number" min="1" max="1" value="1" class="form-control js-total-pages-value" placeholder="Goto Page ..." ></form>
          </nav></li>
        </ul>
        <button type="button" class="btn btn-default next">&raquo;</button>
      </div>
    </div><!-- /.input-group -->

    <div id="rssactive">
    </div><!-- /.rssactive -->

    <nav id='rssactive-pager-wrap'>
      <ul id='rssactive-pager' class="pagination pagination-sm">
        <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
        <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
      </ul>
    </nav><!-- /.rssactive-pager -->

