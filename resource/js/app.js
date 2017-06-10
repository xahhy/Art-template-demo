var info;
var server_url = 'http://192.168.0.145:8000';
var api_video_list_url = server_url + '/api?format=json';
var api_categary_list_url = server_url + '/api/category?format=json';
var api_home_list_url = server_url + '/api/home?format=json';
var api_year_list_url = server_url + '/api/year?format=json';
var sel_category_list = $("#category-list");
var sel_video_list = $("#video-list");
var sel_year_list = $("#year-list");
var sel_breadcrumb_list = $("#breadcrumb-list");
var cur_year=null;
var cur_category=null;

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

function render_video_list(category,year) {
    content = {
        'category': category,
        'year'  : year
    };
    $.getJSON(api_video_list_url, content, function (result) {
        var html = template("video-list-template", {
            videos: result.results,
            server_url: server_url
        });
        sel_video_list.html(html);

        //add click function
        // sel_category_list.find("> li").each(function () {
        //     $(this).click(click_category);
        // })
    });
}

function render_breadcrumb_list(title) {
    if(title === undefined)
        title='All Videos';
    console.log(cur_year);
    var html = template('breadcrumb-list-template',{
        title   : title,
        year    : cur_year
    });
    sel_breadcrumb_list.html(html);
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
function click_category() {
    //add active class to current button
    sel_category_list.find(".active").removeClass("active");
    $(this).addClass("active");

    //render the video list
    var category = $(this).attr('name');
    cur_category = category;
    clear_cur_year();
    render_video_list(category);

    //render the breadcrumb and title

    render_breadcrumb_list(category);

}
function click_year(obj) {
    cur_year = $(obj).text();
    render_video_list(cur_category,cur_year);
    render_breadcrumb_list(cur_category);
}
function click_more(obj) {
    category = $(obj).attr("name");
    sel_category_list.find('[name="' + category + '"]').click();
}
function clear_cur_year() {
    cur_year = null;
}
function click_home() {
    sel_category_list.find(".active").removeClass("active");
    cur_category = null;
    clear_cur_year();

    render_home_list();
}
//$("ul.pagination").children().map(function(){
//     console.log($(this).find("a").attr("href"));
// })
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

    $("button[name='search']").click(function () {
        $("#search-form").submit(function(e) {

            var url = api_video_list_url; // the script where you handle the form input.
            // data = $("#search-form").serializeArray().append("year":cur_year);
            formdata = new FormData($('#search-form')[0]);
            formdata.append("year",cur_year);
            $.ajax({
                type: "GET",
                url: url,
                data:formdata, // serializes the form's elements.
                success: function(data)
                {
                    console.log(data); // show response from the php script.
                }
            });
            e.preventDefault(); // avoid to execute the actual submit of the form.
        });
    });

    render_category_list();
    // render_video_list();
    render_home_list();
    render_year_list();

});