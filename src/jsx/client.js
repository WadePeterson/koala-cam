function saveHighlight(){
    $.ajax('savehighlight', {
        method: 'POST'
    }).done(function (url) {
        var video = document.getElementsByTagName('video')[0];
        video.src = url;
    });
}