
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
var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
  type: 'pie',
  data: {
      labels: ['不真實', '真實'],
      datasets: [{
          label: '# of Votes',
          data: [12, 19],
          backgroundColor: [
              '#CB5A74',
              '#3C5088',
          ],
          borderWidth: 0
      }]
  },
  options: {
    plugins: {
        legend: {
            reverse: true,
            labels: {
                // This more specific font property overrides the global property
                font: {
                    size: 18
                }
            }
        }
    }
  }
});

function  result_true() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      var val = document.getElementById("input_text").value ;
      let data = {
        url : tabs[0].url.toString(),
        title : tabs[0].title,
        user_id : userInfo.id.toString(),
        user_email : userInfo.email,
        result : 1,
        get_noresult : 0,
        comment : val
      }
      chrome.runtime.sendMessage(data);
    });
  });
}

function  result_false() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      var val = document.getElementById("input_text").value ;
      let data = {
        url : tabs[0].url.toString(),
        title : tabs[0].title,
        user_id : userInfo.id.toString(),
        user_email : userInfo.email,
        result : 0,
        get_noresult : 0,
        comment : val
      }
      chrome.runtime.sendMessage(data);
    });
  });
}
