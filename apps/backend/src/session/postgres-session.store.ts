import { Store, SessionData } from "express-session";
import { LessThan, MoreThan, Repository } from "typeorm";
import { Session } from "./session.entity";

type Callback = (error?: unknown) => void;

/** Uses the existing session table; writes are atomic even with concurrent requests. */
export class PostgresSessionStore extends Store {
  constructor(private readonly repository: Repository<Session>) {
    super();
  }

  get(id: string, callback: (error: unknown, session?: SessionData | null) => void): void {
    this.repository
      .findOne({ where: { id, expiredAt: MoreThan(Date.now()) } })
      .then((session) => callback(null, session ? JSON.parse(session.json) : null))
      .catch((error) => callback(error));
  }

  set(id: string, session: SessionData, callback: Callback = () => {}): void {
    this.repository
      .upsert(
        { id, json: JSON.stringify(session), expiredAt: this.expires(session), deletedAt: null },
        ["id"],
      )
      .then(() => this.repository.delete({ expiredAt: LessThan(Date.now()) }))
      .then(() => callback())
      .catch((error) => callback(error));
  }

  destroy(id: string, callback: Callback = () => {}): void {
    this.repository
      .delete({ id })
      .then(() => callback())
      .catch((error) => callback(error));
  }

  touch(id: string, session: SessionData, callback: Callback = () => {}): void {
    this.repository
      .update({ id }, { expiredAt: this.expires(session) })
      .then(() => callback())
      .catch((error) => callback(error));
  }

  private expires(session: SessionData): number {
    return session.cookie.expires
      ? new Date(session.cookie.expires).getTime()
      : Date.now() + 86400000;
  }
}
