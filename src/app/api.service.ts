import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient:HttpClient ){}
  ipAddresLocal : string = "10.229.70.29"
  login(data: any) :Observable<any>{
    return this.httpClient.post<any>(`http://${this.ipAddresLocal}:3000/users/login`,data);
  }
  getsWord(token:string){
    return this.httpClient.get<any>(`http://${this.ipAddresLocal}:3000/words`,{headers:{"Authorization":`Bearer ${token}`}})
  }
  getsSong(token:string){
    return this.httpClient.get<any>(`http://${this.ipAddresLocal}:3000/songs`,{headers:{"Authorization":`Bearer ${token}`}})
  }
  getsSesion(user_id:string,token : string){
    return this.httpClient.get<any>(`http://${this.ipAddresLocal}:3000/sessions/${user_id}`,{headers:{"Authorization":`Bearer ${token}`}})
  }
  checkToken(token:string){
    return this.httpClient.get<any>(`http://${this.ipAddresLocal}/users/token`,{headers:{"Authorization":`Bearer ${token}`}})
  }
}
