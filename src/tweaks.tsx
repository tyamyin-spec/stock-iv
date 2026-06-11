// Tweaks panel — floating dev panel for live theme/layout knobs.
// Ported from the design's tweaks-panel.jsx with the Claude Design host protocol intact
// (no-op outside the host).

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

type Edits<T> = Partial<T>;
export type TweakSetter<T> = ((key: keyof T, value: T[keyof T]) => void) & ((edits: Edits<T>) => void);

export function useTweaks<T extends Record<string, any>>(defaults: T): [T, TweakSetter<T>] {
  const [values, setValues] = useState<T>(defaults);
  const setTweak = useCallback(((keyOrEdits: any, val?: any) => {
    const edits: Edits<T> =
      typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : ({ [keyOrEdits]: val } as Edits<T>);
    setValues((prev) => ({ ...prev, ...edits }));
    try {
      window.parent?.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch {}
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }) as TweakSetter<T>, []);
  return [values, setTweak];
}

export function TweaksPanel({ title = 'Tweaks', children }: { title?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    try {
      window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      window.parent?.postMessage({ type: '__edit_mode_dismissed' }, '*');
    } catch {}
  };

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div
        ref={dragRef}
        className="twk-panel"
        data-omelette-chrome=""
        style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
      >
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button
            className="twk-x"
            aria-label="Close tweaks"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={dismiss}
          >
            ✕
          </button>
        </div>
        <div className="twk-body">{children}</div>
      </div>
    </>
  );
}

export function TweakSection({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <>
      <div className="twk-sect">{title}</div>
      {children}
    </>
  );
}

type RowProps = {
  label: ReactNode;
  value?: ReactNode;
  children?: ReactNode;
  inline?: boolean;
};

export function TweakRow({ label, value, children, inline = false }: RowProps) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

type Option<V> = V | { value: V; label: string };

function unwrap<V>(o: Option<V>): { value: V; label: string } {
  if (typeof o === 'object' && o !== null && 'value' in (o as any)) {
    return o as { value: V; label: string };
  }
  return { value: o as V, label: String(o) };
}

export function TweakRadio<V extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: ReactNode;
  value: V;
  options: Option<V>[];
  onChange: (v: V) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const opts = options.map(unwrap);
  const labelLen = (o: Option<V>) => unwrap(o).label.length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const widthByCount: Record<number, number> = { 2: 16, 3: 10 };
  const fitsAsSegments = maxLen <= (widthByCount[options.length] ?? 0);
  if (!fitsAsSegments) {
    return (
      <TweakSelect
        label={label}
        value={value}
        options={options}
        onChange={(s) => {
          const m = opts.find((o) => String(o.value) === String(s));
          onChange(m ? m.value : (s as V));
        }}
      />
    );
  }
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX: number): V => {
    const r = trackRef.current!.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev: PointerEvent) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div
        ref={trackRef}
        role="radiogroup"
        onPointerDown={onPointerDown}
        className={dragging ? 'twk-seg dragging' : 'twk-seg'}
      >
        <div
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {opts.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

export function TweakSelect<V extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: ReactNode;
  value: V;
  options: Option<V>[];
  onChange: (v: V) => void;
}) {
  const opts = options.map(unwrap);
  return (
    <TweakRow label={label}>
      <select
        className="twk-field"
        value={String(value)}
        onChange={(e) => {
          const m = opts.find((o) => String(o.value) === e.target.value);
          onChange(m ? m.value : (e.target.value as unknown as V));
        }}
      >
        {opts.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </TweakRow>
  );
}

function isLight(hex: string) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const Check = ({ light }: { light: boolean }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path
      d="M3 7.2 5.8 10 11 4.2"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={light ? 'rgba(0,0,0,.78)' : '#fff'}
    />
  </svg>
);

export function TweakColor({
  label,
  value,
  options,
  onChange,
}: {
  label: ReactNode;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const cur = String(value).toLowerCase();
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((c, i) => {
          const on = c.toLowerCase() === cur;
          return (
            <button
              key={i}
              type="button"
              className="twk-chip"
              role="radio"
              aria-checked={on}
              data-on={on ? '1' : '0'}
              aria-label={c}
              title={c}
              style={{ background: c } as CSSProperties}
              onClick={() => onChange(c)}
            >
              {on && <Check light={isLight(c)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

export function TweakButton({ children, onClick, secondary = false }: { children: ReactNode; onClick?: () => void; secondary?: boolean }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'} onClick={onClick}>
      {children}
    </button>
  );
}
