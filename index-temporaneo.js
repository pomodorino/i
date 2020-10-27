
function passWord() {
var testV = 1;
var pass1 = prompt('Inserisci la password','');
while (testV < 3) {
if (!pass1)
history.go(-1);
if (pass1.toLowerCase() == "rocher") {
alert('Esatt');
window.open('index3.html');
break;
}
testV+=1;
var pass1 =
prompt('Riprova','');
}
if (pass1.toLowerCase()!="password" & testV ==3)
history.go(-1);
return " ";
}
