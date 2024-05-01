var index;

function open_form(element, data, title, width, height) {
    if (title == null || title == '') {
        title = false;
    }
    if (width == null || width == '') {
        width = '100%';
    }
    if (height == null || height == '') {
        height = '100%';
    }

    index = layer.open({
        type: 1,
        title: title,
        area: [width, height],
        fix: false, //Not fixed
        maxmin: true,//Enable maximize and minimize buttons
        shadeClose: true,//Click on the shadow to close
        shade: 0.4,//background grayscale
        // skin: 'layui-layer-rim', //add border
        content: $(element),
        success: function () {
            $(element).setForm(data);
            layui.form.render();  // Drop-down box assignment
        },
        cancel: function (index, layero) {
            // if (confirm('Are you sure you want to close it?')) { //This layer will only close when you click OK in the confirm box.
            //   layer.close(index)
            // }
  
            $(element).hide();
            return true;
          }
    });
}

function checkForm(formId) {
    var form = document.getElementById(formId);
    var count = 0;
    for (var i = 0; i < form.elements.length - 1; i++) {
        if (!form.elements[i].value == "") {
            count++;
        }
    }
    return count;
}

function tableReload(tableId, where, contentType, url, method) {
    layui.table.reload(tableId, {
        where: where,
        contentType: contentType,
        page: {
            curr: 1 //Start over from page 1
        },
        url: url
        , method: method
    });
}

$.fn.setForm = function (jsonValue) {
    var obj = this;
    $.each(jsonValue, function (name, ival) {
        var $oinput = obj.find("input[name=" + name + "]");
        if ($oinput.attr("type") == "checkbox") {
            if (ival !== null) {
                var checkboxObj = $("[name=" + name + "]");
                var checkArray = ival.split(";");
                for (var i = 0; i < checkboxObj.length; i++) {
                    for (var j = 0; j < checkArray.length; j++) {
                        if (checkboxObj[i].value == checkArray[j]) {
                            checkboxObj[i].click();
                        }
                    }
                }
            }
        } else if ($oinput.attr("type") == "radio") {
            $oinput.each(function () {
                var radioObj = $("[name=" + name + "]");
                for (var i = 0; i < radioObj.length; i++) {
                    if (radioObj[i].value == ival) {
                        radioObj[i].click();
                    }
                }
            });
        } else if ($oinput.attr("type") == "textarea") {
            obj.find("[name=" + name + "]").html(ival);
        } else {
            obj.find("[name=" + name + "]").val(ival);
        }
    })
};


 