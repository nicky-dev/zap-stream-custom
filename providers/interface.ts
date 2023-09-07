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
  viewers: number;

  /**
   *
   */
  uptime: number;

  /**
   *
   */
  totalViewers?: number;
}
