const max_res = document.getElementById("maximize") ;

var min = document.getElementById("minimize");
var max = document.getElementById("maximize");
var close = document.getElementById("close");

min.addEventListener("click",minimizeApp);
function minimizeApp(){
    ipcRenderer.send("minimize");
} 

max.addEventListener("click",function(){
    ipcRenderer.send("maximize");
});

close.addEventListener("click", ()=>{
    ipcRenderer.send("close");
});

function changeState(isMaximizedApp){
    if(isMaximizedApp){
        max_res.title= "Restore"
        max_res.innerText= "fullscreen_exit"
    }   
    else{
        max_res.title = 'maximize'
        max_res.innerText= "fullscreen"
    }
}

ipcRenderer.on('isMaximized',()=>{ changeState(true)});
ipcRenderer.on('isRestored',()=>{ changeState(false)})

