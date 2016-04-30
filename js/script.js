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

    var search = getParameterByName('search');
    $categorySearch.val(search);
    if (search) {
        $categorySearch.addClass("full")
        $removeSearch.show();
        var query = search.toLowerCase();
        $thumbnail.each(function() {
            var $this = $(this);
            var title = $this.find('.title a').text();
            if (title.toLowerCase().indexOf(query) === -1) {
                $this.hide();
            } else {
                $this.show();
            }
        });
    } else {
        $categorySearch.removeClass("full");
        $removeSearch.hide();
        $thumbnail.each(function() {
            var $this = $(this);
            $this.show();
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
}

window.onhashchange = updateState;

function updateSort(sortValue) {
    console.log('updateSort', sortValue);
    replaceHashParam('sort', sortValue);
}

function updateSearch(searchValue) {
    replaceHashParam('search', searchValue);
}

$(function() {
    updateState();

    var $categorySearch = $('#categorySearch');
    $categorySearch.on('input', function() {
        replaceHashParam('search', $categorySearch.val());
    });

    var $globalSearch = $('#global-search');
    $globalSearch.pressEnter(function() {
        var url = "/search/#sort=recommended&search=" + $globalSearch.val();
        window.location.href = url;
    });
});
