const { TelegramClient } = require('telegram')
const { NewMessage } = require('telegram/events')
const { StringSession } = require('telegram/sessions')
const input = require('input') // npm i input
const SteamStore = require('steamstore');
let store = new SteamStore();
const SteamUser = require('steam-user')
let user = new SteamUser();



const username = "" // логин вашего стима
const password = "" // пароль вашего стима
const apiId = 0 // api_id с my.telegram.org
const apiHash = '' // api_hash с my.telegram.org
const ss = "" // выставьте свои, полученные с первого запуска(чтобы телега не вылетала)
const stringSession = new StringSession(ss);

// если у вас есть стим гвард, попросит еще и его после входа в телегу

user.logOn({
  accountName: username,
  password: password,
})
user.on('webSession', async (sessionId, cookies) => {
  store.setCookies(cookies)
  //activator(getter(``))
  console.log('Успешный вход в Steam');
});

(async () => {
    console.log('Loading tg auth...')
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
    await client.start({
        phoneNumber: async () => await input.text('number ?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.')
    if (ss == "") {
       console.log('----------Session string begin----------')
       console.log(client.session.save())
       console.log('----------Session string end----------')
       console.log('highly recomennded to save session string at file in ss const')
    }
    client.addEventHandler(eventPrint, new NewMessage({}));
})()

function getter(msg) {
   const pattern = /((?![^0-9]{12,}|[^A-z]{12,})([A-z0-9]{4,5}-?[A-z0-9]{4,5}-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5})?)?))/g;

   var result = Array.from(msg.matchAll(pattern), (m) => `${m[0]}`);
   return result
}
/*
тесты парсера
activator(getter(`Ключи для работяг:
KHANF-VCNRB-XB92R
3WRCW-2F6JQ-WEA9
XPGM9-V49HP-DZ8M6
T0XG9-5Y3G7-IPMHB
009Y6-LGJXV-V22Y6

`))
*/
function activator(keys) {
   for (const key in keys) {
      store.redeemWalletCode(key, function(err) {
        if (err) {
          // debug если ключ не активировался
          console.log(err)
        } else {
          console.log('ключ активирован')
        }
      })

   }

}


async function eventPrint(event) {
    const message = event.message;
    if (message.peerId.channelId.value) {
    if (parseInt(message.peerId.channelId.value) == 1408669138) { // id канала деда(в формате telegram api, не bot api)
      if (message.message != '' || message.message) {
         const keys = getter(message.message)
         console.log(`new message!\nfound ${keys.length} keys`)
         activator(keys)
      }
    }}
}
