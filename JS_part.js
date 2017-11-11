function createElement(scrolldiv,info){
    var scdiv=document.createElement('div');
    var img=document.createElement('div');
    var title=document.createElement('div');
    var title_before=document.createElement('div');
    var h3=document.createElement('h3');
    var h6=document.createElement('h6');
    var descr=document.createElement('div');
    var inf=document.createElement('div');
    var a=document.createElement('a');
    a.href='https://www.youtube.com/watch?v='+info.id.videoId;
    createBlock(inf,'https://thumb.ibb.co/iE0kqm/work_img_1.png',info.snippet.channelTitle);
    createBlock(inf,'https://thumb.ibb.co/g4EdAm/work_img_2.png',info.snippet.publishedAt.substring(0,10));
    createBlock(inf,'https://thumb.ibb.co/bWp0O6/work_img_3.png',info.view);
    descr.classList.add('descr');
    title.classList.add('title_img');
    title_before.classList.add('title_before');
    img.classList.add('res_img');
    scdiv.classList.add('res');
    inf.classList.add('inf_div');
    scrolldiv.appendChild(scdiv);
    scdiv.appendChild(img);
    scdiv.appendChild(inf);
    scdiv.appendChild(descr);
    img.appendChild(title_before);
    img.appendChild(title);
    title.appendChild(h3);
    descr.appendChild(h6);
    h3.appendChild(a);
    a.innerHTML=info.snippet.title;
    h6.innerHTML=info.snippet.description;  
    scdiv.style.width=''+Math.round(scrolldiv.offsetHeight/16*9)+'px';
    img.style.backgroundImage='url('+info.snippet.thumbnails.high.url+')';
    title.onmousedown=function(event){return mouseDown_video_href(event,a.href);};
}

function createBlock(parent,img,text){
    var img_chanel=document.createElement('div');
    img_chanel.classList.add('block');
    var h4=document.createElement('h4');
    h4.innerHTML=text;
    img_chanel.appendChild(h4);
    img_chanel.style.backgroundImage='url('+img+')';
    parent.appendChild(img_chanel);
}


function mouseDown_video_href(e,a){
    location.href=a;
}

function chuncks(scrolldiv){
    return Math.min(Math.floor(scrolldiv.offsetWidth/(Math.round(scrolldiv.offsetHeight/16*9)+scrolldiv.offsetWidth*0.05)),4);
}


function resetmargin(scrolldiv){
    var sum=0;
    for(var i=0;i<scrolldiv.childNodes.length;++i){
        sum+=scrolldiv.childNodes[i].offsetWidth;
    }
    sum=scrolldiv.offsetWidth-sum;
    for(var i=0;i<scrolldiv.childNodes.length;++i){
        scrolldiv.childNodes[i].style.marginLeft=''+Math.floor(sum/(scrolldiv.childNodes.length+1))+'px';
    }
}
//Extends clipsPlace
function searchKeyPress(e)
  {
      if (e.keyCode == 13)
      {
          var request=gapi.client.youtube.search.list({
                part:'snippet',
                type:'video',
                q:search.value,
                maxResults:15,
          });
          request.execute(function(responce){
              global_res=responce;
              global_res.searchValue=search.value;
              var temp='';
              global_res.items.forEach(function(element) {
                  temp+=element.id.videoId+',';
              }, this);
              var request_stat=gapi.client.youtube.videos.list({
                        id:temp,
                        part:'statistics',
               });
            request_stat.execute((responce_stat)=>{
                for(var i=0;i<responce_stat.items.length;++i){
                    global_res.items[i].view=responce_stat.items[i].statistics.viewCount;
                    global_res.items[i].num=i;
                };
                update_e(scrolldiv,0);
           },this);
          },this);
          return false;
      }
      return true;
}

function newResponce(){
    var request=gapi.client.youtube.search.list({
        part:'snippet',
        type:'video',
        q:global_res.searchValue,
        pageToken:global_res.nextPageToken,
        maxResults:15,
    });
    request.execute((responce)=>{
        var temp='';
        responce.items.forEach(function(element) {
            temp+=element.id.videoId+',';
        }, this);
        var request_stat=gapi.client.youtube.videos.list({
                  id:temp,
                  part:'statistics',
         });
         request_stat.execute((responce_stat)=>{
            for(var i=0;i<responce_stat.items.length;++i){
                responce.items[i].view=responce_stat.items[i].statistics.viewCount;
                responce.items[i].num=i+global_res.items.length;
                global_res.items.push(responce.items[i]);
            };
            global_res.nextPageToken=responce.nextPageToken;
            update_e(scrolldiv,global_res.items.length-responce.items.length-scroll_place.childNodes[0].childNodes.length);
        });
   });    
}

function clear(scrolldiv){
    var n=scrolldiv.childNodes.length;
    for(var i=0;i<n;++i){
        scrolldiv.removeChild(scrolldiv.childNodes[0]);
    }
}

function checkWidth(clipsPlace){
    var size=Math.floor(clipsPlace.offsetWidth/clipsPlace.childNodes.length);
    clipsPlace.style.width=clipsPlace.childNodes.length*33+'px';
    // clipsPlace.childNodes.forEach((element)=>{
    //     element.style.width=Math.min(size,30)+'px';
    //     element.style.height=Math.min(size,30)+'px';
    // });
}


function update_e(scrolldiv,beg){
    if(typeof global_res.items === undefined)
        return;
    clear(scrolldiv);
    var count=Math.ceil(global_res.items.length/chuncks(scrolldiv));
    clear(clipsPlace);
    for(let j=0;j<count;++j){
        addClip(j);
    };
    var pag=Math.ceil((beg+1)/chuncks(scrolldiv));
    if(pag>count){
        newResponce();
        return;       
    }
    clipsPlace.childNodes[pag-1].classList.add('activeClip');
    currentClip=pag-1;
    var num=document.createElement('h2');
    num.innerHTML=pag;
    clipsPlace.childNodes[pag-1].appendChild(num);
    checkWidth(clipsPlace);
    arrRes=[];
    for(var i=beg;i<beg+chuncks(scrolldiv);++i){
        if(i>=global_res.items.length){
            newResponce();
            return;
        }
        arrRes.push(i);
        createElement(scrolldiv,global_res.items[i]);
    }
    console.log(beg);
    resetmargin(clipsPlace);
    resetmargin(scrolldiv);
}

function request(){
    var e={};
    e.keyCode=13;
    searchKeyPress(e);
}

function init(){
   gapi.client.setApiKey("AIzaSyDe8vBPB4dB74mit313cCfIYkcIgMacc98");
   gapi.client.load("youtube","v3",function(){});
}

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
}

function mouseDown(evt) {                                         
    xDown = evt.clientX;
    margL=0;                                       
}

function mouseMove(evt){
    if(xDown===null)
        return;
    let cur=evt.clientX-xDown;
    scroll_place.childNodes[0].style.left=''+(cur+margL)+'px';
}

function mouseUp(evt) {
    let cur=evt.clientX-xDown;
    if((cur>scroll_place.childNodes[0].offsetWidth/3) &&(arrRes[0]-scroll_place.childNodes[0].childNodes.length>=0)){
        scrollRight();
    };
    if(cur<-1*scroll_place.childNodes[0].offsetWidth/3){
        scrollLeft();
    };
    animation(scroll_place.childNodes[0],0,Math.min(1000,Math.abs(parseInt(scroll_place.childNodes[0].offsetLeft))));//scroll_place.childNodes[0].style.left='0px';    
    xDown = null;                                                       
}

function scrollRight(){
    animation(scroll_place.childNodes[0],parseInt(scroll_place.offsetWidth),1000);
    createPage(arrRes[0]-scroll_place.childNodes[0].childNodes.length);
    scroll_place.childNodes[0].style.left='-'+`${scroll_place.childNodes[0].offsetWidth}`+'px';
    setTimeout(del,1000);
    animation(scroll_place.childNodes[0],0,Math.min(1000,Math.abs(parseInt(scroll_place.childNodes[0].offsetLeft))));//scroll_place.childNodes[0].style.left='0px';
    scrolldiv=scroll_place.childNodes[0];
    animation(scroll_place.childNodes[0],0,Math.min(1000,Math.abs(parseInt(scroll_place.childNodes[0].offsetLeft))))
}

function scrollLeft(){
    animation(scroll_place.childNodes[0],-1*parseInt(scroll_place.offsetWidth),1000);
    createPage(arrRes[arrRes.length-1]+1);
    scroll_place.childNodes[0].style.left=`${scroll_place.childNodes[0].offsetWidth}`+'px';
    setTimeout(del,1000);
    animation(scroll_place.childNodes[0],0,Math.min(1000,Math.abs(parseInt(scroll_place.childNodes[0].offsetLeft)-0)));//scroll_place.childNodes[0].style.left='0px';
    scrolldiv=scroll_place.childNodes[0];
    animation(scroll_place.childNodes[0],0,Math.min(1000,Math.abs(parseInt(scroll_place.childNodes[0].offsetLeft))))
}


function del(){
    scroll_place.removeChild(scroll_place.childNodes[1]);
}

function addClip(num){
    var clip=document.createElement('div');
    clip.classList.add('clip');
    clipsPlace.appendChild(clip);
    clip.onmousedown=function(event){return pageRelocation(event,num);};
    resetmargin(clipsPlace);  
}

function pageRelocation(e,num){
    var dif=num-currentClip;
    if(dif>0){
        for(let j=0;j<dif;++j){
            scrollLeft();
        }
        return;
    }
    if(dif<0){
        for(let j=0;j<Math.abs(dif);++j){
            scrollRight();
        }
        return;
    }
    return;
}


function createPage(num){
    var scrolldiv1=document.createElement('div');
    scrolldiv1.classList.add('scroll-panel');
    scroll_place.insertBefore(scrolldiv1,scroll_place.childNodes[0]);
    update_e(scrolldiv1,num);
}

function animation(obj,endX,dur){
    let current=parseInt(obj.offsetLeft);
    const framesCount=dur/1000*60;
    const dx=(endX-current)/framesCount;
    if(current<endX){
    const frame=()=>{
        current+=dx;
        //obj.style.transform=`translateX(${current}px)`;
        obj.style.left=`${current}px`;
        if(current<endX){
            requestAnimationFrame(frame);
        }
    };
    frame();
    }
    else{
        const frame=()=>{
            current+=dx;
            obj.style.left=`${current}px`;
            if(current>endX){
                requestAnimationFrame(frame);
            }
        };
        frame();        
    }
}

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
       if ( xDiff > 50 ) {
            console.log(' left swipe' );
        } else {
            if(xDiff<-50){
                console.log(' right swipe' );
            }
            
        }                       
    xDown = null;
    yDown = null;                                             
};

var arrRes=[];
var search = document.createElement('input');
var sbutton=document.createElement('div');
var scroll_place=document.createElement('div');
var global_res={};
var scrolldiv=document.createElement('div');
var xDown = null;
var margL=null;                                                       
var div =document.createElement('div');
var clipsPlace=document.createElement('div');
var currentClip=null;
clipsPlace.id='clipsPlace';
scrolldiv.classList.add('scroll-panel');
scroll_place.id='scroll-place';
document.body.appendChild(clipsPlace);
document.body.appendChild(scroll_place);
scroll_place.appendChild(scrolldiv);
sbutton.addEventListener('click',request);
sbutton.id='btn_s';
div.id='searchDiv';
search.type='search';
div.appendChild(search);
div.appendChild(sbutton);
document.body.appendChild(div);
search.onkeydown=function(event){return searchKeyPress(event);};
search.value='Eminem';
document.body.addEventListener('touchstart', handleTouchStart, false);        //???
document.body.addEventListener('touchmove', handleTouchMove, false);        //???
// scrolldiv.addEventListener('mousedown',function(event){return mouseDown(event);});
// scrolldiv.addEventListener('mousemove',function(event){return mouseMove(event);});
// scrolldiv.addEventListener('mouseup',function(event){return mouseUp(event);});
scroll_place.onmousedown=function(event){return mouseDown(event);};
scroll_place.onmousemove=function(event){return mouseMove(event);};
scroll_place.onmouseup=function(event){return mouseUp(event);};
