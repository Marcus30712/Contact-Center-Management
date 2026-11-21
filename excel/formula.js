// A small formula calculator: only what Miso's Excel lessons use.
// evaluate('=SUM(D2:D9)', sheet) -> { ok: true, value, cells } or { ok: false, error }.
// It never throws. Cells outside the example table are an error (the lessons
// never point outside it), so a wrong card choice always grades wrong.

class FormulaError extends Error {}
// An error Excel itself would show in the cell (#DIV/0!, #N/A, #VALUE!, #REF!).
// IFERROR catches only these; a limit of this small calculator stays an error.
class ExcelError extends FormulaError {}
const fail = (msg) => { throw new FormulaError(msg); };
const cellError = (msg) => { throw new ExcelError(msg); };

// ---- tokens ----------------------------------------------------------------
const TOKEN = /\s*(?:(\$?[A-Z]{1,2}\$?\d+(?::\$?[A-Z]{1,2}\$?\d+)?)(?![A-Z0-9(])|(\d+(?:\.\d+)?)|("(?:[^"]|"")*")|([A-Z][A-Z0-9.]*)\(|(TRUE|FALSE)\b|(<>|<=|>=|[-+*/&=<>(),]))/y;

function tokenize(src) {
  const out = [];
  TOKEN.lastIndex = 0;
  let pos = 0;
  while (pos < src.length) {
    if (/^\s*$/.test(src.slice(pos))) break;
    TOKEN.lastIndex = pos;
    const m = TOKEN.exec(src);
    if (!m) fail(`unknown text at ${pos}`);
    pos = TOKEN.lastIndex;
    if (m[1]) out.push({ t: 'ref', v: m[1].replace(/\$/g, '') });
    else if (m[2]) out.push({ t: 'num', v: Number(m[2]) });
    else if (m[3]) out.push({ t: 'str', v: m[3].slice(1, -1).replace(/""/g, '"') });
    else if (m[4]) out.push({ t: 'fn', v: m[4] });
    else if (m[5]) out.push({ t: 'bool', v: m[5] === 'TRUE' });
    else out.push({ t: 'op', v: m[6] });
  }
  return out;
}

// ---- parser: comparison < concat < add < mul < unary < primary -------------
function parse(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const isOp = (...ops) => peek()?.t === 'op' && ops.includes(peek().v);
  const take = () => tokens[i++];
  const expect = (v) => { if (!isOp(v)) fail(`expected ${v}`); take(); };

  const binary = (next, ops) => () => {
    let left = next();
    while (isOp(...ops)) {
      const op = take().v;
      left = { k: 'bin', op, a: left, b: next() };
    }
    return left;
  };
  function primary() {
    const tok = take();
    if (!tok) fail('formula ends too early');
    if (tok.t === 'num' || tok.t === 'str' || tok.t === 'bool') return { k: 'lit', v: tok.v };
    if (tok.t === 'ref') return tok.v.includes(':') ? { k: 'range', v: tok.v } : { k: 'cell', v: tok.v };
    if (tok.t === 'fn') {
      const args = [];
      if (!isOp(')')) {
        args.push(comparison());
        while (isOp(',')) { take(); args.push(comparison()); }
      }
      expect(')');
      return { k: 'call', name: tok.v, args };
    }
    if (tok.t === 'op' && tok.v === '(') {
      const inner = comparison();
      expect(')');
      return inner;
    }
    return fail(`unexpected ${tok.v}`);
  }
  function unary() {
    if (isOp('-', '+')) {
      const op = take().v;
      const x = unary();
      return op === '-' ? { k: 'neg', x } : x;
    }
    return primary();
  }
  const mul = binary(unary, ['*', '/']);
  const add = binary(mul, ['+', '-']);
  const concat = binary(add, ['&']);
  const comparison = binary(concat, ['=', '<>', '<', '<=', '>', '>=']);

  const tree = comparison();
  if (i !== tokens.length) fail('extra text after the formula');
  return tree;
}

// ---- sheet access ------------------------------------------------------------
const colNum = (letters) => [...letters].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0);
const colName = (n) => (n > 26 ? colName(Math.floor((n - 1) / 26)) : '') + String.fromCharCode(65 + ((n - 1) % 26));
const split = (addr) => {
  const m = /^([A-Z]+)(\d+)$/.exec(addr);
  return { c: colNum(m[1]), r: Number(m[2]) };
};

function rangeCells(range) {
  const [a, b] = range.split(':').map(split);
  const rows = [];
  for (let r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r += 1) {
    const row = [];
    for (let c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c += 1) row.push(`${colName(c)}${r}`);
    rows.push(row);
  }
  return rows;
}

// ---- evaluation ----------------------------------------------------------------
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v) => {
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (!isNum(v)) cellError('not a number');
  return v;
};
const text = (v) => (typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : String(v));

function criterion(raw) {
  const s = text(raw);
  const m = /^(<>|<=|>=|<|>|=)?(.*)$/.exec(s);
  const op = m[1] || '=';
  const rhs = m[2];
  const n = rhs !== '' && !Number.isNaN(Number(rhs)) ? Number(rhs) : null;
  return (v) => {
    if (n !== null && isNum(v)) {
      return { '=': v === n, '<>': v !== n, '<': v < n, '<=': v <= n, '>': v > n, '>=': v >= n }[op];
    }
    // A number stored as text matches an equality condition, as in Excel.
    if (n !== null && typeof v === 'string' && v.trim() !== '' && Number(v) === n && (op === '=' || op === '<>')) return op === '=';
    if (n !== null) return op === '<>';
    const eq = String(v).toLowerCase() === rhs.toLowerCase();
    if (op === '=') return eq;
    if (op === '<>') return !eq;
    return false;
  };
}

function textFormat(value, fmt) {
  const v = num(value);
  if (fmt === '0%') return `${Math.round(v * 100)}%`;
  if (fmt === '0.0%') return `${(Math.round(v * 1000) / 10).toFixed(1)}%`;
  if (fmt === 'm:ss') {
    const total = Math.round(v * 86400);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return fail('format not covered');
}

export function evaluate(formula, sheet) {
  const used = [];
  const read = (addr) => {
    if (!Object.hasOwn(sheet.cells, addr)) fail(`${addr} is outside the table`);
    if (!used.includes(addr)) used.push(addr);
    return sheet.cells[addr];
  };
  const grid = (node) => {
    if (node.k !== 'range') fail('a range is needed here');
    return rangeCells(node.v).map((row) => row.map((a) => ({ addr: a, v: read(a) })));
  };
  const flat = (node) => grid(node).flat();
  const values = (args) => args.flatMap((a) => (a.k === 'range' ? flat(a).map((c) => c.v) : [ev(a)]));
  const numbers = (args) => values(args).filter(isNum);
  const pairs = (args, start) => {
    const out = [];
    for (let i = start; i < args.length; i += 2) {
      if (!args[i + 1]) fail('a condition is missing');
      out.push({ cells: flat(args[i]), test: criterion(ev(args[i + 1])) });
    }
    if (!out.length) fail('a condition is missing');
    return out;
  };
  const matching = (len, conds) => {
    if (conds.some((c) => c.cells.length !== len)) cellError('ranges differ in size');
    return [...Array(len).keys()].filter((i) => conds.every((c) => c.test(c.cells[i].v)));
  };
  const logical = (args) => {
    if (!args.length) fail('wrong number of values');
    const out = [];
    for (const x of args) {
      if (x.k === 'range') {
        for (const c of flat(x)) if (typeof c.v === 'boolean' || isNum(c.v)) out.push(truthy(c.v));
      } else {
        const v = ev(x);
        if (typeof v === 'string') cellError('not a number');
        out.push(truthy(v));
      }
    }
    if (!out.length) cellError('not a number');
    return out;
  };
  const truthy = (v) => (typeof v === 'boolean' ? v : num(v) !== 0);
  const arity = (args, min, max = min) => { if (args.length < min || args.length > max) fail('wrong number of values'); };

  const FN = {
    SUM: (a) => numbers(a).reduce((s, x) => s + x, 0),
    AVERAGE: (a) => { const n = numbers(a); if (!n.length) cellError('nothing to average'); return n.reduce((s, x) => s + x, 0) / n.length; },
    MIN: (a) => { const n = numbers(a); if (!n.length) fail('no numbers'); return Math.min(...n); },
    MAX: (a) => { const n = numbers(a); if (!n.length) fail('no numbers'); return Math.max(...n); },
    COUNT: (a) => numbers(a).length,
    ROUND: (a) => { arity(a, 2); const d = Math.trunc(num(ev(a[1]))); const f = 10 ** d; const x = num(ev(a[0])); return Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9) / f; },
    INT: (a) => { arity(a, 1); return Math.floor(num(ev(a[0]))); },
    MOD: (a) => { arity(a, 2); const d = num(ev(a[1])); if (d === 0) cellError('divide by zero'); const x = num(ev(a[0])); return x - d * Math.floor(x / d); },
    COUNTIF: (a) => { arity(a, 2); const c = pairs(a, 0); return matching(c[0].cells.length, c).length; },
    COUNTIFS: (a) => { if (a.length < 2 || a.length % 2) fail('wrong number of values'); const c = pairs(a, 0); return matching(c[0].cells.length, c).length; },
    SUMIF: (a) => {
      arity(a, 2, 3);
      const c = pairs(a.slice(0, 2), 0);
      const target = a[2] ? flat(a[2]) : c[0].cells;
      return matching(target.length, c).map((i) => target[i].v).filter(isNum).reduce((s, x) => s + x, 0);
    },
    SUMIFS: (a) => {
      if (a.length < 3 || a.length % 2 === 0) fail('wrong number of values');
      const target = flat(a[0]);
      return matching(target.length, pairs(a, 1)).map((i) => target[i].v).filter(isNum).reduce((s, x) => s + x, 0);
    },
    AVERAGEIFS: (a) => {
      if (a.length < 3 || a.length % 2 === 0) fail('wrong number of values');
      const target = flat(a[0]);
      const n = matching(target.length, pairs(a, 1)).map((i) => target[i].v).filter(isNum);
      if (!n.length) cellError('nothing to average');
      return n.reduce((s, x) => s + x, 0) / n.length;
    },
    IF: (a) => { arity(a, 2, 3); const ok = truthy(ev(a[0])); return ok ? ev(a[1]) : (a[2] ? ev(a[2]) : false); },
    XLOOKUP: (a) => {
      arity(a, 3);
      const key = ev(a[0]);
      const look = flat(a[1]);
      const ret = flat(a[2]);
      if (look.length !== ret.length) cellError('ranges differ in size');
      const i = look.findIndex((c) => criterion(`=${text(key)}`)(c.v) && typeof c.v === typeof key);
      if (i < 0) cellError('not found');
      return ret[i].v;
    },
    VLOOKUP: (a) => {
      arity(a, 3, 4);
      const key = ev(a[0]);
      const rows = grid(a[1]);
      const col = num(ev(a[2]));
      if (a.length === 4 && ev(a[3]) !== false) fail('only exact match is covered');
      if (a.length === 3) fail('only exact match is covered');
      if (col < 1 || col > rows[0].length || !Number.isInteger(col)) cellError('column out of range');
      const row = rows.find((r) => (typeof r[0].v === 'string' && typeof key === 'string' ? r[0].v.toLowerCase() === key.toLowerCase() : r[0].v === key));
      if (!row) cellError('not found');
      return row[col - 1].v;
    },
    TEXT: (a) => { arity(a, 2); return textFormat(ev(a[0]), text(ev(a[1]))); },
    // As in Excel: every condition is worked out (an error in any one is the
    // result); in a range, numbers and TRUE/FALSE count and text is skipped.
    AND: (a) => logical(a).every(Boolean),
    OR: (a) => logical(a).some(Boolean),
    // The second value is used only when working out the first one fails.
    IFERROR: (a) => {
      arity(a, 2);
      try {
        return ev(a[0]);
      } catch (e) {
        if (!(e instanceof ExcelError)) throw e;
        return ev(a[1]);
      }
    },
  };

  // Excel's order across kinds: numbers < text < TRUE/FALSE; text ignores case.
  function compare(op, x, y) {
    const kind = (v) => (typeof v === 'number' ? 0 : typeof v === 'string' ? 1 : 2);
    let c;
    if (kind(x) !== kind(y)) c = kind(x) - kind(y);
    else if (kind(x) === 0) c = x - y;
    else if (kind(x) === 1) { const a = x.toLowerCase(); const b = y.toLowerCase(); c = a < b ? -1 : a > b ? 1 : 0; }
    else c = Number(x) - Number(y);
    return { '=': c === 0, '<>': c !== 0, '<': c < 0, '<=': c <= 0, '>': c > 0, '>=': c >= 0 }[op];
  }

  function ev(node) {
    switch (node.k) {
      case 'lit': return node.v;
      case 'cell': return read(node.v);
      case 'range': return cellError('a single value is needed here');
      case 'neg': return -num(ev(node.x));
      case 'call': {
        const f = FN[node.name];
        if (!f) fail(`${node.name} is not covered`);
        return f(node.args);
      }
      case 'bin': {
        const x = ev(node.a);
        const y = ev(node.b);
        switch (node.op) {
          case '+': return num(x) + num(y);
          case '-': return num(x) - num(y);
          case '*': return num(x) * num(y);
          case '/': if (num(y) === 0) cellError('divide by zero'); return num(x) / num(y);
          case '&': return text(x) + text(y);
          default: return compare(node.op, x, y);
        }
      }
      default: return fail('unknown');
    }
  }

  try {
    if (typeof formula !== 'string' || !formula.startsWith('=')) fail('a formula starts with =');
    const tree = parse(tokenize(formula.slice(1)));
    const value = ev(tree);
    if (typeof value === 'number' && !Number.isFinite(value)) cellError('not a number');
    return { ok: true, value, cells: used };
  } catch (err) {
    if (err instanceof FormulaError) return { ok: false, error: err.message };
    return { ok: false, error: 'could not read the formula' };
  }
}
