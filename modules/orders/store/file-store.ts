import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "../types";
import type { OrderRepository } from "./types";

type Db = Record<string, Order>;

/**
 * JSON-file repository. Good for local development and a single-server deploy.
 * NOT for serverless hosts (their disk is not persistent) – use a database
 * implementation of OrderRepository there.
 */
export function createFileOrderStore(filePath: string): OrderRepository {
  const file = path.resolve(filePath);
  let queue: Promise<unknown> = Promise.resolve();

  /** Serialises every read-modify-write so concurrent requests cannot overwrite each other. */
  const locked = <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };

  const read = async (): Promise<Db> => {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as Db;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return {};
      throw e;
    }
  };

  const write = async (db: Db) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(tmp, file);
  };

  return {
    create: (order) =>
      locked(async () => {
        const db = await read();
        if (db[order.id]) throw new Error(`Order ${order.id} already exists`);
        db[order.id] = order;
        await write(db);
      }),
    get: (id) => locked(async () => (await read())[id] ?? null),
    update: (id, mutate) =>
      locked(async () => {
        const db = await read();
        const current = db[id];
        if (!current) return null;
        const next = mutate(structuredClone(current));
        db[id] = next;
        await write(db);
        return next;
      }),
  };
}
