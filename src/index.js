import GraphemeSplitter from 'grapheme-splitter';
import LanguageDetect from 'languagedetect';
import Sanscript from "sanscript";

const splitter = new GraphemeSplitter();
const langDetect = new LanguageDetect();

const form = document.getElementById('form');
const submitBtn = document.getElementById('submitBtn');
const segmented = document.getElementById('segmented');
const order = document.getElementById('order');
const result = document.getElementById('result');

const U=["ా","ీ","ూ","ౄ","ౣ","ే","ై","ో","ౌ","ః"];
const L=["ఆ","ఈ","ఊ","ౠ","ౡ","ఏ","ఐ","ఓ","ఔ","అః"];
const N={"UII":"భ గణము",
"IUI":"జ గణము",
"IIU":"స గణము",
"III":"న గణము",
"IUU":"య గణము",
"UIU":"ర గణము",
"UUI":"త గణము",
"UUU":"మ గణము",
"UI":"గల గణము",
"IIIU":"నగ గణము",
"IIUI":"సల గణము",
"IIII":"నల గణము",
"UIII":"భల గణము",
"UIIU":"భగరు గణము",
"UUII":"తల గణము",
"UUIU":"తగ గణము",
"UUUI":"మలఘ గణము",
"IIIII":"నలల గణము",
"IIIUU":"నగగ గణము",
"IIIIU":"నవ గణము",
"IIUUI":"సహ గణము",
"IIUIU":"సవ గణము",
"IIUUU":"సగగ గణము",
"IIIUI":"నహ గణము",
"UIUU":"రగురు గణము",
"IIII":"నల గణము"};

const l=['క్','ఖ్','గ్','ఘ్','ఙ్','చ్','ఛ్','జ్','ఝ్','ఞ్','ట్','ఠ్','డ్','ఢ్','ణ్','త్','థ్','ద్','ధ్',
'న్','ప్','ఫ్','బ్','భ్','మ్','య్','ర్','ల్','వ్','శ్','ష్','స్','హ్','ళ్','క్ష్','ఱ్'];


form.addEventListener('submit', (e) => {
    e.preventDefault();
});

submitBtn.addEventListener('click', async () => {

    //Clearing previous output texts
    order.textContent = '';
  
    result.textContent = '';
  
      const input = document.getElementById('input').value;
      if (input.length === 0) {
        alert("Need some input to get some output :)");
        return;
      }
  
      const languagePossibilities = langDetect.detect(input);
      let transliterateFrom = '';
      const transliterateTo = 'telugu';
      console.log(languagePossibilities)
  
      if (languagePossibilities.length === 0 ) {
        transliterateFrom = 'telugu';
      }
      
      else {
        for (let i = 0 ; i < languagePossibilities.length ; i++) {
  
          
  
          if (languagePossibilities[i][0] === 'hindi' || languagePossibilities[i][0] === 'nepali') {
            transliterateFrom = 'devanagari';
          }
          else{
            transliterateFrom = 'itrans';
          }
        }
      }
      console.log(transliterateFrom);
  
      const transliteratedText = Sanscript.t(input, transliterateFrom, transliterateTo);
      console.log(transliteratedText);
  
      const segmentedText = clusterGraphemes(transliteratedText);
      console.log(segmentedText)
      if(segmentedText[0]===" "){
        segmentedText.shift();

      }
      segmented.textContent = `The graphemes are: ${segmentedText}`;
  
      const textOrder = orderOfText(segmentedText);
  
      if (textOrder.length > 5) {
        alert("Can't have more than 5 ganams");
        order.textContent = `${input} has ${textOrder} ganams! Try again.`;
        result.textContent = `Less than ${textOrder.length} graphemes required`;
        return;
      }
  
      if (textOrder.length < 3) {
        alert("Can't have less than 3 ganams");
        order.textContent = `${input} has ${textOrder} ganams`;
        result.textContent = `More than ${textOrder.length} graphemes required`;
        return;
      }
  
      order.textContent = `${input} has ${textOrder} ganams`;
  
      result.textContent = `The final result: ${input}  అనే పదం   ${N[textOrder]}  కు చెందినది`;
  });



const clusterGraphemes = (str) => {
  return splitter.splitGraphemes(str);
}

const orderOfText = (graphemeArr) => {

  //Popping last element out of the array and saving in lastElement
  const lastElement = graphemeArr.pop();

  let f = [];
  let out = "";

  let res = graphemeArr.filter(i => !l.includes(i));
  res.push(lastElement);

  for (let i of res) {
    let kStr = i.toString();

    for (let j of kStr) {
    f.push(j);
    }
    if (f.some(x => U.includes(x))) {
    out += "U";
    } else if (f.some(x => L.includes(x))) {
    out += "U";
    } else {
    out += "I";
    }
    f = [];
    console.log(out)
    }

  return out;
}

