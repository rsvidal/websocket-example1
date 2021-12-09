import {Component} from '@angular/core';

import * as SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {

  public notifications: string[] = [];

  private client: StompJs.Client;

  connectClicked() {
    if (!this.client || !this.client.connected) {

      this.client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/notifications'),
        debug: (msg: string) => console.log(msg)
      });

      this.client.onConnect = () => {

        console.info('client connected with server sucessfully!');

        this.client.subscribe('/user/notification/item', (response) => {
          const text: string = JSON.parse(response.body).text;
          console.log('Received value is ' + text + ' ...');
          this.notifications.push(text);
        });

      };

      this.client.onStompError = (frame) => {
        console.error(frame.headers['message']);
        console.error('Details:', frame.body);
      };

      this.client.activate();
    }
  }

  disconnectClicked() {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      this.client = null;
      console.info("disconnected :-/");
    }
  }

  startClicked() {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/start'});
      console.info("listening started successfully!");
    }
  }

  stopClicked() {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/stop'});
      console.info("listening stopped successfully!");
    }
  }
}
