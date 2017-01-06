//1、隐藏字符，在控制台执行后复制得到的结果
"var a='haha',b='hehe';console.log(a+b)".replace(/./g,function(u){
    return u.charCodeAt().toString(2).replace(/./g,function(n){
        return n==0?"​":"‌"
    }) + "‍";
}).replace(/.$/,'');

//2、解析&执行隐藏的字符的函数
function run(x){
    eval(x.split("‍").map(function(x){
        return String.fromCharCode(parseInt(x.replace(/./g,function(x){
            return x.charCodeAt()==8203?0:1
        }),2))
    }).join(''));
}

//3、将1中复制的不可见字符串粘贴到run函数中当做参数，最后打印出了"hahahehe"
run("‌‌‌​‌‌​‍‌‌​​​​‌‍‌‌‌​​‌​‍‌​​​​​‍‌‌​​​​‌‍‌‌‌‌​‌‍‌​​‌‌‌‍‌‌​‌​​​‍‌‌​​​​‌‍‌‌​‌​​​‍‌‌​​​​‌‍‌​​‌‌‌‍‌​‌‌​​‍‌‌​​​‌​‍‌‌‌‌​‌‍‌​​‌‌‌‍‌‌​‌​​​‍‌‌​​‌​‌‍‌‌​‌​​​‍‌‌​​‌​‌‍‌​​‌‌‌‍‌‌‌​‌‌‍‌‌​​​‌‌‍‌‌​‌‌‌‌‍‌‌​‌‌‌​‍‌‌‌​​‌‌‍‌‌​‌‌‌‌‍‌‌​‌‌​​‍‌‌​​‌​‌‍‌​‌‌‌​‍‌‌​‌‌​​‍‌‌​‌‌‌‌‍‌‌​​‌‌‌‍‌​‌​​​‍‌‌​​​​‌‍‌​‌​‌‌‍‌‌​​​‌​‍‌​‌​​‌")

//备忘：三个空字符
// String.fromCharCode(8203)
// String.fromCharCode(8204)
// String.fromCharCode(8205)
