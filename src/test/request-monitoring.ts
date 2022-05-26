import { Exclude, Expose } from 'class-transformer';
import { PreventDuplicateRequest } from 'src/prevent-duplicate';

export enum enumRequestStatus {
  ready = 'ready',
  waiting = 'waiting',
  handling = 'handling',
  done = 'done',
}

@Exclude()
export class RequestMonitoring {
  public constructor(init?: Partial<RequestMonitoring>) {
    Object.assign(this, init);
  }

  private _status: enumRequestStatus;

  public get status() {
    return this._status;
  }

  public set status(status: enumRequestStatus) {
    console.log(this);

    const handling =
      PreventDuplicateRequest.Protected_Stack_Handling.indexOf(this);
    const waiting =
      PreventDuplicateRequest.Protected_Stack_Waiting.indexOf(this);
    const ready = PreventDuplicateRequest.Protected_Stack_Ready.indexOf(this);

    if (status == enumRequestStatus.ready) {
      this.time = +new Date();
      PreventDuplicateRequest.Protected_Stack_Ready.push(this);
    }
    if (status == enumRequestStatus.waiting) {
      this.time = +new Date();
      if (ready >= 0) {
        PreventDuplicateRequest.Protected_Stack_Ready.splice(ready, 1);
      }
      PreventDuplicateRequest.Protected_Stack_Waiting.push(this);
    }
    if (status == enumRequestStatus.handling) {
      this.time = +new Date();
      if (waiting >= 0) {
        PreventDuplicateRequest.Protected_Stack_Waiting.splice(waiting, 1);
      }
      PreventDuplicateRequest.Protected_Stack_Handling.push(this);
    }
    if (status == enumRequestStatus.done) {
      this.time = +new Date();
      if (handling >= 0) {
        PreventDuplicateRequest.Protected_Stack_Handling.splice(handling, 1);
      }
      if (waiting >= 0) {
        PreventDuplicateRequest.Protected_Stack_Waiting.splice(waiting, 1);
      }
      if (ready >= 0) {
        PreventDuplicateRequest.Protected_Stack_Ready.splice(ready, 1);
      }
    }
    this._status = status;
  }

  @Expose()
  public request_id: string;

  @Expose()
  public time: number;

  // @Expose()
  // public status: enumRequestStatus;

  @Expose()
  public client_ip: string;

  @Expose()
  public message: Object;
}
