/**
 * Created by hhy on 2017/6/9.
 */
var info;
var api_url = 'http://localhost:8000/api?format=json';

$.getJSON(api_url, {}, function (result) {
    console.log(result.results);
    info = result.results;
    var html = template("list",{
        items : info
    });
    $("#content").html(html);
});
// $.ajax({
//     url:api_url,
//     type: 'GET',
//     dataType : 'json',
//     success: function (data) {
//         console.log(data);
//     },
//     error: function (data) {
//         console.log("error");
//     }
// });

/*
* video.get_absolute_url
* video.definition
* video.title
* video.duration
* */

// document.getElementById('content').innerHTML = html;