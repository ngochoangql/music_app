import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { SocketService } from '../socket/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  ipAddresLocal: string = '10.229.70.29';
  token: string | null = localStorage.getItem('authToken');
  listWord: any = [];
  listSong: any = [];
  selectedSong: string = '';
  selectedIndex: number | null = null;
  pause: boolean = false;
  pauseText: string = 'Pause';
  userId: string | null = localStorage.getItem('user_id');
  progress: number = 0; // Phần trăm tiến trình
  currentTime: number = 0; // Thời gian hiện tại của bài hát
  duration: number = 0; // Tổng thời gian của bài hát
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @Input() options: { value: any, label: string }[] = [];
  @Input() placeholder: string = 'Select an option';
  selectedOption: string | null = null;
  isOpen = false;
  deviceInfo : any = this.getDeviceInfo();
  ngOnInit(): void {
    console.log(this.userId);
    console.log(this.token);

    if (this.token !== null && this.userId!==null) {
      this.apiService.checkToken(this.token).subscribe(
        (response) => {

        },
        (error) =>{
          this.router.navigate(["/"])
        }
      )
      this.apiService.getsWord(this.token).subscribe(
        (response) => {
          this.listWord = response;
        },
        (error) => {
          console.log(error);
        }
      );
      this.apiService.getsSong(this.token).subscribe(
        (response) => {
          this.listSong = response;
          this.selectedSong = response[0].file_name;
          this.selectedIndex = 0;
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(error);
        }
      );
      this.apiService.getsSesion(this.userId,this.token).subscribe(
        (response) => {
          this.options = response.map((item :any)=> ({value:item.device_info,label:item.device_info}));
          console.log(this.options);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    this.socketService.songSelected$.subscribe((data: any) => {
      if (data !== null) {
        console.log(data, data.user_id === this.userId);
        if (data.user_id === this.userId) {
          this.selected(data.index);
          this.pause = data.pause;
          if(this.pause){
            this.audioPlayer.nativeElement.pause()
            this.pauseText = 'Play';
          }else{
            this.audioPlayer.nativeElement.play()
            this.pauseText = 'Pause';
          }

        }
      }
    });
    console.log(this.deviceInfo);
  }
  onSelectedHandle(index: number) {
    this.onSongSelect(index);
    this.selected(index);
  }
  selected(index: any) {
    console.log('index ', index);
    this.selectedSong = this.listSong[index].file_name;
    this.selectedIndex = index;
    this.cdr.detectChanges();
  }
  onAudioEnded() {
    if (this.selectedIndex !== null)
      this.onSelectedHandle(this.selectedIndex + 1);
  }
  onSongSelect(index: number,action :string = "none") {
    console.log(index);
    this.socketService.selectSong({ user_id: this.userId, index , pause: action === "auto"?false :this.pause});
  }
  toggle() {
    this.pause = !this.pause;
    if (this.pause) {
      this.audioPlayer.nativeElement.pause()
      this.pauseText = 'Play';
    } else {
      this.audioPlayer.nativeElement.play().catch(error => {
        console.error('Autoplay was prevented:', error);
        // Xử lý lỗi nếu trình duyệt ngăn chặn autoplay
      }); // Phát âm thanh
      this.pauseText = 'Pause';
    }
    console.log('click');
    if(this.selectedIndex!== null)
      this.onSongSelect(this.selectedIndex)
  }
  back(){
    if (this.selectedIndex!==null  && this.selectedIndex >=1){
      this.onSongSelect(this.selectedIndex-1,"auto")
      this.selected(this.selectedIndex-1);
    }

  }
  next(){
    if (this.selectedIndex!==null  && this.selectedIndex <this.listSong.length-1){
      this.onSongSelect(this.selectedIndex+1,"auto")
      this.selected(this.selectedIndex+1);
    }
  }
  updateProgress() {
    const audio = this.audioPlayer.nativeElement;
    this.currentTime = audio.currentTime;
    this.progress = (audio.currentTime / audio.duration) * 100;
  }

  setDuration() {
    const audio = this.audioPlayer.nativeElement;
    this.duration = audio.duration;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  seekAudio(event: MouseEvent) {
    const audio = this.audioPlayer.nativeElement;
    const progressBar = event.currentTarget as HTMLElement;
    const clickPosition = event.offsetX / progressBar.offsetWidth;
    audio.currentTime = clickPosition * audio.duration;
    this.updateProgress();
  }
  getDeviceInfo() {
    const userAgent = navigator.userAgent;

    if (/mobile/i.test(userAgent)) {
      if (/android/i.test(userAgent)) {
        return 'Điện thoại Android';
      } else if (/iPhone/i.test(userAgent)) {
        return 'iPhone';
      }
      return 'Thiết bị di động';
    } else if (/tablet/i.test(userAgent)) {
      return 'Máy tính bảng';
    } else if (/Windows NT/i.test(userAgent)) {
      if (/MSIE|Trident/i.test(userAgent)) {
        return 'Máy tính Windows với Internet Explorer';
      }
      return 'Máy tính Windows';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      return 'Máy tính Mac';
    } else if (/Linux/i.test(userAgent)) {
      return 'Máy tính Linux';
    } else {
      return 'Thiết bị không xác định';
    }
  }
  toggleOptions(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { value: any, label: string }): void {
    this.selectedOption = option.label;
    this.isOpen = false;
    // Emit selected value if needed
  }
  login(){

  }
  logout(){
    this.router.navigate(["/"])
  }
  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private router : Router
  ) {}
}
