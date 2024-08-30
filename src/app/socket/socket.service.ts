import { ApplicationRef, inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private songSelectedSource = new BehaviorSubject<number | null>(null);
  songSelected$ = this.songSelectedSource.asObservable();

  constructor() {
    this.socket = io('http://10.229.70.29:3000', { autoConnect: false }); // Địa chỉ WebSocket server của bạn
    inject(ApplicationRef).isStable.pipe(
      first((isStable) => isStable))
    .subscribe(() => {this.socket.connect()});
    this.socket.on('song_selected', (data : any) => {
      this.songSelectedSource.next(data);
    });
  }

  selectSong(data : any) {
    this.socket.emit('select_song', data);
  }
}
