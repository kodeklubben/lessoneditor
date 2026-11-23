import { AutosaveController, AutosaveStatus } from "./autosave";

function setup(
  save = jest.fn(async (_text: string): Promise<boolean | "conflict" | "missing"> => true),
) {
  const statuses: AutosaveStatus[] = [];
  const autosave = new AutosaveController({
    save,
    delay: 3000,
    onStatus: (status) => statuses.push(status),
  });
  autosave.reset("start");
  return { autosave, save, statuses };
}

describe("autosave", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("saves the newest text once, 3 s after the last change", async () => {
    const { autosave, save, statuses } = setup();
    autosave.update("a");
    jest.advanceTimersByTime(2000);
    autosave.update("ab");
    jest.advanceTimersByTime(2999);
    expect(save).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    await jest.runAllTimersAsync();
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith("ab");
    expect(statuses).toEqual(["dirty", "saving", "saved"]);
    expect(autosave.isDirty).toBe(false);
  });

  it("does not save text that equals what was loaded, or an empty editor", async () => {
    const { autosave, save } = setup();
    autosave.update("");
    autosave.update("start");
    await jest.runAllTimersAsync();
    expect(save).not.toHaveBeenCalled();
  });

  it("flushes immediately, e.g. before leaving the editor", async () => {
    const { autosave, save } = setup();
    autosave.update("siste ord");
    await expect(autosave.flush()).resolves.toBe(true);
    expect(save).toHaveBeenCalledWith("siste ord");
    expect(autosave.pendingText).toBeUndefined();
  });

  it("saves again when the text changed during a running save", async () => {
    let finish: (ok: boolean) => void = () => undefined;
    const save = jest
      .fn<Promise<boolean>, [string]>()
      .mockImplementationOnce(
        () =>
          new Promise<boolean>((resolve) => {
            finish = resolve;
          }),
      )
      .mockResolvedValue(true);
    const { autosave } = setup(save);
    autosave.update("en");
    const flushing = autosave.flush();
    autosave.update("en to");
    finish(true);
    await flushing;
    await jest.runAllTimersAsync();
    expect(save.mock.calls.map(([text]) => text)).toEqual(["en", "en to"]);
    expect(autosave.isDirty).toBe(false);
  });

  it("reports a failed save instead of saying 'saving' forever, and keeps the text dirty", async () => {
    const { autosave, statuses } = setup(jest.fn(async (_text: string) => false));
    autosave.update("tekst");
    await expect(autosave.flush()).resolves.toBe(false);
    expect(statuses.at(-1)).toBe("error");
    expect(autosave.pendingText).toBe("tekst");
  });

  it("treats a rejected save as an error", async () => {
    const { autosave, statuses } = setup(
      jest.fn(async (_text: string): Promise<boolean> => Promise.reject(new Error("nett"))),
    );
    autosave.update("tekst");
    await autosave.flush();
    expect(statuses.at(-1)).toBe("error");
  });

  it("stops on a text saved elsewhere, and waits for the user instead of retrying", async () => {
    const save = jest.fn(async (_text: string): Promise<boolean | "conflict"> => "conflict");
    const { autosave, statuses } = setup(save);
    autosave.update("min tekst");
    await expect(autosave.flush()).resolves.toBe(false);
    expect(statuses.at(-1)).toBe("conflict");
    // More typing neither saves nor clears the conflict.
    autosave.update("min tekst og mer");
    await jest.advanceTimersByTimeAsync(10000);
    await autosave.flush();
    expect(save).toHaveBeenCalledTimes(1);
    expect(statuses.at(-1)).toBe("conflict");

    // "Behold min tekst": saved again, with the newest text.
    save.mockResolvedValue(true);
    await expect(autosave.retry()).resolves.toBe(true);
    expect(save).toHaveBeenLastCalledWith("min tekst og mer");
    expect(statuses.at(-1)).toBe("saved");
  });

  it("stops on a deleted text, and starts over from a reloaded one", async () => {
    const save = jest.fn(async (_text: string): Promise<boolean | "missing"> => "missing");
    const { autosave, statuses } = setup(save);
    autosave.update("tekst");
    await autosave.flush();
    expect(statuses.at(-1)).toBe("missing");
    autosave.reset("den andre versjonen");
    expect(statuses.at(-1)).toBe("idle");
    expect(autosave.isDirty).toBe(false);
  });
});
