import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TicketContent } from 'src/app/models/ticketContent';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-message-ticket',
  templateUrl: './chat-message-ticket.component.html',
  styleUrls: ['./chat-message-ticket.component.css']
})
export class ChatMessageTicketComponent implements OnInit, OnDestroy {
  @Input() ticketContent: TicketContent;
  photoUrl: string;
  manageSub = new Subscription();
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.manageSub.add(
      this.authService.currentPhotoUrl.subscribe(pu => this.photoUrl = pu)
    );
  }
  ngOnDestroy() {
     this.manageSub.unsubscribe();
  }

}
