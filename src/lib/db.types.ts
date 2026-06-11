// Row types for the database. Hand-written rather than generated so the project
// compiles without `supabase gen types`. Keep in sync with supabase/migrations/0001_init.sql.

export type Ward = {
  id: string;
  code: string;
  name: string;
  color: string;
  default_min: number;
  default_max: number;
  responsible: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type FluidType = {
  code: string;
  tag: string;
  name: string;
  full_name: string | null;
  size_ml: number | null;
  category: 'saline' | 'dextrose' | 'dextrose10' | 'ringer' | 'water';
  default_min: number;
  default_max: number;
  default_price: number;
  created_at: string;
};

export type Price = {
  fluid_code: string;
  price: number;
  updated_at: string;
  updated_by: string | null;
};

export type StockRow = {
  id: string;
  display_code: string;
  fluid_code: string;
  ward_id: string;
  lot: string;
  expiry: string;
  qty: number;
  min_qty: number;
  max_qty: number;
  barcode: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type Movement = {
  id: string;
  stock_id: string | null;
  fluid_code: string;
  ward_id: string | null;
  kind: 'in' | 'out' | 'adjust' | 'discard';
  qty: number;
  note: string | null;
  occurred_at: string;
  by_user: string | null;
};

export type Profile = {
  id: string;
  display_name: string;
  email: string | null;
  ward_id: string | null;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      wards: { Row: Ward; Insert: Partial<Ward> & Pick<Ward, 'code' | 'name'>; Update: Partial<Ward> };
      fluid_types: { Row: FluidType; Insert: FluidType; Update: Partial<FluidType> };
      prices: { Row: Price; Insert: Pick<Price, 'fluid_code' | 'price'>; Update: Partial<Price> };
      stock: {
        Row: StockRow;
        Insert: Omit<StockRow, 'id' | 'created_at' | 'updated_at' | 'created_by'> & {
          id?: string;
          created_by?: string | null;
        };
        Update: Partial<StockRow>;
      };
      movements: {
        Row: Movement;
        Insert: Omit<Movement, 'id' | 'occurred_at' | 'by_user'> & { id?: string; by_user?: string | null };
        Update: Partial<Movement>;
      };
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'id'>; Update: Partial<Profile> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
