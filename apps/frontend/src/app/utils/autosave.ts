export type AutosaveStatus =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error"
  /** Saved elsewhere meanwhile (another tab, a co-author): waits for the user to choose. */
  | "conflict"
  /** The text is gone (deleted in another tab): saving again cannot help. */
  | "missing";

/** A save that must not be retried: the user has to decide what happens to the text. */
export type SaveRefusal = "conflict" | "missing";

export interface AutosaveOptions {
  /** Saves the text; resolves true on success. Always called with the newest text. */
  save: (text: string) => Promise<boolean | SaveRefusal>;
  onStatus?: (status: AutosaveStatus) => void;
  /** Quiet time after the last change before saving. */
  delay?: number;
}

/**
 * Debounced saving without React closures: the controller always holds the newest text, runs one
 * save at a time, saves again if the text changed while a save was running, and can be flushed
 * before navigating away. Empty text is never saved, so a half-loaded editor cannot wipe a file.
 */
export class AutosaveController {
  private latest: string | undefined;
  private saved: string | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private running: Promise<boolean> | undefined;
  private status: AutosaveStatus = "idle";
  private readonly delay: number;

  constructor(private readonly options: AutosaveOptions) {
    this.delay = options.delay ?? 3000;
  }

  /** The text as loaded from the server: it counts as saved. */
  reset(text: string) {
    this.clearTimer();
    this.latest = text;
    this.saved = text;
    this.setStatus("idle");
  }

  update(text: string) {
    this.latest = text;
    this.clearTimer();
    if (this.status === "conflict" || this.status === "missing") return;
    if (!this.isDirty) {
      if (this.status === "dirty") this.setStatus("idle");
      return;
    }
    this.setStatus("dirty");
    this.timer = setTimeout(() => {
      this.timer = undefined;
      void this.flush();
    }, this.delay);
  }

  /** True while there is text that is not on the server yet. */
  get isDirty(): boolean {
    return !!this.latest && this.latest !== this.saved;
  }

  /** The text that still has to be saved, for a last-resort keepalive request on unload. */
  get pendingText(): string | undefined {
    return this.isDirty ? this.latest : undefined;
  }

  /** Saves now (waiting for a save that is already running). Resolves true when nothing is left. */
  async flush(): Promise<boolean> {
    this.clearTimer();
    while (this.running) await this.running.catch(() => false);
    if (!this.isDirty) return this.status !== "error" || !this.latest;
    // A refused save waits for the user (overwrite or reload), not for the next keystroke.
    if (this.status === "conflict" || this.status === "missing") return false;
    const text = this.latest as string;
    this.setStatus("saving");
    let refusal: SaveRefusal | undefined;
    this.running = this.options
      .save(text)
      .catch(() => false)
      .then((result) => {
        if (result === "conflict" || result === "missing") {
          refusal = result;
          return false;
        }
        if (result) this.saved = text;
        return result;
      });
    const ok = await this.running;
    this.running = undefined;
    if (refusal) {
      this.setStatus(refusal);
      return false;
    }
    if (!ok) {
      this.setStatus("error");
      return false;
    }
    if (this.isDirty) return this.flush();
    this.setStatus("saved");
    return true;
  }

  /** After the user chose to keep their text over the other version: save it again now. */
  retry(): Promise<boolean> {
    this.setStatus("dirty");
    return this.flush();
  }

  dispose() {
    this.clearTimer();
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private setStatus(status: AutosaveStatus) {
    if (status === this.status) return;
    this.status = status;
    this.options.onStatus?.(status);
  }
}
