　
var string = '';　
function varinfo(info) {
    var NewArray = new Array();　
    var NewArray = string.split("**");
    for (let i = 0; i < NewArray.length; i++) {
        string = string + NewArray[0]
    }
    document.write("切割出來的第一個區塊是 " + NewArray[0] + '<br>');
}　　
document.write("切割出來的第二個區塊是 " + NewArray[1]);