function saveHighlight(){
    $.ajax('savehighlight', {
        method: 'POST'
    });
}