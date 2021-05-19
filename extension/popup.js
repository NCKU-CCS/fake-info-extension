document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      $("#page_url").text(tabs[0].url);
      $("#page_title").text(tabs[0].title);
      $("#user_id").text(userInfo.email);
    });
  });
});

function initial_function (){
  api().then( v => {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let title = tabs[0].title;
        let arr = value_count(v, title);
        let ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
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
}

initial_function();

// http get data from api server.
async function api(){
  console.log("call http get success")
  let json_data;
  await new Promise((resolve, reject) => {
    console.log(reject);
      $.ajax({
          type :"GET",
          url  : "http://localhost:8000/users",
          data : "check",
          dataType: "json",
          success : function(result) {
              json_data = result;
              resolve();
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr, ajaxOptions, thrownError)
            resolve();
          }
      });
  })
  return json_data;
}

// calculate count of results(true, false).
function value_count(json_data, title){
  let i, t = 0, f = 0;
  for (i = 0; i < json_data.length; i++) {
    if (json_data[i].news_url == title){
      if (json_data[i].news_result){
          t = t + 1;
      }
      else if (json_data[i].news_result == false){
          f = f + 1;
      }
    }
  }
  return [t, f];
}

document.getElementById("send_true").addEventListener("click", result_true);
document.getElementById("send_false").addEventListener("click", result_false);

function  result_true() {
  let result = 1;
  button_result(result);
}

function  result_false() {
  let result = 0;
  button_result(result);
}

function button_result(parameter){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      var val = document.getElementById("input_text").value ;
      let data = {
        url : tabs[0].url.toString(),
        title : tabs[0].title,
        user_id : userInfo.id.toString(),
        user_email : userInfo.email,
        result : parameter,
        comment : val
      }
      chrome.runtime.sendMessage(data);
    });
  });
  window.location.reload();
}
