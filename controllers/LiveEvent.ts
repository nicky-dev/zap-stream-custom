import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";
import { StreamProvider, StreamStats } from "../providers/interface";

const UPTIME_CHECK_MAX_ATTEMPS = 5;

export class LiveEvent {
  event?: NDKEvent;
  ndk: NDK;
  timeoutHandler?: NodeJS.Timeout;
  started: boolean = false;
  uptimeCheckAttempts: number = 0;
  currentPaticipants?: string = "0";
  status: "live" | "ended" = "live";
  liveId?: string;
  streamProvider?: StreamProvider;

  constructor(ndk: NDK) {
    this.ndk = ndk;
  }

  setStreamProvider(provider: StreamProvider) {
    this.streamProvider = provider;
  }

  setEvent(event: NDKEvent) {
    this.event = event;
    this.liveId = this.event.tagValue("d");
    this.currentPaticipants =
      this.event.tagValue("current_participants") || "0";
    this.log(this.currentPaticipants, "viewers");
  }

  start() {
    this.started = true;
    this.updateLiveStats();
  }
  stop() {
    this.started = false;
    clearTimeout(this.timeoutHandler);
  }

  async updateLiveStats() {
    try {
      if (!this.isReady()) return;
      const stats = await this.streamProvider!.fetchStats();
      if (this.isOnline(stats)) {
        this.uptimeCheckAttempts = 0;
      } else {
        if (this.uptimeCheckAttempts === UPTIME_CHECK_MAX_ATTEMPS) {
          const ndkEvent = this.createEvent();
          ndkEvent.removeTag("current_participants");
          ndkEvent.removeTag("status");
          ndkEvent.tags.push(["status", "ended"]);
          // ndkEvent.removeTag("image");
          // ndkEvent.tags.push(["image", ndkEvent.content]);
          // ndkEvent.content = "";
          this.log("Update status ended");
          await ndkEvent.publish();
          this.stop();
          return;
        }
        this.uptimeCheckAttempts += 1;
        this.log("Uptime check attempts:", this.uptimeCheckAttempts);
        return;
      }
      if (this.currentPaticipants === stats.viewers?.toString()) return;
      this.currentPaticipants = stats.viewers?.toString();
      const ndkEvent = this.createEvent();
      ndkEvent.removeTag("current_participants");
      ndkEvent.tags.push(["current_participants", this.currentPaticipants]);
      // ndkEvent.content = ndkEvent.content || ndkEvent.tagValue("image") || "";
      this.log("Update viewers");
      await ndkEvent.publish();
    } catch (err) {
    } finally {
      if (!this.started) return;
      this.timeoutHandler = setTimeout(() => {
        this.updateLiveStats();
      }, 5000);
    }
  }

  isReady() {
    if (!this.event || !this.started || !this.liveId || !this.streamProvider)
      return false;
    return true;
  }

  isOnline(process?: StreamStats) {
    if (!process) return false;
    if (process.uptime > 0) {
      return true;
    } else {
      return false;
    }
  }

  createEvent() {
    const ndkEvent = new NDKEvent(this.ndk);
    ndkEvent.content = this.event!.content;
    ndkEvent.kind = this.event!.kind;
    ndkEvent.author = this.event!.author;
    ndkEvent.tags = this.event!.tags;
    return ndkEvent;
  }

  log(...args: any[]) {
    console.log(`[Event]:`, this.liveId, ...args);
  }
}
