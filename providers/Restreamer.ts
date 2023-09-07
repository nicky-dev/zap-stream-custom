import { StreamProvider, StreamStats } from "./interface";

export class Restreamer implements StreamProvider {
  private server: string;
  private streamKey: string;

  constructor(server: string, streamKey: string) {
    this.server = server;
    this.streamKey = streamKey;
  }

  async fetchStats() {
    const url = `${this.server}/api/v3/widget/process/restreamer-ui:ingest:${this.streamKey}`;
    const result = await fetch(url);
    const jsonResult = await result.json();
    const process: StreamStats = {
      viewers: jsonResult.current_sessions,
      uptime: jsonResult.uptime,
    };
    return process;
  }
}
