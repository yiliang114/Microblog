//好友列表数据
var friendsList = ['中国', '日本', '韩国', '朝鲜', '蒙古'];

//表情数据
var userFaces = { '0.gif': '微笑', '1.gif': '撇嘴', '2.gif': '色', '3.gif': '发呆', '4.gif': '得意', '5.gif': '流泪', '6.gif': '害羞', '7.gif': '闭嘴', '8.gif': '睡', '9.gif': '大哭', '10.gif': '尴尬', '11.gif': '发怒', '12.gif': '调皮', '13.gif': '呲牙', '14.gif': '惊讶', '15.gif': '难过', '16.gif': '酷', '17.gif': '冷汗', '18.gif': '抓狂', '19.gif': '吐', '20.gif': '偷笑', '21.gif': '可爱', '22.gif': '白眼', '23.gif': '傲慢', '24.gif': '饥饿', '25.gif': '困', '26.gif': '惊恐', '27.gif': '流汗', '28.gif': '憨笑', '29.gif': '大兵', '30.gif': '奋斗', '31.gif': '咒骂', '32.gif': '疑问', '33.gif': '嘘', '34.gif': '晕', '35.gif': '折磨', '36.gif': '衰', '37.gif': '骷髅', '38.gif': '敲打', '39.gif': '再见', '40.gif': '擦汗', '41.gif': '抠鼻', '42.gif': '鼓掌', '43.gif': '糗大了', '44.gif': '坏笑', '45.gif': '左哼哼', '46.gif': '右哼哼', '47.gif': '哈欠', '48.gif': '鄙视', '49.gif': '委屈', '50.gif': '快哭了', '51.gif': '阴险', '52.gif': '亲亲', '53.gif': '吓', '54.gif': '可怜', '55.gif': '菜刀', '56.gif': '西瓜', '57.gif': '啤酒', '58.gif': '篮球 ', '59.gif': '乒乓', '60.gif': '咖啡', '61.gif': '饭', '62.gif': '猪头', '63.gif': '玫瑰', '64.gif': '凋谢', '65.gif': '示爱', '66.gif': '爱心', '67.gif': '心碎', '68.gif': '蛋糕', '69.gif': '闪电', '70.gif': '炸弹', '71.gif': '刀', '72.gif': '足球', '73.gif': '瓢虫', '74.gif': '便便', '75.gif': '月亮', '76.gif': '太阳', '77.gif': '礼物', '78.gif': '拥抱', '79.gif': '强', '80.gif': '弱', '81.gif': '握手', '82.gif': '胜利', '83.gif': '抱拳', '84.gif': '勾引', '85.gif': '拳头', '86.gif': '差劲', '87.gif': '爱你', '88.gif': 'NO', '89.gif': 'OK', '90.gif': '爱情', '91.gif': '飞吻', '92.gif': '跳跳', '93.gif': '发抖', '94.gif': '怄火', '95.gif': '转圈', '96.gif': '磕头', '97.gif': '回头', '98.gif': '跳绳', '99.gif': '挥手', '100.gif': '激动', '101.gif': '街舞', '102.gif': '献吻', '103.gif': '左太极', '104.gif': '右太极', '105.gif': '淡定', '106.gif': '晕', '107.gif': '不满', '108.gif': '睡觉', '109.gif': '小调皮', '110.gif': '咒骂', '111.gif': '发怒', '112.gif': '偷笑', '113.gif': '微笑', '114.gif': '震惊', '115.gif': '囧' };


//页面加载完成之后执行
//$(window).ready(function () {
//    //鼠标移动上来改变 背景图片
//    bindSendBtnHover();

//    //插入话题
//    bindInsertTopic();

//    //at some on
//    bindAtSomeClick();
//});

window.onload = function() {
    bindSendBtnHover(); //动态算位置的话最好用windowsonload事件。

    //插入话题
    bindInsertTopic();

    //at some on
    bindAtSomeClick();

    bindFace();

    bindTxtChange();
};

function bindTxtChange() {
    $("#msgTxt").change(function() {
        checkMsgTxt();
    }).keyup(function() {
        checkMsgTxt();
    });

    function checkMsgTxt() {
        var $msgTxt = $("#msgTxt"),
            str;
        str = $msgTxt.val();

        if (str.length > 140) {
            $(".countTxt").html("超过字数：<em>" + (str.length - 140) + "</em>字数");
        } else {
            $(".countTxt").html("您还能输入<em>" + (140 - str.length) + "</em>字")
        }
    }
}

function bindFace() {
    //insertFace  funBox
    //创建表情div层
    var strHtml = "",
        divFaceImg,
        i,
        $insertFaceSpan,
        $domDivFace;
    strHtml = "<div id='faceImgDiv'>";
    for (i in userFaces) {
        strHtml += "<img src='/faces/" + i + "' alt='" + userFaces[i] + "' />";
    }
    strHtml += "</div>"

    $insertFaceSpan = $("#funBox .insertFace");
    $domDivFace = $(strHtml);
    $domDivFace.appendTo($insertFaceSpan);

    $domDivFace.css("left", $insertFaceSpan.offset().left)
        .css("top", $insertFaceSpan.offset().top + 16 + "px")
        .hide()
        .children("img").click(function() {
            //console.log($(this).attr("src"));
            $("#msgTxt").val($("#msgTxt").val() + "[" + $(this).attr("alt") + "]");
        });
    $("#funBox .insertFace").hover(function() {
        $("#faceImgDiv").show();
    }, function() {
        $("#faceImgDiv").hide();
    });
}


//at some on
function bindAtSomeClick() {
    var str = "",
        i = 0,
        createDom;

    str += "<div id='friendDiv'>";
    for (; i < friendsList.length; i++) {
        str += "<span>@" + friendsList[i] + "</span>";
    }
    str += "</div>";
    //创建弹出来的dom对象
    createDom = $(str);
    $("a.atSome").append(createDom);

    createDom.css("left", $("a.atSome").offset().left + "px")
        .css("top", $("a.atSome").offset().top + 16 + "px")
        .hide()
        .children("span").click(function() {
            $("#msgTxt").val($("#msgTxt").val() + $(this).text());
        });
    console.log(createDom.css("left") + "  " + createDom.css("top"));


    $("a.atSome").hover(function() {

        $("#friendDiv").show();

    }, function() {
        $("#friendDiv").hide();
    });

}

//插入话题
function bindInsertTopic() {
    $("a.creatNew").click(function() {
        var old = $("#msgTxt").val();
        old += "#插入话题#";
        $("#msgTxt").val(old);
    });
}

//绑定  鼠标移动上来改变 背景图片
function bindSendBtnHover() {
    $("#sendBox input.sendBtn").hover(function(e) {
        //移动上来
        $(this).addClass("sendBtnHover");
    }, function() {
        //离开的时候
        $(this).removeClass("sendBtnHover");
    });
}