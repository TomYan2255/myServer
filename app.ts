
import firebase from 'firebase';

import newTaipei from './json/address/newTaipei.json'

import puppeteer from "puppeteer"
import path from "path"
import PushNotifications from 'node-pushnotifications';
var FCM = require('fcm-node');

import gcm from "node-gcm"
const fetch = require("node-fetch");

const express = require('express')
const app = express()
const port = 3000;

const firebaseConfig = {
  apiKey: "AIzaSyDKpQWRRwgGgdem8eULOssQ-WxmrZeDfZ0",
  authDomain: "housemoney-51217.firebaseapp.com",
  projectId: "housemoney-51217",
  storageBucket: "housemoney-51217.appspot.com",
  messagingSenderId: "1070650822941",
  appId: "1:1070650822941:web:e8550b687907ec214c11f4",
  measurementId: "G-59V0YGPGR5"
};

app.get('/', (req, res) => {
  res.send('Hello World!')

})
firebase.initializeApp(firebaseConfig);
app.listen(port, () => {
  //console.log("fcm", fcm);
  //apns();
  gcmPush();
  // printPic();
  // const dbh = firebase.firestore();

  // dbh.collection('newTaipei');
  // console.log(`Example app listening at http://localhost:${port}`)
  //initData();
})
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const initData = async () => {
  const dbh = firebase.firestore();

  const data = {
    "city": "newTaipei",
    "apis": [
      {
        "key": "https://data.ntpc.gov.tw/api/datasets/ACCE802D-58CC-4DFF-9E7A-9ECC517F78BE/json",
        "name": "110"
      },
    ]

  };
  let newAddress: any[] = [];
  for (let index = 0; index < data.apis.length; index++) {
    const api = data.apis[index];
    let page = 1;
    let formatData = [""];
    while (formatData.length != 0) {
      await sleep(300);
      const row = await fetch(api.key + '?size=1000&page=' + page);
      const text = await row.text()
      formatData = JSON.parse(text);
      console.log('url!', api.key + '?size=1000&page=' + page);
      page++;
      newAddress = newAddress.concat(formatData);
    }
    console.log("page", page);
  }

  newTaipei.forEach(add => {
    const tmp = newAddress.filter((address) => {
      return address.district.indexOf(add.label) > -1;
    });
    if (tmp != undefined) {
      add.data = add.data?.concat(tmp);
    }
  });
  console.log('ready!!!');
  for (let index = 0; index < newTaipei.length; index++) {
    const add = newTaipei[index];
    console.log(add.data.length);
    const newGroup = group(add.data, 100);
    for (let j = 0; j < newGroup.length; j++) {
      const element = newGroup[j];
      await sleep(1500);
      try {

        await dbh.collection(data.city).doc(add.value + "_" + data.apis[0].name + "_" + j).set({
          data: {
            element,
            year: data.apis[0].name,
            count: element.length
          }
        })
      } catch (error) {
        console.log('error' + add.value + "_" + data.apis[0].name + + "_" + j)
      }
    }
  }

  console.log('done')

}

function group(array: any, subGroupLength: any) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}


function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

function fcmPush() {
  var serverKey = 'AAAAf6WFQMw:APA91bFRCkkSY8yKzhOf9Lnzh-lrJO2dYpytFn0GgOVkKvAJZbP7LzJeYpNQyeP_AQ8byvdIkg7_K7vhAiQMcNrLKjFED8G2cPHMUFBP0ktzgUUO214ZjliQ8umTcCKvJGqKz_urHMKh'; //put your server key here
  var fcm = new FCM(serverKey);

  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'a05dc038c92237fb573e9906045e7bcc30c09a5299a639e41d83efd40e63cec3',
    collapse_key: 'collapse_key',

    notification: {
      title: 'Title of your push notification',
      body: 'Body of your push notification'
    },

    data: {  //you can send only notification or only data(or include both)
      my_key: 'my value',
      my_another_key: 'my another value'
    }
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!", err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });

}

function apns() {
  const apn = require("apn");

  let tokens = ["a05dc038c92237fb573e9906045e7bcc30c09a5299a639e41d83efd40e63cec3"];

  let service = new apn.Provider({
    cert: "ck.pem",
    key: "ipos18_prod.pem",
    passphrase: "xlinkxlink",
    gateway: 'gateway.sandbox.push.apple.com',
    port: 2195,
  });

  let note = new apn.Notification({
    alert: "Test",
  });

  // The topic is usually the bundle identifier of your application.
  note.topic = "test";

  console.log(`Sending: ${note.compile()} to ${tokens}`);
  service.send(note, tokens).then(result => {
    console.log("sent:", result.sent.length);
    console.log("failed:", result.failed.length);
    console.log(result.failed);
  });
}

function gcmPush() {
  // AAAAf6WFQMw:APA91bFRCkkSY8yKzhOf9Lnzh-lrJO2dYpytFn0GgOVkKvAJZbP7LzJeYpNQyeP_AQ8byvdIkg7_K7vhAiQMcNrLKjFED8G2cPHMUFBP0ktzgUUO214ZjliQ8umTcCKvJGqKz_urHMKh
  var sender = new gcm.Sender('AAAAf6WFQMw:APA91bFRCkkSY8yKzhOf9Lnzh-lrJO2dYpytFn0GgOVkKvAJZbP7LzJeYpNQyeP_AQ8byvdIkg7_K7vhAiQMcNrLKjFED8G2cPHMUFBP0ktzgUUO214ZjliQ8umTcCKvJGqKz_urHMKh');

  console.log("gcmPush!")
  var message = new gcm.Message({
    data: {
      aps:{
      alert: "alert",
      badge: 1,
      body: "body",
      fpic: "https://www.dawu.xyz/fcmpush/pa1.jpg",
      fun: "https://www.google.com",
      title: "title",
      "mutable-content": 1,
      sound: "default"
     }

    }
  });



  // Specify which registration IDs to deliver the message to
  var regTokens = ['ddBBys6hC7I:APA91bH-RGU8NI_qIO62L6v86sZtbDHofd89TcyA-3vkZ3nbB5CmIm41umESi47qaBmH3S6RnX1vacALJv6aebr9IXOcNzQElb_dtcuSw4kAbXDNT-pZLUoAyeQ2nTPVShAmPa-0aQ3c'];

  // Actually send the message
  sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if (err) console.error(err);
    else console.log("error response:", response);
  });
}



const youtubeUrlRegExp = new RegExp(
  /^https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)(&t=(\d+))?$/
)

//https://www.youtube-nocookie.com/embed/w4Ay5N0hPgk?start=18&autoplay=1

const printPic = async function () {
  try {
    console.log("1");

    const browser = await puppeteer.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
    const page = await browser.newPage()

    // Bridge browser console to Node (used while developing package)
    page.on("console", (message) => console.log("Page log:", message))

    await page.setViewport({
      width: parseInt("1920") / 2,
      height: parseInt("1080") / 2,
      deviceScaleFactor: 2,
    })

    const url = `https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&start=120&end=200&modestbranding=1
    &rel=0&autohide=1&showinfo=0&controls=0&fs=0&cc_load_policy=0&color=white&enablejsapi=1`;
    console.log("??", url)
    await page.goto(
      url
    )
    await delay(500);
    console.log("2");
    // Remove "Watch on YouTube"
    await page.evaluate((selector) => {
      const node = document.querySelector(selector)
      if (node) {
        node.parentNode.removeChild(node)
      }
    }, ".ytp-impression-link")


    const filename = `21212.png`

    await page.screenshot({
      path: path.resolve("/Users/liangjinkan/Downloads/作品集", filename),
      type: "png",
    })
    await browser.close()
    console.log("3");
  } catch (error) {
    console.log("??");
    console.error(error)
    process.exit(1)
  }
}
