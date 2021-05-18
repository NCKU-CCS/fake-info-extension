
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

function initital_function (){
callapi().then( v => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      let user_id = userInfo.email;
      let url = tabs[0].url;
      let title = tabs[0].title;
      data = v;
      arr = valcount(data, title);
      let ctx = document.getElementById('myChart').getContext('2d');
      let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['不真實', '真實'],
            datasets: [{
                label: '# of Votes',
                data: [arr[1], arr[0]],
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
                      font: {
                          size: 18
                  }
              }
          }
        }
        }
      });
    });
  });
});
}

initital_function();

async function callapi(){
  console.log("call http get success")
  let jsondata;
  await new Promise((resolve, reject) => {
      $.ajax({
          type :"GET",
          url  : "http://localhost:8000/users",
          data : "check",
          dataType: "json",
          success : function(result) {
              jsondata = result;
              resolve();
          },
          error: function (xhr, ajaxOptions, thrownError) {
              resolve();
          }
      });
  })
  return jsondata;
}

function valcount(jsondata, title){
  let i, t = 0, f = 0;
  for (i = 0; i < jsondata.length; i++) {
    if (jsondata[i].news_url == title){

      if (jsondata[i].news_result){
          t = t + 1;
          console.log("t+1");
      }
      else if (jsondata[i].news_result == false){
          f = f + 1;
          console.log("f+1");
      }
    }
  }
  return [t, f];
}

document.getElementById("send_true").addEventListener("click", result_true);
document.getElementById("send_false").addEventListener("click", result_false);

function  result_true() {
  let result = 1;
  botton_result(result);
}

function  result_false() {
  let result = 0;
  botton_result(result);
}

function botton_result(parameter){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      var val = document.getElementById("input_text").value ;
      let data = {
        url : tabs[0].url.toString(),
        title : tabs[0].title,
        user_id : userInfo.id.toString(),
        user_email : userInfo.email,
        result : parameter,
        get_noresult : 0,
        comment : val
      }
      chrome.runtime.sendMessage(data);
    });
  });
  window.location.reload();
}
