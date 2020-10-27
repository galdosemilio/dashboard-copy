import { Injectable } from '@angular/core';
import { ContextService, LoggingService } from '@app/service';
import { ConnectionStats } from '@app/shared/selvera-api';
import { Subject } from 'rxjs';
import { TwilioRoomMonitor } from 'selvera-api';
import { LocalDataTrack, Room } from 'twilio-video';

@Injectable()
export class TwilioBandwidthService {
  public currentRoom: Room = null;
  public connectionUpdate$: Subject<ConnectionStats[]> = new Subject<ConnectionStats[]>();

  private dataTrack: LocalDataTrack = null;
  private dataTrackPublished: any = {};
  private roomMonitor: TwilioRoomMonitor;
  private subscriptions = [];
  private monitorInterval: any;
  private monitorIntervalTimeout: number = 1000;
  private releasedCamera: boolean = false;

  constructor(private context: ContextService, private loggingService: LoggingService) {
    this.onMessageReceived = this.onMessageReceived.bind(this);
  }

  public monitorRoom(room: Room): void {
    this.currentRoom = room;
    this.setupDataTracks();
    this.roomMonitor = new TwilioRoomMonitor(this.loggingService.getProvider());
    this.roomMonitor.init({
      userId: this.context.user.id,
      appType: this.loggingService.app
    });
    this.subscriptions = [
      this.roomMonitor.connectionUpdate$.subscribe((connectionStats) =>
        this.connectionUpdate$.next(connectionStats)
      ),
      this.roomMonitor.message$.subscribe((message) => this.sendMessage(message))
    ];

    this.monitorInterval = setInterval(async () => {
      this.roomMonitor.monitorRoomHandler(await this.currentRoom.getStats());
    }, this.monitorIntervalTimeout);
  }

  public onMessageReceived(raw: string): void {
    this.roomMonitor.onMessageReceived(raw);

    if (this.releasedCamera) {
      return;
    }

    this.sendMobileCameraOnMessage();
    this.releasedCamera = true;
  }

  public sendMobileCameraOffMessage(): void {
    this.roomMonitor.sendMobileCameraOffMessage();
  }

  public sendMobileCameraOnMessage(): void {
    this.roomMonitor.sendMobileCameraOnMessage();
  }

  public sendMobileOffMessage(): void {
    this.roomMonitor.sendMobileOffMessage();
  }

  public sendMobileOnMessage(): void {
    this.roomMonitor.sendMobileOnMessage();
  }

  public stopMonitoringRoom(): void {
    if (!this.roomMonitor) {
      return;
    }

    this.releasedCamera = false;
    clearInterval(this.monitorInterval);
    this.roomMonitor.stopMonitoringRoom();
    this.unsubscribe();
  }

  private sendMessage(data: string): void {
    this.dataTrackPublished.promise.then(() => this.dataTrack.send(data));
  }

  private setupDataTracks(): void {
    this.dataTrack = new LocalDataTrack();
    this.currentRoom.localParticipant.publishTrack(this.dataTrack);

    this.dataTrackPublished.promise = new Promise((resolve, reject) => {
      this.dataTrackPublished.resolve = resolve;
      this.dataTrackPublished.reject = reject;
    });

    this.currentRoom.localParticipant.on('trackPublished', (publication) => {
      if (publication.track === this.dataTrack) {
        this.dataTrackPublished.resolve();
      }
    });

    this.currentRoom.localParticipant.on('trackPublicationFailed', (error, track) => {
      if (track === this.dataTrack) {
        this.dataTrackPublished.reject(error);
      }
    });
  }

  private unsubscribe(): void {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe()
    );
  }
}
