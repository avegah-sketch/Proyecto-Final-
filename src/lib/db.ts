import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface DatabaseSchema {
  usuarios: any[];
  productos: any[];
  carritoItems: any[];
  pedidos: any[];
  detallePedidos: any[];
  pagos: any[];
}

const dataInicial: DatabaseSchema = {
  usuarios: [], productos: [], carritoItems: [], pedidos: [], detallePedidos: [], pagos: [],
};

function leerDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      escribirDB(dataInicial);
      return dataInicial;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { ...dataInicial };
  }
}

function escribirDB(data: DatabaseSchema): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function autoIncrement<T extends { id: number }>(items: T[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

export const db = {
  findMany<T extends { id: number }>(coleccion: keyof DatabaseSchema): T[] {
    return leerDB()[coleccion] as T[];
  },
  findById<T extends { id: number }>(coleccion: keyof DatabaseSchema, id: number): T | null {
    const items = leerDB()[coleccion] as T[];
    return items.find((i) => i.id === id) || null;
  },
  create<T extends { id: number }>(coleccion: keyof DatabaseSchema, item: Omit<T, "id">): T {
    const data = leerDB();
    const items = data[coleccion] as any[];
    const nuevoItem = { ...item, id: autoIncrement(items) } as T;
    items.push(nuevoItem);
    escribirDB(data);
    return nuevoItem;
  },
  update<T extends { id: number }>(coleccion: keyof DatabaseSchema, id: number, cambios: Partial<T>): T | null {
    const data = leerDB();
    const items = data[coleccion] as any[];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...cambios };
    escribirDB(data);
    return items[index] as T;
  },
  delete(coleccion: keyof DatabaseSchema, id: number): boolean {
    const data = leerDB();
    const items = data[coleccion] as any[];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    escribirDB(data);
    return true;
  },
  deleteMany(coleccion: keyof DatabaseSchema, ids: number[]): number {
    const data = leerDB();
    const items = data[coleccion] as any[];
    const filtrados = items.filter((i) => !ids.includes(i.id));
    const eliminados = items.length - filtrados.length;
    (data[coleccion] as any[]) = filtrados;
    escribirDB(data);
    return eliminados;
  },
  findWhere<T extends { id: number }>(coleccion: keyof DatabaseSchema, predicate: (item: T) => boolean): T[] {
    return (leerDB()[coleccion] as T[]).filter(predicate);
  },
  reset(): void {
    escribirDB(dataInicial);
  },
};
