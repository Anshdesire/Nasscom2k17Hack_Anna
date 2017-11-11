import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events, Content, TextInput } from 'ionic-angular';
import { ChatMessage, UserInfo } from "../../providers/chat-service";
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  data: Object;
  status: any;
  editorMsg: '';
  msgList: ChatMessage[] = [{
    type: 'machine',
    answer: 'Hello! This is Anna. Start your day with a Hello.'
  }];
  locations: Array<any>;
  userAvatar: './img/user.jpg';

  constructor(public navCtrl: NavController, public http: Http, public sanitizer: DomSanitizer) {
    // this.getData();
  };
  getData() {
    this.status = 'pending';
    this.msgList.push({
      type: 'user',
      'answer': this.editorMsg,
    });
    // don't have the data yet
    return new Promise(resolve => {
      const msg = this.editorMsg.trim();
      this.editorMsg = '';
      this.locations = [];
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://192.168.106.111:8000/api/v1/talkings', { question: msg })
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          data.type = 'machine';
          var dataHospital = '';
          if (data.hasOwnProperty('hospital')) {
            for (var index = 0; index < data.hospital.length; index++) {
              var element = `<div><p><span>Name</span>: ${data.hospital[index].HospitalName}</p><p><span>Contact</span>: ${data.hospital[index].HospitalcontactNo}</p><p><span>Free Beds</span>: ${data.hospital[index].TotalFreeBed}</p><span></span></div>`;
              dataHospital = dataHospital + element;
              this.locations.push({
                lat: data.hospital[index].lat,
                long: data.hospital[index].lng
              });
            }
          };
          if (dataHospital != '') {
            data.answer = data.answer + dataHospital;
            data.answer = this.sanitizer.bypassSecurityTrustHtml(data.answer);
          }
          this.msgList.push(data);
          this.status = 'n';
          resolve(this.data);
        });
    });
  };
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  };
  sendMsg() {
    if (!this.editorMsg.trim()) return;
    this.getData();
  };
  switchEmojiPicker() {

  };
  clear() {
    this.msgList = [];
    this.status = 'p';
  };
  getLocation() {
    console.log(this.locations);
    // var map;
    // document.addEventListener("deviceready", function () {
    //   var div = document.getElementById("map_canvas");

    //   // Initialize the map view
    //   map = plugin.google.maps.Map.getMap(div);

    //   // Wait until the map is ready status.
    //   map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
    // }, false);

  }
  onFocus() {
    // this.showEmojiPicker = false;
    // this.content.resize();
    this.scrollToBottom();
  }

}
