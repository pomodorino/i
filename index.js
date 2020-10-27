
function passWord() {
var testV = 1;
var pass1 = prompt('Indovina la password:','');
while (testV < 300) {
if (!pass1)
history.go(-1);
if (pass1.toLowerCase() == "rocher") {
alert('Esatt.');
window.open('index2.html');
break;
}
testV+=1;
var pass1 =
prompt('Riprova, o vat accir:','');
}
if (pass1.toLowerCase()!="password" & testV ==300)
history.go(-1);
return " ";
}
