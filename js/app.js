/**
 * Created by hhy on 2017/6/9.
 */
// var source = '<ul>'
//     +    '{{each list value i}}'
//     +        '<li>索引 {{i + 1}} ：{{value}}</li>'
//     +    '{{/each}}'
//     + '</ul>';
//
// var render = template.compile('/template/each-video.html');
// var src = "<ul>
// {{each list value i}}
// <li>索引 {{i + 1}} ：{{value}}</li>
// {/each}}
// </ul>";
var api_url = 'http://1.8.90.47:8888/api?format=json';
var info;
// var api_url = 'http://localhost:8000/api?format=json';
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