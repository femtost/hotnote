// ADDITIONAL SCRIPT FOR MORE FUNCTIONALITIES
// Shorthands
var log = console.log;

// Prototype
Element.prototype.attr = function(key,value){
    if (value==null)
        return this.getAttribute(key);

    this.setAttribute(key,value);
};

// Prototype
Element.prototype.on = function(eventName,callback){
    this.addEventListener(eventName,callback);
};

// New lock
function newLock(){
    var unlock,lock=new Promise((res,rej)=>{ unlock=res; });
    return [lock,unlock];
}

// Select
function d$(sel){
    return document.querySelector(sel);
}

// Select many
function d$$(sel){
    return [...document.querySelectorAll(sel)];
}

// Fix list indent
// NOTE: ALREADY FIXED IN THE FORK @FEMTOST
function fixListIndents(){
    var eles = d$$(`#wysiwyg ul[data-md]`);

    for (let ele of eles){ // ul tag
        let md = ele.attr("data-md");
        let lines = md.split("\n");
        let indents = [];

        for (let line of lines){
            line = line.slice(2).trimRight();
            let nSpaces = line.length - line.trimLeft().length;
            let indent = nSpaces/4;
            indents.push(indent);
        }

        // Add margin left to li tags
        let liTags = [];

        for (let li of ele.children){
            if (li.tagName == "LI")
                liTags.push(li);
        }
        for (let i=0; i<indents.length; i++)
            liTags[i].style.marginLeft = `${indents[i]*2.5}em`;
    }
}

// Fix urls, eg. &amp;
function fixUrls(){
    var eles = d$$("#wysiwyg a");

    for (let a of eles){
        if (a.getAttribute("url-fixed")!=null) continue;

        if (a.href.includes("&amp;")){
            a.href = a.href.replaceAll("&amp;","&");
        }
        a.setAttribute("url-fixed","yes");
    }
}

// Always load preview
function alwaysLoadPreview(){
    var eles = d$$(".file-entry-row");

    for (let ele of eles){
        let eventAdded = ele.attr("tm-event-added");
        if (eventAdded!=null) continue;

        ele.on("click",event=>{
            setTimeout(()=>{
                d$("button#mode-wysiwyg").click();
                // setTimeout(fixListIndents,10); // Once
                setTimeout(fixUrls,10); // Once
            },200);
        });
        ele.attr("tm-event-added","yes");
    }
}

// Add events
function addEvents(){
    var ele = d$("#search-input");
    if (ele==null) return;
    if (ele.attr("tm-onclick-added") != null) return;

    ele.on("click",event=>{
        event.target.value = "\x20";
    });
    ele.attr("tm-onclick-added","yes"); // Once only
}

// Main
function additionalMain() {
    setInterval(alwaysLoadPreview,1000);
    // setInterval(fixListIndents,1000);
    setInterval(addEvents,1000);
    setInterval(fixUrls,1000);

    // Default UI
    var ival = setInterval(()=>{
        var testEle = d$("#split-pane-btn");
        if (testEle==null) return;

        // Activate default ui
        d$("#search-btn").click();
        d$("#split-pane-btn").click();
        d$("#search-content-toggle").click();

        setTimeout(()=>{
            d$("#sidebar").style.width = "25vw";
            d$("#pane2").style.minWidth = "25vw";
            d$("#pane2").style.maxWidth = "25vw";
        },10);
    },100);
}
window.addEventListener("load",additionalMain,{once:true});
// EOF
