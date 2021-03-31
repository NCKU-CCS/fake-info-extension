//指定比對的url：不允許片段表達式   
//例如： *://*.google.com.tw/* 作為查詢字串不被接受因為host是一個片段表達式  
var urlPattern = '*://udn.com/*';  

//利用 tabs.query api 查找畫面上的所有tab  
function queryTabsAndShowPageActions(queryObject) {  
    chrome.tabs.query(queryObject,  
        function(tabs) {  
            if (tabs && tabs.length > 0) {  
                for (var i = 0; i < tabs.length; i++) {  
                    //在加載完畢的tab上，使用chrome.pageAction.show 啟用按鈕  
                    if (tabs[i].status === "complete") chrome.pageAction.show(tabs[i].id);  
                }  
            }  
        }  
    );  
}  

//第一次的初始化 
chrome.runtime.onInstalled.addListener(function() {  
    queryTabsAndShowPageActions({  
        "active": false,  
        "currentWindow": true,  
        "url": urlPattern  
    });  
});  

//每次tab有變動，檢查現在這個current tab是否在指定的 url pattern底下  
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

    var user_id = response.user_id;
    var news_result = response.result;
    var news_url = response.title; 

    // post resquest url 
    var requestURL = "http://127.0.0.1:8000/users/" + user_id + "/" + news_url + "/" + news_result  ;

    // data of json 
    var dataJSON = {};
    dataJSON["user_id"] = user_id ;
    dataJSON["news_url"] = news_url ;
    dataJSON["news_result"] = news_result ;
    

   
    function checkAccount3(){
        var result ;

        $.ajax({
            // 進行要求的網址(URL)
            url: "http://127.0.0.1:8000/users/" + user_id + "/" + news_url ,
        
            // 要送出的資料 (會被自動轉成查詢字串)
            data: {
                user_id : user_id,
                news_url : news_url
            },
        
            // 要使用的要求method(方法)，POST 或 GET
            type: 'GET',
            async: false,
            // 資料的類型
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            success: function(returnData){
                console.log(returnData);
                console.log("get successed.");
                result = returnData;
            },
            error: function(xhr, ajaxOptions, thrownError){
                console.log(xhr.status);
                console.log(thrownError);
            }
        })
        return result;
    }

    var result = checkAccount3();
    if (result != null){
        console.log("You'd already voted this news");
        console.log("botton over.");
        alert("You'd already voted this news");
        return ;
    }


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
            console.log(thrownError);
            console.log("test");
        }
    });
});
