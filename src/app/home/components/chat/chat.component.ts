import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ChatService} from "../../services/chat.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  form = new FormGroup({
    newMessage: new FormControl<string | null>(null)
  })

  newMessage$: Observable<string>
  messages: string[] = []

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    return this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message)
    })
  }

  sendMessage() {
    const {newMessage} = this.form.value
    if (!newMessage) return
    this.chatService.sendMessage(newMessage)
    this.form.reset()
  }

}
