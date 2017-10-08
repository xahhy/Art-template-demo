var info;
var server_url = 'http://127.0.0.1:8000';
var api_base_url = server_url + '/api/';
var api_video_list_url = api_base_url + '?format=json';
var api_categary_list_url = api_base_url + 'category?format=json';
var api_home_list_url = api_base_url + 'home?format=json';
var api_year_list_url = api_base_url + 'year?format=json';
var sel_category_list = $("#category-list");
var sel_video_list = $("#video-list");
var sel_year_list = $("#year-list");
var sel_breadcrumb_list = $("#breadcrumb-list");
var sel_pagination_list = $("#m-pagination");

var cur_year = "";
var cur_category = "";
var year_title = new Vue({
    el: '#year-title',
    data: {
        year: "Year"
    }
});
var refresh_btn = new Vue({
    el: "#nav-refresh",
    data: {
        video_id: "",
        see: false
    }
});
var bread_crumb = new Vue({
    el: '#breadcrumb-list',
    data: {
        year: "",
        title: 'Home',
        video: ""
    }
});
function render_category_list() {
    $.getJSON(api_categary_list_url, {}, function (result) {
        console.log(result);
        var html = template("category-list-template", {
            categories: result
        });
        sel_category_list.html(html);
        //add click function
        sel_category_list.find("> li").each(function () {
            $(this).click(click_category);
        })
    });
}

function render_video_detail(video_id) {
    var url = api_base_url + video_id;
    $.getJSON(url, {'format': 'json'}, function (result) {
        console.log(result);
        var html = template("video-detail-template", {
            video: result
        });
        sel_video_list.html(html);
        bread_crumb.title = result.title;

        init_video(result.video, result.image);
    });
}

function render_video_list(category, year, page) {
    content = {
        'category': category,
        'year': year,
        'page': page
    };
    $.getJSON(api_video_list_url, content, function (result) {
        handle_result(result);
    });
}

function render_breadcrumb_list(title) {
    if (title === "")
        title = 'All Videos';
    bread_crumb.title = title;
    bread_crumb.year = cur_year;
    // var html = template('breadcrumb-list-template',{
    //     title   : title,
    //     year    : cur_year
    // });
    // sel_breadcrumb_list.html(html);
}

function render_home_list() {
    content = {};
    $.getJSON(api_home_list_url, content, function (result) {
        console.log("home");
        console.log(result);
        var html = template("home-list-template", {
            pre_categorys: result,
            server_url: server_url
        });
        sel_video_list.html(html);
        //add click function
        // sel_category_list.find("> li").each(function () {
        //     $(this).click(click_category);
        // })
    });
    render_breadcrumb_list("Home");
}
function render_year_list() {
    $.getJSON(api_year_list_url, {}, function (result) {
        console.log(result);
        var html = template("year-list-template", {
            years: result
        });
        sel_year_list.html(html);
        //add click function
        // sel_category_list.find("> li").each(function () {
        //     $(this).click(click_category);
        // })
    });
}

function handle_result(result) {
    var html = template("video-list-template", {
        videos: result.results,
        cur_page: result.cur_page,
        num_pages: result.num_pages,
        page_range: result.page_range,
        previous: result.previous,
        next: result.next,
        server_url: server_url
    });
    sel_video_list.html(html);

    //add pagination click function
    $("#m-pagination").find("[name]").each(function () {
        $(this).click(click_page);
    });
    for (var page = 1; page <= result.num_pages; page++) {
        var item = '<li><a href="javascript:void(0);" name="' + page + '">' + page + '</a></li>';
        var $list = $(item);
        $("#goto-menue").append($list);
        $list.find("a").click(click_page);
    }
}
// return the current category name
function get_current_category() {
    cur_ = sel_category_list.find(".active span");
    var cur_category_name;
    if (cur_.length === 0) {
        cur_category_name = "";
    } else {
        cur_category_name = cur_.html();
    }
    console.log(cur_category_name);
    return cur_category_name;
}
function init_video(video_url,img_url) {
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: "Big Buck Bunny Trailer",
                m4v: video_url,
                // m4v: 'http://localhost:8001/media/hhy/1.mp4',
                // flv: 'http://localhost:8001/media/hhy/1.flv',
                // m4v: "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
                // ogv: "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
                poster: img_url
            });
        },
        cssSelectorAncestor: "#jp_container_1",
        swfPath: "bower_components/jPlayer/dist/jplayer/",
        supplied: "m4v,flv",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true,
        size: {
            width: "100%", height: "720px",cssClass:"jp-video-720p"
        }
    });
}
/* Click Handlers */
function click_category() {
    //add active class to current button
    sel_category_list.find(".active").removeClass("active");
    $(this).addClass("active");

    //render the video list
    var category = $(this).attr('name');
    if (category === null || category === undefined)
        category = "";
    cur_category = category;
    clear_cur_year();
    render_video_list(category);

    //render the breadcrumb and title

    render_breadcrumb_list(category);

}
function click_video(obj) {
    video_id = $(obj).attr("video-id");
    console.log("video id=" + video_id);
    render_video_detail(video_id);
    refresh_btn.video_id = video_id;
    refresh_btn.see = true;
}
function click_year(obj) {
    cur_year = $(obj).attr("name");
    year_title.year = cur_year === "" ? "Year" : cur_year;
    render_video_list(cur_category, cur_year);
    render_breadcrumb_list(cur_category);
}
function click_refresh(obj) {
    cur_id = $(obj).attr("video-id");
    console.log("cur video id=" + cur_id);
    render_video_detail(cur_id);
}
function click_more(obj) {
    category = $(obj).attr("name");
    sel_category_list.find('[name="' + category + '"]').click();
}

function clear_cur_year() {
    cur_year = "";
    year_title.year = "Year"
}

function click_home() {
    sel_category_list.find(".active").removeClass("active");
    cur_category = "";
    clear_cur_year();
    render_home_list();
}

function click_page() {
    var page_ = $(this).attr("name");
    render_video_list(cur_category, cur_year, page_);
}
function click_pagination() {
    text = $(this).text();
    console.log(text);
}


$(function () {
    // auto open and close for year button
    $('li.dropdown').mouseover(function () {
        $(this).addClass('open');
    }).mouseout(function () {
        $(this).removeClass('open');
    });

    //add year param to paginator
    $("ul.pagination > li").each(function () {
        $(this).click(click_pagination);
        var page_btn = $(this).find("[href]");
        href = page_btn.attr("href");
        href += "&year=" + $("#m-pagination").attr("year");
        page_btn.attr("href", href);
    });

    num_pages = $("#m-pagination").attr("num_pages");
    for (var page = 1; page <= num_pages; page++) {
        var href = "?page=" + page + "&year=" + $("#m-pagination").attr("year");
        var item = '<li><a href="' + href + '">' + page + '</a></li>';
        $("#goto-menue").append(item);
    }

    $("#search-form").submit(function (e) {
        var url = api_video_list_url; // the script where you handle the form input.
        data = $("#search-form").serialize();
        console.log(data);
        data += "&year=" + cur_year;
        data += "&category=" + cur_category;
        $.ajax({
            type: "GET",
            url: url,
            data: data, // serializes the form's elements.
            success: function (result) {
                handle_result(result);
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });

    render_category_list();
    // render_video_list();
    render_home_list();
    render_year_list();

    $("[name='breadcrumb-home']").each(function () {
        $(this).click(click_home);
    })
});