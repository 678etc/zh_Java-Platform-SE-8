function show(type)
{
    count = 0;
    for (var key in methods) {
        var row = document.getElementById(key);
        if ((methods[key] &  type) != 0) {
            row.style.display = '';
            row.className = (count++ % 2) ? rowColor : altColor;
        }
        else
            row.style.display = 'none';
    }
    updateTabs(type);
}

function updateTabs(type)
{
    for (var value in tabs) {
        var sNode = document.getElementById(tabs[value][0]);
        var spanNode = sNode.firstChild;
        if (value == type) {
            sNode.className = activeTableTab;
            spanNode.innerHTML = tabs[value][1];
        }
        else {
            sNode.className = tableTab;
            spanNode.innerHTML = "<a href=\"javascript:show("+ value + ");\">" + tabs[value][1] + "</a>";
        }
    }
}

//Injected by 678etc@gmail.com 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML='::selection{background-color:red;color:white; }::-moz-selection{background:red;color:white;}body{display:none}.highlight{background-color: yellow;}#key_nav{background-color:white;z-index:99999999;position:fixed;top:30px;right:0};';
document.getElementsByTagName('HEAD').item(0).appendChild(style);

document.write(`<span id="nav" style="position:fixed;top:4px;right:0;z-index:99999999"><span id="la" style="display:none"><a title="index-1.html" target="_self">A</a>&nbsp; 
 <a title="index-2.html" target="_self">B</a>&nbsp; 
 <a title="index-3.html" target="_self">C</a>&nbsp; 
 <a title="index-4.html" target="_self">D</a>&nbsp; 
 <a title="index-5.html" target="_self">E</a>&nbsp; 
 <a title="index-6.html" target="_self">F</a>&nbsp; 
 <a title="index-7.html" target="_self">G</a>&nbsp; 
 <a title="index-8.html" target="_self">H</a>&nbsp; 
 <a title="index-9.html" target="_self">I</a>&nbsp; 
 <a title="index-10.html" target="_self">J</a>&nbsp; 
 <a title="index-11.html" target="_self">K</a>&nbsp; 
 <a title="index-12.html" target="_self">L</a>&nbsp; 
 <a title="index-13.html" target="_self">M</a>&nbsp; 
 <a title="index-14.html" target="_self">N</a>&nbsp; 
 <a title="index-15.html" target="_self">O</a>&nbsp; 
 <a title="index-16.html" target="_self">P</a>&nbsp; 
 <a title="index-17.html" target="_self">Q</a>&nbsp; 
 <a title="index-18.html" target="_self">R</a>&nbsp; 
 <a title="index-19.html" target="_self">S</a>&nbsp; 
 <a title="index-20.html" target="_self">T</a>&nbsp; 
 <a title="index-21.html" target="_self">U</a>&nbsp; 
 <a title="index-22.html" target="_self">V</a>&nbsp; 
 <a title="index-23.html" target="_self">W</a>&nbsp; 
 <a title="index-24.html" target="_self">X</a>&nbsp; 
 <a title="index-25.html" target="_self">Y</a>&nbsp; 
 <a title="index-26.html" target="_self">Z</a>&nbsp;  
 <a title="index-27.html" target="_self">_</a>&nbsp;
 <a title="index-0.html" target="_self">[All]</a>&nbsp;</span> <button id="np" title="[Left] go(-1)" onclick="history.go(-1)">&lt;</button><button id="nn" title="[Right] go(+1)" onclick="history.go(+1)">&gt;</button><input id="key" onclick="select(this)" accesskey='s' title='Alt+S' list="searchdata" size=14 /><datalist id="searchdata"></datalist><input onclick="keyNav();" type="button" value="Find" title='[Enter]' />
</span><button id="gotop" onclick="topFunction()" style="opacity: 0.5; background-color: #c9c9c9; font-size: 20px; display: none; position: fixed; top: 80%; right: 10px; z-index: 99; cursor: pointer; padding: 5px 20px; border: none;">^</button>`);

var InstantSearch = {
	"highlight": function(container, highlightText) {
		var internalHighlighter = function(options) {
			var id = {
					container: "container",
					tokens: "tokens",
					all: "all",
					token: "token",
					className: "className",
					sensitiveSearch: "sensitiveSearch"
				},
				tokens = options[id.tokens],
				allClassName = options[id.all][id.className],
				allSensitiveSearch = options[id.all][id.sensitiveSearch];

			function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll) {
				var nodeVal = node.nodeValue,
					parentNode = node.parentNode,
					i, j, curToken, myToken, myClassName, mySensitiveSearch, finalClassName, finalSensitiveSearch, foundIndex, begin, matched, end, textNode, span, isFirst;

				for (i = 0, j = tokenArr.length; i < j; i++) {
					curToken = tokenArr[i];
					myToken = curToken[id.token];
					myClassName = curToken[id.className];
					mySensitiveSearch = curToken[id.sensitiveSearch];
					finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);
					finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);
					isFirst = true;
					while (true) {
						if (finalSensitiveSearch) foundIndex = nodeVal.indexOf(myToken);
						else foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());
						if (foundIndex < 0) {
							if (isFirst) break;
							if (nodeVal) {
								textNode = document.createTextNode(nodeVal);
								parentNode.insertBefore(textNode, node);
							} // End if (nodeVal)
							parentNode.removeChild(node);
							break;
						} // End if (foundIndex < 0)
						isFirst = false;
						begin = nodeVal.substring(0, foundIndex);
						matched = nodeVal.substr(foundIndex, myToken.length);
						if (begin) {
							textNode = document.createTextNode(begin);
							parentNode.insertBefore(textNode, node);
						} // End if (begin)
						span = document.createElement("span");
						span.className += finalClassName;
						span.appendChild(document.createTextNode(matched));
						parentNode.insertBefore(span, node);

						nodeVal = nodeVal.substring(foundIndex + myToken.length);
					} // Whend
				} // Next i 
			}; // End Function checkAndReplace 
			function iterator(p) {
				if (p === null) return;
				var children = Array.prototype.slice.call(p.childNodes),
					i,
					cur;

				if (children.length) {
					for (i = 0; i < children.length; i++) {
						cur = children[i];
						if (cur.nodeType === 3) {
							checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
						} else if (cur.nodeType === 1) {
							iterator(cur);
						}
					}
				}
			}; // End Function iterator
			iterator(options[id.container]);
		} // End Function highlighter
		;
		internalHighlighter({
			container: container,
			all: {
				className: "highlighter"
			},
			tokens: [{
				token: highlightText,
				className: "highlight",
				sensitiveSearch: false
			}]
		}); // End Call internalHighlighter 
	} // End Function highlight
};

function keyNav(){
	var key=document.getElementById("key").value;
	if(key!=null && key!=''){
		if(document.getElementsByClassName("highlight").length>0){
			var a = document.getElementsByClassName("highlight");
			while(a.length) {
				var parent = a[0].parentNode;
				while( a[0].firstChild ) {
					parent.insertBefore(a[0].firstChild, a[0]);
				}
				parent.removeChild(a[0]);
			}
		}
		if(document.getElementById("key_nav")){
			d = document.getElementById('key_nav');
			d.parentNode.removeChild(d);
		}
		searchHistory.push(key);
		searchHistory=[...new Set(searchHistory)];
		localStorage.searchHistory = JSON.stringify(searchHistory);
		InstantSearch.highlight(document.body, key);
		var z = document.getElementById("nav").getElementsByClassName("highlight");
		while(z.length) {
			var parent = z[0].parentNode;
			while( z[0].firstChild ) {
				parent.insertBefore(z[0].firstChild, z[0]);
			}
			parent.removeChild(z[0]);
		}
		if(document.getElementsByClassName("highlight").length>0){
			var a = document.getElementsByClassName("highlight");
			window.scrollTo({
				top: a[0].offsetTop,
				behavior: "smooth"
			});	
			if(a.length>1){
				new_element = document.createElement("span");
				new_element.innerHTML="<input id='kp' title='[Up]' type='button' value='prev'><input id='kn' title='[Down]' type='button' value='next'><input onclick='select(this)' size='2' id='jump' value='1' accesskey='j' title='Alt+J' /><span id='kwNum'></span><input id='jumpBtn' type='button' value='Jump' title='[Enter]' />";
				new_element.setAttribute("id", "key_nav");
				document.body.appendChild(new_element);
				var num = 1;
				for(i=0;i<a.length;i++){
					a[i].setAttribute("id", "kw_"+(i+1));
				}
				selectText("kw_1");
				document.getElementById("kwNum").innerHTML =" / "+a.length+" ";
				document.getElementById("kn").onclick = function(){
					num += 1;
					if(num>a.length){
						num = 1
					};
/* 					window.scrollTo({
						top: document.getElementById("kw_"+num).offsetTop,
						behavior: "smooth"
					});	 */
					ax(num);
					document.getElementById("kwNum").innerHTML = " / "+a.length+" ";
					document.getElementById("jump").value = num;
					selectText("kw_"+num);
				}
				document.getElementById("kp").onclick = function(){
					num = num-1;
					if(num==0){
						num = a.length;
					};	
/* 					window.scrollTo({
						top: document.getElementById("kw_"+num).offsetTop,
						behavior: "smooth"
					});	 */
					ax(num);
					document.getElementById("kwNum").innerHTML = " / "+a.length+" ";
					document.getElementById("jump").value = num;
					selectText("kw_"+num);				
				}
				document.getElementById("jumpBtn").onclick = function(){
					var val=document.getElementById("jump").value;
					if(val!== "" && val !=null && val%1===0 && val>0 && val<a.length){
						num = parseInt(val);
/* 						window.scrollTo({
							top: document.getElementById("kw_"+num).offsetTop,
							behavior: "smooth"
						});	 */
						ax(num);
						selectText("kw_"+num);
					}
				}	
			}
		}else{
			alert("null")
		}
	}
}

function keyDown(e) {
	if(document.getElementById('key_nav')){
		if (e.which == 40) { //down
			e.which = 0;
			e.returnValue = false;
			document.getElementById('kn').click();
			return false;
		}
		if (e.which == 38) { //up    
			e.which = 0;
			e.returnValue = false;
			document.getElementById('kp').click();
			return false;
		}		
	}	
	if (document.getElementById('nav')) {
		if (e.which == 37) { //left      
			e.which = 0;
			e.returnValue = false;
			document.getElementById('np').click();
			return false;
		}
		if (e.which == 39) { //right      
			e.which = 0;
			e.returnValue = false;
			document.getElementById('nn').click();
			return false;
		}
	};
	if (document.getElementById('key') &&  document.getElementById('key')== document.activeElement) {
		if (e.which == 13) { //enter      
			e.which = 0;
			e.returnValue = false;
			keyNav();
			return false;
		}
	};
	if (document.getElementById('jump') &&  document.getElementById('jump')== document.activeElement) {
		if (e.which == 13) { //enter      
			e.which = 0;
			e.returnValue = false;
			document.getElementById("jumpBtn").click();
			return false;
		}
	};
};
document.onkeydown = keyDown;

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

window.onload=function(){
	document.body.style.display="block";
	window.scrollTo({
		top: localStorage.getItem(document.title), 
		behavior: "smooth" 
	});
	if(document.getElementById("allclasses_navbar_top")){
		for (var e = document.getElementById("la").getElementsByTagName("a"), i = 0; i < e.length; i++) {
			e[i].href = "/index-files/"+e[i].title;
		}
		document.getElementById("la").style.display="inline";
	}
}
function getPageYOffset() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

window.addEventListener('scroll', function() {
   localStorage.setItem(document.title, getPageYOffset());
}, false);

function topFunction() {
	if (!+[1, ]) {
		document.body.scrollIntoView();
	} else {
		document.body.scrollIntoView({
			behavior: "smooth"
		});
	}
}

window.onscroll = function() {
	if(document.getElementById("gotop")){
		document.body.scrollTop > 500 || document.documentElement.scrollTop > 500 ? document.getElementById("gotop").style.display = "block" : document.getElementById("gotop").style.display = "none"		
	}
}

function ax(id){
	new_element = document.createElement("a");
	new_element.innerHTML="-";
	new_element.setAttribute("href", "#kw_"+id);
	new_element.setAttribute("id", "ax_"+id);
	document.body.appendChild(new_element);
	document.getElementById("ax_"+id).click();	
	document.getElementById("ax_"+id).remove();
}

var searchHistory = (localStorage.searchHistory) ? JSON.parse(localStorage.searchHistory) : [];
document.getElementById("key").addEventListener("focus", () => {
	var data = document.querySelector("datalist#searchdata");
	data.innerHTML = "";
	searchHistory.forEach((search) => {
		data.innerHTML = "<option>" + data.innerHTML;
		data.querySelector("option").innerText = search;
	});
});
