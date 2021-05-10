// 指定比對的url：不允許片段表達式
// 例如： '*://udn.com/*' 作為查詢字串不被接受因為host是一個片段表達式
let urlPattern = '*://udn.com/*';

// 利用 tabs.query api 查找畫面上的所有tab
function queryTabsAndShowPageActions(queryObject) {
    chrome.tabs.query(queryObject,
        function(tabs) {
            if (tabs && tabs.length > 0) {
                for (var i = 0; i < tabs.length; i++) {
                    // 在加載完畢的tab上，使用chrome.pageAction.show 啟用按鈕
                    if (tabs[i].status === "complete") chrome.pageAction.show(tabs[i].id);
                }
            }
        }
    );
}

// 第一次的初始化
chrome.runtime.onInstalled.addListener(function() {
    queryTabsAndShowPageActions({
        "active": false,
        "currentWindow": true,
        "url": urlPattern
    });
});

// 每次tab有變動，檢查現在這個current tab是否在指定的 url pattern底下
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    queryTabsAndShowPageActions({
        "active": true,
        "currentWindow": true,
        "url": urlPattern
    });
});


// for post request
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){


    console.log("botton start");

    let user_id = response.user_id;
    let news_result = response.result;
    let news_url = response.title;
    let comment = response.comment;

    // post resquest url
    let requestURL = "http://127.0.0.1:8000/users/" + user_id + "/" + news_url + "/" + news_result + "/" + comment ;

    // data of json
    let dataJSON = {
        user_id : user_id ,
        news_url : news_url ,
        news_result : news_result,
        comment : comment
    };

    $.ajax({
        url: requestURL,
        data: JSON.stringify(dataJSON),
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(returnData){
            console.log(returnData);
            console.log("post successed.");
            console.log("botton over.");
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(thrownError.status);
            console.log("You'd already voted this news");
            alert("You'd already voted this news");
        }
    });
});
