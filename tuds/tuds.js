function Tuds(){
this.mouseover=function(ev) {
        ev.stopPropagation();
        var e = $(ev.target);
        if (typeof e.css("outline") != "undefined") {
            e.data("saved", {"outline" : e.css("outline")});
            e.css("outline", "red solid medium");
        } else {
            e.data("saved", {"backgroundColor" : e.css("backgroundColor")});
            e.css("backgroundColor", "#0cf");
        }
    };
this.mouseout=function(ev) {
        ev.stopPropagation();
        var e = $(ev.target);
        save = e.data("saved");
        if (typeof(save) == "undefined") { return; }
        e.removeData("saved");
        for (var i in save) {
            e.css(i, save[i]);
        }
    };
this.click=function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var e = $(ev.target);
        var xpath = this.getXpath(ev.target);
        console.log("click: "+xpath);
        if (typeof(this.doneURL) != "undefined") {
            if (this.doneURL.indexOf("?") == -1) { this.doneURL += "?"; }
            else { this.doneURL += "&"; }
            var params = {
                "xpath" : xpath,
                "referer" : window.location.href
            };
            if (typeof this.params != "undefined") { params['params'] = this.params; }

            var url = $.param(params);
            url = this.doneURL + url;
            console.log(url);
            window.location = url;
            return false;
        }

        var node = $("#hover");
        if (node.size() === 0)  {
            $(document.body).append("<div id='hover'></div>");
            node = $("#hover");
            node
            .css("position", "absolute")
            .css("display", "inline")
            .css('border', '1px solid black')
            .css('backgroundColor', 'white')
            .css('padding', '2px')
            .css('width', 'auto')
            .css("zIndex", 255)
            .click(function(ev) { ev.stopPropagation(); });
        }

        node.html(xpath);
        node.animate({
            'top' : (e.offset().top) + "px",
            'left': (e.offset().left) + "px"
        }, 250);
    };
this.start=function(){
    var self = this;
            $("*").each(function() {
            $(this)
            .mouseover(self.mouseover)
            .mouseout(self.mouseout)
            .click(function(ev) {
                self.click.call(self, ev);
            });
        });
    };
this.stop=function(){
    var self = this;
          $("*").each(function(i) {
                $(this)
                .mouseout()
                .unbind("mouseover", self.mouseover)
                .unbind("mouseout", self.mouseout)
                .unbind("click")
                .mouseout();
            });
            $("#hover").remove();
    };
this.getXpath=function (e) {
        var xpath = "";
        var oldE = e;
        while (e.nodeName.toLowerCase() != "html") {
            var node = e.nodeName;
             node = node.toLowerCase();
            var id = e.id;
            if (id !== undefined && id !== null && id !== "") {
                xpath = "//" + node + "[@id='" + id + "']" + xpath;
                break;
            }
            var parent = e.parentNode;
            var children = $(parent).children(node);
            if (children.size() > 1) {
                var good = false;
                children.each(function(i) {
                    if (this == e) {
                        node = node + "[" + (i+1) + "]";
                        good = true;
                        return false;
                    }
                });
                if (!good) {
                    console.log("Can't find child, something is wrong with your dom : " + node);
                    return FALSE;
                }
            }
            xpath = "/" + node + xpath;
            e = parent;
        }
        if (xpath.substring(0, 2) != "//") { xpath = "/html" + xpath; }
        return xpath;
    }
};
var t= new Tuds();
/**
t.start();
$('#aaa')[0].onclick = function(event){
        t.stop();
}
$('#bbb')[0].onclick = function(event){
        t.start();
}
**/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {    
    if (request.greeting == "start"){
	   console.log('startstartstart');
          t.start();
	  }else{
	  console.log('stopstop');
	  t.stop();
	  }
  });
  
