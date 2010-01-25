//nasty browser detection
var detect = navigator.userAgent.toLowerCase();
var isIE = detect.indexOf('msie') + 1;
var isSaf = (detect.indexOf('applewebkit') > 0);

Array.prototype.inArray = function (value)
// Returns true if the passed value is found in the
// array.  Returns false if it is not.
{
	var i;
	for (i=0; i < this.length; i++) {
		// Matches identical (===), not just similar (==).
		if (this[i] === value) {
			return true;
		}
	}
	return false;
};


/*    Caret Functions     */
function getCaretEnd(obj){
    if(typeof obj.selectionEnd != "undefined"){
        return obj.selectionEnd;
    }else if(document.selection&&document.selection.createRange){
        var M=document.selection.createRange();
        var Lp=obj.createTextRange();
        Lp.setEndPoint("EndToEnd",M);
        var rb=Lp.text.length;
        if(rb>obj.value.length){
            return -1;
        }
        return rb;
    } else {
        return obj.value.length;
    }
}
function getCaretStart(obj){
    if(typeof obj.selectionStart != "undefined"){
        return obj.selectionStart;
    }else if(document.selection&&document.selection.createRange){
        var M=document.selection.createRange();
        var Lp=obj.createTextRange();
        Lp.setEndPoint("EndToStart",M);
        var rb=Lp.text.length;
        if(rb>obj.value.length){
            return -1;
        }
        return rb;
    } else {
        return 0;
    }
}
function setCaret(obj,l){
    obj.focus();
    if (obj.setSelectionRange){
        obj.setSelectionRange(l,l);
    }else if(obj.createTextRange){
        m = obj.createTextRange();		
        m.moveStart('character',l);
        m.collapse();
        m.select();
    }
}
/* ----------------- */

/*    Escape function   */
String.prototype.addslashes = function(){
    return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
}
String.prototype.trim = function () {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
}; 


function actb(obj,evt,ca, time_out, limit, first_text, expand_onfocus,multi_select){
    /* ---- Variables ---- */
    var actb_timeOut = time_out; // Autocomplete Timeout in ms (-1: autocomplete never time out)
    var actb_lim = limit;    // Number of elements autocomplete can show (-1: no limit)
    var actb_firstText = first_text; // should the auto complete be limited to the beginning of keyword?
    var actb_mouse = true; // Enable Mouse Support
	if (multi_select) {
		var actb_delimiter = new Array(';',',');  // Delimiter for multiple autocomplete. Set it to empty array for single autocomplete
	} else {
		var actb_delimiter = new Array(); 
	}
    var actb_expand_onfocus = expand_onfocus;
    /* ---- Variables ---- */

    /* --- Styles --- */
    var actb_bgColor = '#888888';
    var actb_textColor = '#FFFFFF';
    var actb_hColor = '#000000';
    var actb_fFamily = 'Verdana';
    var actb_fSize = '11px';
    var actb_hStyle = 'color:blue;text-decoration:underline;font-weight="bold"';
    /* --- Styles --- */

    /* ---- Don't touch :P---- */
    var actb_delimwords = new Array();
    var actb_cdelimword = 0;
    var actb_delimchar = new Array();
    var actb_keywords = new Array();
    var actb_display = false;
    var actb_pos = 0;
    var actb_total = 0;
    var actb_curr = null;
    var actb_rangeu = 0;
    var actb_ranged = 0;
    var actb_bool = new Array();
    var actb_pre = 0;
    var actb_toid;
    var actb_tomake = false;
    var actb_getpre = "";
    var actb_mouse_on_list = true;
    var actb_kwcount = 0;
    var actb_caretmove = false;

    
    /* ---- "Constants" ---- */

    actb_keywords = ca;
    actb_curr = obj;
    
    var oldkeydownhandler = document.onkeydown;
    var oldblurhandler = obj.onblur;
    var oldkeypresshandler = obj.onkeypress;
    var oldkeyuphandler = obj.onkeyup;

    if (isIE) {
        obj.onkeydown = actb_checkkey;
    } else {
		if (isSaf) {
				obj.onkeydown = actb_checkkey;
		}	else {
			obj.onkeypress = actb_checkkey;
		}
    }
	//document.onkeydown = actb_checkkey;
    obj.onblur = actb_clear;
    obj.onkeyup = actb_keypress;
	//obj.onkeypress = actb_keypress;
    if (!obj.value && !document.getElementById('tat_div') && actb_expand_onfocus) setTimeout(function(){actb_tocomplete(188)},150);

    function actb_clear(evt){
        if (!evt) evt = event;
        document.onkeydown = oldkeydownhandler;
        actb_curr.onblur = oldblurhandler;
        actb_curr.onkeypress = oldkeypresshandler;
        actb_removedisp();
    }
    function actb_parse(n){
        if (actb_delimiter.length > 0){
            var t = actb_delimwords[actb_cdelimword].trim().addslashes();
            var plen = actb_delimwords[actb_cdelimword].trim().length;
        }else{
            var t = actb_curr.value.addslashes();
            var plen = actb_curr.value.length;
        }
        var tobuild = '';
        var i;

        if (actb_firstText){
            var re = new RegExp("^" + t, "i");
        }else{
            var re = new RegExp(t, "i");
        }
        var p = n.search(re);
                
        for (i=0;i<p;i++){
            tobuild += n.substr(i,1);
        }
        tobuild += "<span class='actb_regex_match'>";
        for (i=p;i<plen+p;i++){
            tobuild += n.substr(i,1);
        }
        tobuild += "</span>";
        for (i=plen+p;i<n.length;i++){
            tobuild += n.substr(i,1);
        }
        return tobuild;
    }
    function curTop(){
        actb_toreturn = 0;
        obj = actb_curr;
        while(obj){
            actb_toreturn += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return actb_toreturn;
    }
    function curLeft(){
        actb_toreturn = 0;
        obj = actb_curr;
        while(obj){
            actb_toreturn += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        return actb_toreturn;
    }
    
    function determineWidth(){
       var max=0;
       for (i=0;i<actb_keywords.length;i++){
          lenkw=actb_keywords[i].length;
          if (lenkw>max)
          { max = lenkw }
       }
       max++;
       return max.toString()+'em';
    }

    var debugShown=false;
    
    function actb_generate(){
        if (!debugShown){
           debug1 = document.createElement('div');
           debug1.style.position='absolute';
           debug1.style.backgroundColor='#FF0000';
           debug1.style.color='white';
           debug1.style.left=0;
           debug1.style.top=0;
           debug1.style.width=140;
           //debug1.style.height='3em;'
           debug1.id='debug';
           debugShown=true;
           document.body.appendChild(debug1);
        }
        
        if (document.getElementById('tat_div')){ 
            div = document.getElementById('tat_div');
            while (div.firstChild)
                div.removeChild(div.firstChild);
        } else {
            div = document.createElement('div');
            div.className = 'actb_div';
            div.style.top = eval(curTop() + actb_curr.offsetHeight) + "px";
            div.style.left = curLeft() + "px";
            div.style.width=determineWidth();
            div.id = 'tat_div';
            actb_display=true;
            if (actb_mouse){
                div.onmouseout= actb_table_unfocus;
                div.onmouseover=actb_table_focus;
            }        
            document.body.appendChild(div);        
        }

        if (actb_kwcount == 0){
            actb_removedisp();
            return;
        }
        
        var keyIndex;
        var first = true;
        var keyCounter = 1;
        var counter = 0;
        for (keyIndex=0;keyIndex<actb_keywords.length;keyIndex++){
            if (actb_bool[keyIndex]){
                counter++;
                newDivRow = document.createElement('div');
                div.appendChild(newDivRow);
                newDivRow.id = 'tat_div' + (keyCounter);
                newDivRow.className='actb_divRow';
                newDivRow.innerHTML = actb_parse(actb_keywords[keyIndex]);
                newDivRow.setAttribute('pos',keyCounter);
                if (first) {
                    newDivRow.className = 'actb_divRow_active';
                    first = false;
                    actb_pos = counter;
                }else{
                    newDivRow.className='actb_divRow';
                }
                
                if (actb_mouse){
                    newDivRow.onclick=actb_mouseclick;
                    newDivRow.onmouseover = actb_divRow_highlight;
                }
                keyCounter++;
            }
        }
        actb_display = true;
        if (actb_pos <= 0) actb_pos = 1;
    }
    
    function actb_goup(){
        if (!actb_display) return;
        if (actb_pos == 1) return;
        
        // de-activate current activated item
        document.getElementById('tat_div'+actb_pos).className = 'actb_divRow';
        // activate previous item
        actb_pos--;
        activeRow = document.getElementById('tat_div'+actb_pos)
        activeRow.className = 'actb_divRow_active';

        // check if this item is still visible
        div = document.getElementById('tat_div');
        scrollTop = div.scrollTop;
        divHeight = div.offsetHeight;

        if (activeRow.offsetTop < scrollTop) {
            div.scrollTop = activeRow.offsetTop
        }

        if (actb_toid) clearTimeout(actb_toid);
        if (actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_timeOut);
    }
    function actb_godown(){
        if (!actb_display) return;
        if (actb_pos == actb_total) return;

        // de-activate current activated item
        document.getElementById('tat_div'+actb_pos).className = 'actb_divRow';
        
        // activate next item
        actb_pos++;
        activeRow = document.getElementById('tat_div'+actb_pos)
        activeRow.className = 'actb_divRow_active';
        
        // check if this item is still visible
        div = document.getElementById('tat_div');
        scrollTop = div.scrollTop;
        divHeight = div.offsetHeight;
        
        if (activeRow.offsetTop + activeRow.offsetHeight > scrollTop+divHeight) {
            // scroll div to the active row
            diff = activeRow.offsetTop - divHeight + activeRow.offsetHeight+4;
            div.scrollTop = diff;
        }
        
        if (actb_toid) clearTimeout(actb_toid);
        if (actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_timeOut);
    }

    function actb_mouseclick(evt){
        if (!evt) evt = event;
        if (!actb_display) return;
        actb_mouse_on_list = 0;
        actb_pos = this.getAttribute('pos');
        actb_penter();
    }
    function actb_table_focus(){
        actb_mouse_on_list = 1;
    }
    function actb_table_unfocus(){
        actb_mouse_on_list = 0;
        if (actb_toid) clearTimeout(actb_toid);
        if (actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list = 0;actb_removedisp();},actb_timeOut);
    }

    function actb_divRow_highlight(){
        actb_mouse_on_list = 1;
        document.getElementById('tat_div'+actb_pos).className = 'actb_divRow';
        actb_pos = this.getAttribute('pos');
        document.getElementById('tat_div'+actb_pos).className = 'actb_divRow_active';
        
        if (actb_toid) clearTimeout(actb_toid);
        if (actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list = 0;actb_removedisp();},actb_timeOut);
    }
    
    /* ---- */

    function actb_insertword(a){
        if (actb_delimiter.length > 0){
            str = '';
            l=0;
            for (i=0;i<actb_delimwords.length;i++){
                if (actb_cdelimword == i){
                    str += a;
                    l = str.length;
                }else{
                    str += actb_delimwords[i];
                }
                if (i != actb_delimwords.length - 1){
                    str += actb_delimchar[i];
                }
            }
            actb_curr.value = str;
            setCaret(actb_curr,l);
        }else{
            actb_curr.value = a;
        }
        actb_mouse_on_list = 0;
        actb_removedisp();
    }
    function actb_penter(){
        if (!actb_display) return;
        actb_display = false;
        var word = '';
        var c = 0;
        for (var i=0;i<=actb_keywords.length;i++){
            if (actb_bool[i]) c++;
            if (c == actb_pos){
                appendix = '';
                if (arguments.length>0) appendix = arguments[0];
                word = actb_keywords[i] + appendix;
                break;
            }
        }
        actb_insertword(word);
    }
    function actb_removedisp(){
        if (!actb_mouse_on_list){
            actb_display = false;
            if (document.getElementById('tat_div')){ 
                document.body.removeChild(document.getElementById('tat_div')); 
            }
            if (actb_toid) clearTimeout(actb_toid);
        }
    }
    function actb_keypress(){
	    //debug1.innerHTML = debug1.innerHTML + '<br />actb_keypress';
        return !actb_caretmove;
    }
    function actb_checkkey(evt){
	    //debug1.innerHTML = debug1.innerHTML + '<br />actb_keydown';
        if (!evt) evt = event;
        a = evt.keyCode;
        //debug1.innerHTML = debug1.innerHTML + '<br />keyCode=' + evt.keyCode+' , charCode='+evt.charCode;
        caret_pos_start = getCaretStart(actb_curr);
        actb_caretmove = 0;

		
        charCode = evt.charCode;

		if (!charCode) charCode = evt.keyCode;
		
        if (charCode!=0 && actb_display) {
		        character = String.fromCharCode(charCode);
				if (actb_delimiter.inArray(character)) {
					actb_penter(character);
					actb_caretmove = 1;
                    actb_expand_onfocus && setTimeout(function(){actb_tocomplete(188)},50);
					return false;
				}
        }
        
        switch (a){
            case 27:  // esc to show the menu
                if (!actb_display) {
                    setTimeout(function(){actb_tocomplete(a)},50);
                } else {
                    actb_removedisp();
                }
                break
            case 38:
                actb_goup();
                actb_caretmove = 1;
                return false;
                break;
            case 40: //show menu if not already open
                if (!actb_display) {
                    setTimeout(function(){actb_tocomplete(27)},50);
                } else {
                    actb_godown();
                    actb_caretmove = 1;
                    return false;
                }
                break;
            case 13:
                actb_penter();
                actb_caretmove = 1;
                return false;
                break;
            case 39: //complete on right arrow
                if (actb_display) {
                    actb_penter();
                    actb_caretmove = 1;
                    return false;
                }
                break;
            case 9:
                if (actb_display) {
                    actb_penter();
                    actb_caretmove = 1;
                    return true;
                }
                break;
            default:
                setTimeout(function(){actb_tocomplete(a)},50);
                break;
        }
    }

    function actb_tocomplete(kc){
        if (kc == 38 || kc == 40 || kc == 13 || kc == 39) return;
        var i;
        if (actb_display){ 
            var word = 0;
            var c = 0;
            for (var i=0;i<=actb_keywords.length;i++){
                if (actb_bool[i]) c++;
                if (c == actb_pos){
                    word = i;
                    break;
                }
            }
            actb_pre = word;
        }else{ actb_pre = -1};
        
        actb_mouse_on_list = 0;

        if (actb_delimiter.length > 0){
            caret_pos_start = getCaretStart(actb_curr);
            caret_pos_end = getCaretEnd(actb_curr);
            
            delim_split = '';
            for (i=0;i<actb_delimiter.length;i++){
                delim_split += actb_delimiter[i];
            }
            delim_split = delim_split.addslashes();
            delim_split_rx = new RegExp("(["+delim_split+"])");
            c = 0;
            actb_delimwords = new Array();
            actb_delimwords[0] = '';
            for (i=0,j=actb_curr.value.length;i<actb_curr.value.length;i++,j--){
                if (actb_curr.value.substr(i,j).search(delim_split_rx) == 0){
                    ma = actb_curr.value.substr(i,j).match(delim_split_rx);
                    actb_delimchar[c] = ma[1];
                    c++;
                    actb_delimwords[c] = '';
                }else{
                    actb_delimwords[c] += actb_curr.value.charAt(i);
                }
            }

            var l = 0;
            actb_cdelimword = -1;
            for (i=0;i<actb_delimwords.length;i++){
                if (caret_pos_end >= l && caret_pos_end <= l + actb_delimwords[i].length){
                    actb_cdelimword = i;
                }
                l+=actb_delimwords[i].length + 1;
            }
            var t = actb_delimwords[actb_cdelimword].addslashes().trim();
        }else{
            var t = actb_curr.value.addslashes();
        }
        if (actb_firstText){
            var re = new RegExp("^" + t, "i");
        }else{
            var re = new RegExp(t, "i");
        }
        
        actb_total = 0;
        actb_tomake = false;
        actb_kwcount = 0;
        for (i=0;i<actb_keywords.length;i++){
            actb_bool[i] = false;
            if (re.test(actb_keywords[i])){
                actb_total++;
                actb_bool[i] = true;
                actb_kwcount++;
                if (actb_pre == i) actb_tomake = true;
            }
        }
        if (actb_toid) clearTimeout(actb_toid);
        if (actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list = 0;actb_removedisp();},actb_timeOut);
        actb_generate();
    }
}