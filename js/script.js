function toggle_visibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}

$.fn.pressEnter = function(fn) {
  return this.each(function() {
    $(this).bind('enterPress', fn);
    $(this).keyup(function(e){
      if(e.keyCode == 13)
      {
        $(this).trigger("enterPress");
      }
    })
  });
};

function replaceHashParam(paramName, paramValue) {
  var hash = window.location.hash;
  var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)');
  if(hash.search(pattern) >= 0){
    hash = hash.replace(pattern,'$1' + paramValue + '$2');
  } else {
    hash += (hash ? '&' : '') + paramName + '=' + paramValue;
  }
  window.location.hash = hash;
}

function getParameterByName(name) {
  var match = new RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function updateState() {
  function ascending(a, b) {
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

  var $thumbnail = $('.thumbnail');

  var $categorySearch = $('#categorySearch');
  var $removeSearch = $('#removeSearch');
  var currentPath = window.location.pathname;
  var anyResults = 0;
  var $searchNoteNone = $('#search-note-none');
  var $searchNoteBlank = $('#search-note-blank');

  var search = getParameterByName('search');
  $categorySearch.val(search);
  if (search) {
    anyResults = 0;
    $searchNoteBlank.hide();
    $categorySearch.addClass("full")
    $removeSearch.show();
    var query = search.toLowerCase();
    $thumbnail.each(function() {
      var $this = $(this);
      var title = $this.find('.title a').text().toLowerCase();
      var director = $this.attr('data-director').toLowerCase();
      var genre = $this.attr('data-genre').toLowerCase();
      var cast = $this.attr('data-cast').toLowerCase();
      var country = $this.attr('data-country').toLowerCase();
      var match = title.indexOf(query) !== -1 || director.indexOf(query) !== -1 || genre.indexOf(query) !== -1 || cast.indexOf(query) !== -1 || country.indexOf(query) !== -1;
      if (match) {
        $this.css('display','inline-block');
        $this.show();
        anyResults = 1;
      } else {
        $this.hide();
      }
    });
    if (anyResults === 0) {
      $searchNoteNone.show();
    }
    else {
      $searchNoteNone.hide();
    }
  } else if (currentPath !== "/search-2/" && currentPath !== "/search-3/") {
    $categorySearch.removeClass("full");
    $removeSearch.hide();
    $thumbnail.each(function() {
      var $this = $(this);
      $this.css('display','inline-block');
      $this.show();
    });
  } else {
    $categorySearch.removeClass("full");
    $removeSearch.hide();
    $thumbnail.each(function() {
      var $this = $(this);
      $this.hide();
      $searchNoteNone.hide();
      $searchNoteBlank.show();
    });
  }

  var sort = getParameterByName('sort');
    $("#sortBy").text(sort);
    if (sort) {
      switch (sort.toLowerCase()) {
        case 'alphabetically':
          $thumbnail.sortElements(function(a, b) {
            var $a = $(a).find('.title a');
            var $b = $(b).find('.title a');
            var contentA = $a.text();
            var contentB = $b.text();
            return ascending(contentA, contentB);
          });
          break;

        case 'year':
          $thumbnail.sortElements(function(a, b) {
            var $a = $(a);
            var $b = $(b);
            var contentA = parseInt($a.attr('data-year'));
            var contentB = parseInt($b.attr('data-year'));
            return ascending(contentA, contentB);
          });
          break;

        case 'recommended':
          $thumbnail.sortElements(function(a, b) {
            var $a = $(a);
            var $b = $(b);
            var contentA = parseInt($a.attr('data-editors-rating'));
            var contentB = parseInt($b.attr('data-editors-rating'));
            return -ascending(contentA, contentB);
          });
          break;
      }
    }

  var $searchTitle = $('#search-title');
  $searchTitle.text(getParameterByName('search'));

  $("div.lazy").lazyload({
    //effect : "fadeIn"
  });

  //insert ads in thumbnails

  /*var countToAd = 0;
  $('.thumbnails .thumbnail').each(function(i){
    var $this = $(this);
    if (search === null) {
      if ($this.is(":visible")) {
        countToAd = countToAd + 1;

        if (countToAd === 3) {
          //$this.after('<div class="thumb-panda hide-our-pandas"></div>');
        }

        if (countToAd === 8) {
          $this.after('<div class="thumb-panda-full x4 hide-our-pandas"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block;margin-bottom:30px;" data-ad-client="ca-pub-8843122781716673" data-ad-slot="4196628149" data-ad-format="auto"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script></div>');
        }

        if (countToAd === 16) {
          $this.after('<div class="thumb-panda-full x4 hide-our-pandas"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block;margin-bottom:30px;" data-ad-client="ca-pub-8843122781716673" data-ad-slot="4196628149" data-ad-format="auto"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script></div>');
        }

        if (countToAd === 6) {
          $this.after('<div class="thumb-panda-full x3 hide-our-pandas"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block;margin-bottom:30px;" data-ad-client="ca-pub-8843122781716673" data-ad-slot="4196628149" data-ad-format="auto"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script></div>');
        }

        if (countToAd === 12) {
          $this.after('<div class="thumb-panda-full x3 hide-our-pandas"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block;margin-bottom:30px;" data-ad-client="ca-pub-8843122781716673" data-ad-slot="4196628149" data-ad-format="auto"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script></div>');
        }

        if (countToAd === 4) {
          $this.after('<div class="thumb-panda-full x2 hide-our-pandas"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block;margin-bottom:30px;" data-ad-client="ca-pub-8843122781716673" data-ad-slot="4196628149" data-ad-format="auto"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script></div>');
        }

        if (countToAd === 8) {
          $this.after('<div class="thumb-panda-full x2 hide-our-pandas"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block;margin-bottom:30px;" data-ad-client="ca-pub-8843122781716673" data-ad-slot="4196628149" data-ad-format="auto"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script></div>');
        }
      }
    }
  });*/
    
  //only show in store the items of the current tab:
  var storeCategory = getParameterByName('store-category');

  var $storeItems = $('.store-items');
  $storeItems.each(function() {
    var $this = $(this);
    if ($this.attr('id') == storeCategory) {
      $this.show();
    }

    else {
      $this.hide();
    }
  });

  //correctly highlight store tab:
  var $storeTab = $('.store-tab');
  $storeTab.each(function() {
    var $this = $(this);
    var thisCategory = $this.attr('data-category');
    if (storeCategory == thisCategory) {
      if(!$this.hasClass("selected")) {
        $this.addClass("selected");
      }
    }
    else {
      $this.removeClass("selected");
    }
  });
}

window.onhashchange = updateState;

function updateSort(sortValue) {
  console.log('updateSort', sortValue);
  replaceHashParam('sort', sortValue);
}

function updateSearch(searchValue) {
  replaceHashParam('search', searchValue);
}

$(document).mouseup(function (e)
{
  var container = $(".drop-menu");
  var menu = $(".menu");

  if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0) // ... nor a descendant of the container
  {
    menu.hide();
  }
});

// Run after all the page elements have loaded
window.onload = function(){

  // This will take care of asynchronous Google ads
  setTimeout(function() {

    // We are targeting the first banner ad of AdSense
    var ad = document.querySelector("ins.adsbygoogle");
    var $panda = $(".hide-our-pandas");
    var $message = $(".panda-message");

    // If the ad contains no innerHTML, ad blockers are at work
    if (ad && ad.innerHTML.replace(/\s/g, "").length == 0) {

      /*// Since ad blocks hide ads using CSS too
      ad.style.cssText = 'display:block !important; text-decoration: none !important';

      // You can put any text, image or even IFRAME tags here
      ad.innerHTML = '<div class = "please-message">Please consider turning off your ad blocker.</div>';*/

      $message.each(function() {
        var $this = $(this);
        $this.show();
      });
    }

    else {
      /*$panda.each(function() {
        var $this = $(this);
        $this.show();
      });

      $message.each(function() {
        var $this = $(this);
        $this.hide();
      });*/
    }

  }, 2000); // The ad blocker check is performed 2 seconds after the page load
};


$(function() {
  var $newsletterButton = $(".newsletter-button");
  var $newsletterModal = $(".newsletter-modal");
  var $modalBackdrop = $(".modal-backdrop");
  var $modalCloseButton = $(".modal-close-button");

  $newsletterButton.click(function () {
    $newsletterModal.show();
  });

  $modalBackdrop.click(function () {
    $newsletterModal.hide();
  });

  $modalCloseButton.mousedown(function () {
    $newsletterModal.hide();
  });

  updateState();

  /*var $categorySearch = $('#categorySearch');
  $categorySearch.on('input', function() {
    replaceHashParam('search', $categorySearch.val());
  });*/

  var $categorySearch = $('#categorySearch');
   $categorySearch.pressEnter(function() {
   replaceHashParam('search', $categorySearch.val());
   });

  var $searchAction = $('#search-action');
  $searchAction.click(function() {
    replaceHashParam('search', $categorySearch.val());
  });


  var $removeSearch2 = $('#remove-search-2');
  $removeSearch2.click(function() {
    $categorySearch.val('');
    updateSearch('');
  });

  /*var $globalSearch = $('#global-search');
  var $globalSearchForm = $('#global-search-form');
  $globalSearch.submit(function() {
    var url = "/search-2/#sort=recommended&search=" + $globalSearch.val();
    window.location.href = url;
  });*/

  var currentPath = window.location.pathname;
  if (currentPath === "/search-2/") {
    $("#categorySearch").focus();
  }

  var currentPath = window.location.pathname;
  if (currentPath === "/search-3/") {
    $("#categorySearch").focus();
  }

  //make store tab go change to appropriate hash
  $('.store-tab').click(function () {
    var tabCategory = $(this).attr('data-category');
    replaceHashParam('store-category', tabCategory);
  });
});
