const SteamCommunity = require('steamcommunity');
const SteamUser = require('steam-user')
let user = new SteamUser();
const community = new SteamCommunity();

const username = 'your_steam_login';
const password = 'your_steam_password';

const targetProfile = 'deadp47';
const interval = 3 * 60 * 1000; // 3 минуты интервала

function addFriend() {
  community.getSteamUser(targetProfile, (err, usr) => {
    if (err) {
      console.error('Ошибка получения информации об аккаунте:', err);
      return;
    }
    usr.addFriend((err) => {
      if (err) {
        console.error('Список переполнен');
      } else {
        console.log('Запрос в друзья успешно отправлен');
        return;
      }
    });
  });
}

// Cookies exp handler
community.on("sessionExpired", function(err) {
	if (err) {
		user.webLogOn();
	}
});

user.logOn({
  accountName: username,
  password: password,
})
user.on('webSession', async (sessionId, cookies) => {
  community.setCookies(cookies)

  console.log('Успешный вход в Steam');
  addFriend();
  setInterval(addFriend, interval);
});
