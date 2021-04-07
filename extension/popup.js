
document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      let user_id = userInfo.email;
      let url = tabs[0].url;
      let title = tabs[0].title;
      $("#msgurl").text(url);   
      $("#msgtitle").text(title);
      $("#msguserid").text(user_id);
      });
  });
});

document.getElementById("send_true").addEventListener("click", result_true);
document.getElementById("send_false").addEventListener("click", result_false);

function  result_true() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      let data = {}
      let url = tabs[0].url;
      let title = tabs[0].title;
      let user_id = userInfo.id;
      let user_email = userInfo.email;
      data["url"] = url.toString();
      data["title"] = title;
      data["user_id"] = user_id.toString();
      data["user_email"] = user_email;
      data["result"] = 1;
      data["get_noresult"] = 0;
      chrome.runtime.sendMessage(data);
    });
  });

}

function  result_false() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      let data = {}
      let url = tabs[0].url;
      let title = tabs[0].title;
      let user_id = userInfo.id;
      let user_email = userInfo.email;
      data["url"] = url;
      data["title"] = title;
      data["user_id"] = user_id;
      data["user_email"] = user_email;
      data["result"] = 0;
      data["get_noresult"] = 0;
      chrome.runtime.sendMessage(data);
    });
  });
}
