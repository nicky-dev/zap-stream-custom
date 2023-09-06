import "./utils/env";
import "./utils/ws-polyfill";
import NDK, {
  NDKEvent,
  NDKKind,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import { LiveEvent } from "./controllers/LiveEvent";
import { ReStream } from "./providers/ReStream";

if (!process.env.PRIVATE_KEY) {
  throw new Error("environment variable `PRIVATE_KEY` does not set");
}

if (!process.env.RESTREAM_SERVER) {
  throw new Error("environment variable `RESTREAM_SERVER` does not set");
}

if (!process.env.RESTREAM_KEY) {
  throw new Error("environment variable `RESTREAM_KEY` does not set");
}

const events: Record<string, LiveEvent> = {};
const privateKeySigner = new NDKPrivateKeySigner(process.env.PRIVATE_KEY);
const ndk = new NDK({
  explicitRelayUrls: process.env.RELAYS
    ? process.env.RELAYS.split(",")
        .map((d) => d.trim())
        .filter((d) => !!d)
    : [
        "wss://relay.snort.social",
        "wss://nos.lol",
        "wss://relay.damus.io",
        "wss://nostr.wine",
      ],
  signer: privateKeySigner,
});

const run = async () => {
  await ndk.connect();
  const ndkUser = await privateKeySigner.user();
  const subscription = ndk.subscribe(
    { kinds: [30311 as NDKKind], authors: [ndkUser.hexpubkey()] },
    { closeOnEose: false }
  );
  subscription.on("event", (event: NDKEvent) => {
    const streamId = event.tagValue("d");
    const status = event.tagValue("status");
    if (!streamId) return;
    if (status !== "live") return;
    let liveEvent = events[streamId];
    if (!liveEvent) {
      liveEvent = new LiveEvent(ndk);
      events[streamId] = liveEvent;
      const streamProvider = new ReStream(
        process.env.RESTREAM_SERVER || "",
        process.env.RESTREAM_KEY || ""
        // "2954f6ed-17e9-4447-8912-61ac171abb07" // Testing
      );
      liveEvent.setStreamProvider(streamProvider);
    }
    liveEvent.setEvent(event);
    if (!liveEvent.started) {
      liveEvent.start();
    }
  });
};

run();
