const { ipcRenderer } = require("electron")
const path = require("path");
const exec = require('child_process').exec;

const runit = document.getElementById("run");
const codeResult = document.getElementById("outuputcode");
const opendoc = document.getElementById("openDoc");
//here add a file save it and start typing 
const addfile = document.getElementById("createNewFileButton");
const filename = document.getElementById("filename");
const CodeTextArea = document.getElementById("editor");

var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight"); 
editor.session.setMode("ace/mode/javascript");
//code for the run button 

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout); 
    });
  };



addfile.addEventListener("click",()=>{

    console.log(editor.getSession().getValue());

    ipcRenderer.send("create-file" );
    // createNewFile()
});

ipcRenderer.on('file-created' , (_,filePath)=>{
    console.log("hello");

    filename.innerText = path.parse(filePath).base;
    // editor.getSession().setValue()
});

opendoc.addEventListener("click" , ()=>{
    ipcRenderer.send("open-document");
    console.log("open document");
   
});


ipcRenderer.on("document-opened" , (_ , {filePath, content}) =>{

    filename.innerText = path.parse(filePath).base;
    console.log(editor.getSession().getValue());
    editor.getSession().setValue(content);
    runit.addEventListener("click",()=>{
        console.log("this is a filePath "+filePath.toString());
        ipcRenderer.send("runcommand" , filePath.toString());
    });
});

editor.on("input" , ()=>{
    console.log("input detected ");
    ipcRenderer.send("update-file-content",editor.getSession().getValue());
});

ipcRenderer.on("outputcmd" ,(_ , data) =>{
    codeResult.innerText = data;
});


//another version to run command line 
// runit.addEventListener("click",()=>{
//     ipcRenderer.send("runcommand");
//     execute('gcc C:\\Users\\ILYES\\Desktop\\hello.c -o C:\\Users\\ILYES\\Desktop\\hello',(output)=>{
//         execute('C:\\Users\\ILYES\\Desktop\\hello.exe',(output)=>{
//             console.log("worked !!");
//             console.log(output);
//             codeResult.innerText = output.toString();
//         })
//     });
// });

// CodeTextArea.addEventListener("input" , () =>{
//     console.log("input detected ");
// });

//my version 
// function createNewFile(){
//     console.log("New FIle created ");
//     addNewExplorerTabInFC();

//     CodeArea(nbrfiletab);
// }




// var nbrfiletab =0 ;
// var nbropenedtabs =0 ;
// var nbruntitled =0 ; 

// var editorId;
// var codeStateId;

// //create new file shortcut 
// function createNewFile(){
//     console.log("New FIle created ");
//     addNewExplorerTabInFC();
//     CodeArea(nbrfiletab);
// }

// function addNewExplorerTabInFC(){
//     nbrfiletab++ ;
//     nbropenedtabs++;
//     nbruntitled++; 
//     var filenbr = "Untitled-"+nbruntitled;
//     $(".filescontainer").append(" <li> <span class='closeTAbicon'>x</span> <div class='fileNameSpan'>"+filenbr+"</div>") 
// }

// function CodeArea(tabnbr){

//     editorId = "codeslate_"+tabnbr;
//     codeStateId = "codestat_"+tabnbr;
//     var editorStyle = "postion : relative ;" +
//         "top: 0;right: 0;bottom: 90;left: 0;" +
//         "font-size:12pt; font-weight:normal; white-space:nowrap; display:none; z-index:999;"; 

//     var editorDesign = "<div class='codeslate' id='"+editorId+"' style='"+ editorStyle + "'></div>"

//     var codeStateContent = " <div class='codestate'><div class='currentlang'></div></div>" ;
//     editorDesign += codeStateContent ;

//     $(".editorcontainer").append(editorDesign);

//     console.log(tabnbr);

// }