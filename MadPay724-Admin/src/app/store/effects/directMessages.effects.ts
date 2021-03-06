import { Effect, Actions, ofType, act } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { DirectMessageService } from 'src/app/core/_services/common/DirectMessage.service';
import * as directMessageActions from '../actions/directMessages.actions'
import { switchMap } from 'rxjs/operators';


@Injectable()
export class DirectMessageEffects {
    constructor(private action$: Actions, private directMessageService: DirectMessageService) { }

    @Effect()
    sendDirectMessage$: Observable<Action> = this.action$.pipe(
        ofType<directMessageActions.SendDirectMessage>
            (directMessageActions.DirectMessagesActionTypes.SEND_DIRECT_MESSAGE),
        switchMap((action: directMessageActions.SendDirectMessage) => {
            this.directMessageService.sendDirectMessage(action.message, action.userId);
            return of(new directMessageActions.SendDirectMessageComplete(action.message))
        })
    )

    @Effect()
    join$: Observable<Action> = this.action$.pipe(
        ofType<directMessageActions.Join>
            (directMessageActions.DirectMessagesActionTypes.JOIN),
        switchMap(() => {
            this.directMessageService.join();
            return of(new directMessageActions.JoinSent())
        })
    )

    @Effect()
    leave$: Observable<Action> = this.action$.pipe(
        ofType<directMessageActions.Leave>
            (directMessageActions.DirectMessagesActionTypes.LEAVE),
        switchMap(() => {
            this.directMessageService.leave();
            return of(new directMessageActions.LeaveSent())
        })
    )
}