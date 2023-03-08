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

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML='::selection{background-color:red;color:white; }::-moz-selection{background:red;color:white;}body{display:none}.highlight{background-color: yellow;}#key_nav{background-color:white;z-index:99999999;position:fixed;top:30px;right:0};';
document.getElementsByTagName('HEAD').item(0).appendChild(style);

document.write(`<span id="nav" style="position:fixed;top:4px;right:0;z-index:99999999"><button id="np" title="[Left] go(-1)" onclick="history.go(-1)">&lt;</button><button id="nn" title="[Right] go(+1)" onclick="history.go(+1)">&gt;</button><input id="key" onclick="select(this)" accesskey='s' title='Alt+S' size=14 /><input onclick="keyNav();" type="button" value="Find" title='[Enter]' />
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
		InstantSearch.highlight(document.body, key);
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
					window.scrollTo({
						top: document.getElementById("kw_"+num).offsetTop,
						behavior: "smooth"
					});	
					document.getElementById("kwNum").innerHTML = " / "+a.length+" ";
					document.getElementById("jump").value = num;
					selectText("kw_"+num);
				}
				document.getElementById("kp").onclick = function(){
					num = num-1;
					if(num==0){
						num = a.length;
					};	
					window.scrollTo({
						top: document.getElementById("kw_"+num).offsetTop,
						behavior: "smooth"
					});
					document.getElementById("kwNum").innerHTML = " / "+a.length+" ";
					document.getElementById("jump").value = num;
					selectText("kw_"+num);				
				}
				document.getElementById("jumpBtn").onclick = function(){
					var val=document.getElementById("jump").value;
					if(val!== "" && val !=null && val%1===0 && val>0 && val<a.length){
						num = parseInt(val);
						window.scrollTo({
							top: document.getElementById("kw_"+num).offsetTop,
							behavior: "smooth"
						});
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