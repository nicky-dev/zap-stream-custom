export interface StreamProvider {
  /**
   *
   */
  fetchStats: () => Promise<StreamStats>;

  getStreamUrl?: () => string;

  getRecordUrl?: () => string;

  getSnapshotUrl?: () => string;
}

export interface StreamStats {
  /**
   *
   */
  totalViewers?: number;

  /**
   *
   */
  viewers: number;

  /**
   *
   */
  uptime: number;
}
