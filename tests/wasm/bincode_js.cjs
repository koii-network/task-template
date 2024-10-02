let imports = {};
imports["__wbindgen_placeholder__"] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

let cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
  if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
  }
  return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder("utf-8");

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}
/**
 * @param {any} val
 * @returns {any}
 */
module.exports.bincode_js_deserialize = function (val) {
  const ret = wasm.bincode_js_deserialize(addHeapObject(val));
  return takeObject(ret);
};

/**
 * @param {any} val
 * @returns {any}
 */
module.exports.borsh_bpf_js_deserialize = function (val) {
  const ret = wasm.borsh_bpf_js_deserialize(addHeapObject(val));
  return takeObject(ret);
};

/**
 * Initialize Javascript logging and panic handler
 */
module.exports.solana_program_init = function () {
  wasm.solana_program_init();
};

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  const mem = getUint32Memory0();
  for (let i = 0; i < array.length; i++) {
    mem[ptr / 4 + i] = addHeapObject(array[i]);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}
/**
 * A hash; the 32-byte output of a hashing algorithm.
 *
 * This struct is used most often in `solana-sdk` and related crates to contain
 * a [SHA-256] hash, but may instead contain a [blake3] hash, as created by the
 * [`blake3`] module (and used in [`Message::hash`]).
 *
 * [SHA-256]: https://en.wikipedia.org/wiki/SHA-2
 * [blake3]: https://github.com/BLAKE3-team/BLAKE3
 * [`blake3`]: crate::blake3
 * [`Message::hash`]: crate::message::Message::hash
 */
class Hash {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Hash.prototype);
    obj.__wbg_ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_hash_free(ptr);
  }
  /**
   * Create a new Hash object
   *
   * * `value` - optional hash as a base58 encoded string, `Uint8Array`, `[number]`
   * @param {any} value
   */
  constructor(value) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.hash_constructor(retptr, addHeapObject(value));
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Hash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Return the base58 string representation of the hash
   * @returns {string}
   */
  toString() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.hash_toString(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Checks if two `Hash`s are equal
   * @param {Hash} other
   * @returns {boolean}
   */
  equals(other) {
    _assertClass(other, Hash);
    const ret = wasm.hash_equals(this.__wbg_ptr, other.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Return the `Uint8Array` representation of the hash
   * @returns {Uint8Array}
   */
  toBytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.hash_toBytes(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
module.exports.Hash = Hash;
/**
 * A directive for a single invocation of a Solana program.
 *
 * An instruction specifies which program it is calling, which accounts it may
 * read or modify, and additional data that serves as input to the program. One
 * or more instructions are included in transactions submitted by Solana
 * clients. Instructions are also used to describe [cross-program
 * invocations][cpi].
 *
 * [cpi]: https://docs.solana.com/developing/programming-model/calling-between-programs
 *
 * During execution, a program will receive a list of account data as one of
 * its arguments, in the same order as specified during `Instruction`
 * construction.
 *
 * While Solana is agnostic to the format of the instruction data, it has
 * built-in support for serialization via [`borsh`] and [`bincode`].
 *
 * [`borsh`]: https://docs.rs/borsh/latest/borsh/
 * [`bincode`]: https://docs.rs/bincode/latest/bincode/
 *
 * # Specifying account metadata
 *
 * When constructing an [`Instruction`], a list of all accounts that may be
 * read or written during the execution of that instruction must be supplied as
 * [`AccountMeta`] values.
 *
 * Any account whose data may be mutated by the program during execution must
 * be specified as writable. During execution, writing to an account that was
 * not specified as writable will cause the transaction to fail. Writing to an
 * account that is not owned by the program will cause the transaction to fail.
 *
 * Any account whose lamport balance may be mutated by the program during
 * execution must be specified as writable. During execution, mutating the
 * lamports of an account that was not specified as writable will cause the
 * transaction to fail. While _subtracting_ lamports from an account not owned
 * by the program will cause the transaction to fail, _adding_ lamports to any
 * account is allowed, as long is it is mutable.
 *
 * Accounts that are not read or written by the program may still be specified
 * in an `Instruction`'s account list. These will affect scheduling of program
 * execution by the runtime, but will otherwise be ignored.
 *
 * When building a transaction, the Solana runtime coalesces all accounts used
 * by all instructions in that transaction, along with accounts and permissions
 * required by the runtime, into a single account list. Some accounts and
 * account permissions required by the runtime to process a transaction are
 * _not_ required to be included in an `Instruction`s account list. These
 * include:
 *
 * - The program ID &mdash; it is a separate field of `Instruction`
 * - The transaction's fee-paying account &mdash; it is added during [`Message`]
 *   construction. A program may still require the fee payer as part of the
 *   account list if it directly references it.
 *
 * [`Message`]: crate::message::Message
 *
 * Programs may require signatures from some accounts, in which case they
 * should be specified as signers during `Instruction` construction. The
 * program must still validate during execution that the account is a signer.
 */
class Instruction {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Instruction.prototype);
    obj.__wbg_ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_instruction_free(ptr);
  }
}
module.exports.Instruction = Instruction;
/**
 */
class Instructions {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Instructions.prototype);
    obj.__wbg_ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_instructions_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.instructions_constructor();
    return Instructions.__wrap(ret);
  }
  /**
   * @param {Instruction} instruction
   */
  push(instruction) {
    _assertClass(instruction, Instruction);
    var ptr0 = instruction.__destroy_into_raw();
    wasm.instructions_push(this.__wbg_ptr, ptr0);
  }
}
module.exports.Instructions = Instructions;
/**
 * A Solana transaction message (legacy).
 *
 * See the [`message`] module documentation for further description.
 *
 * [`message`]: crate::message
 *
 * Some constructors accept an optional `payer`, the account responsible for
 * paying the cost of executing a transaction. In most cases, callers should
 * specify the payer explicitly in these constructors. In some cases though,
 * the caller is not _required_ to specify the payer, but is still allowed to:
 * in the `Message` structure, the first account is always the fee-payer, so if
 * the caller has knowledge that the first account of the constructed
 * transaction's `Message` is both a signer and the expected fee-payer, then
 * redundantly specifying the fee-payer is not strictly required.
 */
class Message {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_message_free(ptr);
  }
  /**
   * The id of a recent ledger entry.
   * @returns {Hash}
   */
  get recent_blockhash() {
    const ret = wasm.__wbg_get_message_recent_blockhash(this.__wbg_ptr);
    return Hash.__wrap(ret);
  }
  /**
   * The id of a recent ledger entry.
   * @param {Hash} arg0
   */
  set recent_blockhash(arg0) {
    _assertClass(arg0, Hash);
    var ptr0 = arg0.__destroy_into_raw();
    wasm.__wbg_set_message_recent_blockhash(this.__wbg_ptr, ptr0);
  }
}
module.exports.Message = Message;
/**
 * The address of a [Solana account][acc].
 *
 * Some account addresses are [ed25519] public keys, with corresponding secret
 * keys that are managed off-chain. Often, though, account addresses do not
 * have corresponding secret keys &mdash; as with [_program derived
 * addresses_][pdas] &mdash; or the secret key is not relevant to the operation
 * of a program, and may have even been disposed of. As running Solana programs
 * can not safely create or manage secret keys, the full [`Keypair`] is not
 * defined in `solana-program` but in `solana-sdk`.
 *
 * [acc]: https://docs.solana.com/developing/programming-model/accounts
 * [ed25519]: https://ed25519.cr.yp.to/
 * [pdas]: https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses
 * [`Keypair`]: https://docs.rs/solana-sdk/latest/solana_sdk/signer/keypair/struct.Keypair.html
 */
class Pubkey {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Pubkey.prototype);
    obj.__wbg_ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_pubkey_free(ptr);
  }
  /**
   * Create a new Pubkey object
   *
   * * `value` - optional public key as a base58 encoded string, `Uint8Array`, `[number]`
   * @param {any} value
   */
  constructor(value) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.pubkey_constructor(retptr, addHeapObject(value));
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Pubkey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Return the base58 string representation of the public key
   * @returns {string}
   */
  toString() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.pubkey_toString(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Check if a `Pubkey` is on the ed25519 curve.
   * @returns {boolean}
   */
  isOnCurve() {
    const ret = wasm.pubkey_isOnCurve(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Checks if two `Pubkey`s are equal
   * @param {Pubkey} other
   * @returns {boolean}
   */
  equals(other) {
    _assertClass(other, Pubkey);
    const ret = wasm.pubkey_equals(this.__wbg_ptr, other.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Return the `Uint8Array` representation of the public key
   * @returns {Uint8Array}
   */
  toBytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.pubkey_toBytes(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Derive a Pubkey from another Pubkey, string seed, and a program id
   * @param {Pubkey} base
   * @param {string} seed
   * @param {Pubkey} owner
   * @returns {Pubkey}
   */
  static createWithSeed(base, seed, owner) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(base, Pubkey);
      const ptr0 = passStringToWasm0(
        seed,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      _assertClass(owner, Pubkey);
      wasm.pubkey_createWithSeed(
        retptr,
        base.__wbg_ptr,
        ptr0,
        len0,
        owner.__wbg_ptr,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Pubkey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Derive a program address from seeds and a program id
   * @param {any[]} seeds
   * @param {Pubkey} program_id
   * @returns {Pubkey}
   */
  static createProgramAddress(seeds, program_id) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArrayJsValueToWasm0(seeds, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      _assertClass(program_id, Pubkey);
      wasm.pubkey_createProgramAddress(
        retptr,
        ptr0,
        len0,
        program_id.__wbg_ptr,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Pubkey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Find a valid program address
   *
   * Returns:
   * * `[PubKey, number]` - the program address and bump seed
   * @param {any[]} seeds
   * @param {Pubkey} program_id
   * @returns {any}
   */
  static findProgramAddress(seeds, program_id) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArrayJsValueToWasm0(seeds, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      _assertClass(program_id, Pubkey);
      wasm.pubkey_findProgramAddress(retptr, ptr0, len0, program_id.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
module.exports.Pubkey = Pubkey;

class SystemInstruction {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_systeminstruction_free(ptr);
  }
  /**
   * @param {Pubkey} from_pubkey
   * @param {Pubkey} to_pubkey
   * @param {bigint} lamports
   * @param {bigint} space
   * @param {Pubkey} owner
   * @returns {Instruction}
   */
  static createAccount(from_pubkey, to_pubkey, lamports, space, owner) {
    _assertClass(from_pubkey, Pubkey);
    _assertClass(to_pubkey, Pubkey);
    _assertClass(owner, Pubkey);
    const ret = wasm.systeminstruction_createAccount(
      from_pubkey.__wbg_ptr,
      to_pubkey.__wbg_ptr,
      lamports,
      space,
      owner.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} from_pubkey
   * @param {Pubkey} to_pubkey
   * @param {Pubkey} base
   * @param {string} seed
   * @param {bigint} lamports
   * @param {bigint} space
   * @param {Pubkey} owner
   * @returns {Instruction}
   */
  static createAccountWithSeed(
    from_pubkey,
    to_pubkey,
    base,
    seed,
    lamports,
    space,
    owner,
  ) {
    _assertClass(from_pubkey, Pubkey);
    _assertClass(to_pubkey, Pubkey);
    _assertClass(base, Pubkey);
    const ptr0 = passStringToWasm0(
      seed,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(owner, Pubkey);
    const ret = wasm.systeminstruction_createAccountWithSeed(
      from_pubkey.__wbg_ptr,
      to_pubkey.__wbg_ptr,
      base.__wbg_ptr,
      ptr0,
      len0,
      lamports,
      space,
      owner.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} pubkey
   * @param {Pubkey} owner
   * @returns {Instruction}
   */
  static assign(pubkey, owner) {
    _assertClass(pubkey, Pubkey);
    _assertClass(owner, Pubkey);
    const ret = wasm.systeminstruction_assign(
      pubkey.__wbg_ptr,
      owner.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} pubkey
   * @param {Pubkey} base
   * @param {string} seed
   * @param {Pubkey} owner
   * @returns {Instruction}
   */
  static assignWithSeed(pubkey, base, seed, owner) {
    _assertClass(pubkey, Pubkey);
    _assertClass(base, Pubkey);
    const ptr0 = passStringToWasm0(
      seed,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(owner, Pubkey);
    const ret = wasm.systeminstruction_assignWithSeed(
      pubkey.__wbg_ptr,
      base.__wbg_ptr,
      ptr0,
      len0,
      owner.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} from_pubkey
   * @param {Pubkey} to_pubkey
   * @param {bigint} lamports
   * @returns {Instruction}
   */
  static transfer(from_pubkey, to_pubkey, lamports) {
    _assertClass(from_pubkey, Pubkey);
    _assertClass(to_pubkey, Pubkey);
    const ret = wasm.systeminstruction_transfer(
      from_pubkey.__wbg_ptr,
      to_pubkey.__wbg_ptr,
      lamports,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} from_pubkey
   * @param {Pubkey} from_base
   * @param {string} from_seed
   * @param {Pubkey} from_owner
   * @param {Pubkey} to_pubkey
   * @param {bigint} lamports
   * @returns {Instruction}
   */
  static transferWithSeed(
    from_pubkey,
    from_base,
    from_seed,
    from_owner,
    to_pubkey,
    lamports,
  ) {
    _assertClass(from_pubkey, Pubkey);
    _assertClass(from_base, Pubkey);
    const ptr0 = passStringToWasm0(
      from_seed,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(from_owner, Pubkey);
    _assertClass(to_pubkey, Pubkey);
    const ret = wasm.systeminstruction_transferWithSeed(
      from_pubkey.__wbg_ptr,
      from_base.__wbg_ptr,
      ptr0,
      len0,
      from_owner.__wbg_ptr,
      to_pubkey.__wbg_ptr,
      lamports,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} pubkey
   * @param {bigint} space
   * @returns {Instruction}
   */
  static allocate(pubkey, space) {
    _assertClass(pubkey, Pubkey);
    const ret = wasm.systeminstruction_allocate(pubkey.__wbg_ptr, space);
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} address
   * @param {Pubkey} base
   * @param {string} seed
   * @param {bigint} space
   * @param {Pubkey} owner
   * @returns {Instruction}
   */
  static allocateWithSeed(address, base, seed, space, owner) {
    _assertClass(address, Pubkey);
    _assertClass(base, Pubkey);
    const ptr0 = passStringToWasm0(
      seed,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(owner, Pubkey);
    const ret = wasm.systeminstruction_allocateWithSeed(
      address.__wbg_ptr,
      base.__wbg_ptr,
      ptr0,
      len0,
      space,
      owner.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} from_pubkey
   * @param {Pubkey} nonce_pubkey
   * @param {Pubkey} authority
   * @param {bigint} lamports
   * @returns {Array<any>}
   */
  static createNonceAccount(from_pubkey, nonce_pubkey, authority, lamports) {
    _assertClass(from_pubkey, Pubkey);
    _assertClass(nonce_pubkey, Pubkey);
    _assertClass(authority, Pubkey);
    const ret = wasm.systeminstruction_createNonceAccount(
      from_pubkey.__wbg_ptr,
      nonce_pubkey.__wbg_ptr,
      authority.__wbg_ptr,
      lamports,
    );
    return takeObject(ret);
  }
  /**
   * @param {Pubkey} nonce_pubkey
   * @param {Pubkey} authorized_pubkey
   * @returns {Instruction}
   */
  static advanceNonceAccount(nonce_pubkey, authorized_pubkey) {
    _assertClass(nonce_pubkey, Pubkey);
    _assertClass(authorized_pubkey, Pubkey);
    const ret = wasm.systeminstruction_advanceNonceAccount(
      nonce_pubkey.__wbg_ptr,
      authorized_pubkey.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} nonce_pubkey
   * @param {Pubkey} authorized_pubkey
   * @param {Pubkey} to_pubkey
   * @param {bigint} lamports
   * @returns {Instruction}
   */
  static withdrawNonceAccount(
    nonce_pubkey,
    authorized_pubkey,
    to_pubkey,
    lamports,
  ) {
    _assertClass(nonce_pubkey, Pubkey);
    _assertClass(authorized_pubkey, Pubkey);
    _assertClass(to_pubkey, Pubkey);
    const ret = wasm.systeminstruction_withdrawNonceAccount(
      nonce_pubkey.__wbg_ptr,
      authorized_pubkey.__wbg_ptr,
      to_pubkey.__wbg_ptr,
      lamports,
    );
    return Instruction.__wrap(ret);
  }
  /**
   * @param {Pubkey} nonce_pubkey
   * @param {Pubkey} authorized_pubkey
   * @param {Pubkey} new_authority
   * @returns {Instruction}
   */
  static authorizeNonceAccount(nonce_pubkey, authorized_pubkey, new_authority) {
    _assertClass(nonce_pubkey, Pubkey);
    _assertClass(authorized_pubkey, Pubkey);
    _assertClass(new_authority, Pubkey);
    const ret = wasm.systeminstruction_authorizeNonceAccount(
      nonce_pubkey.__wbg_ptr,
      authorized_pubkey.__wbg_ptr,
      new_authority.__wbg_ptr,
    );
    return Instruction.__wrap(ret);
  }
}
module.exports.SystemInstruction = SystemInstruction;

module.exports.__wbindgen_error_new = function (arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
};

module.exports.__wbindgen_object_drop_ref = function (arg0) {
  takeObject(arg0);
};

module.exports.__wbg_log_fb911463b057a706 = function (arg0, arg1) {
  console.log(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_number_new = function (arg0) {
  const ret = arg0;
  return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_from_u64 = function (arg0) {
  const ret = BigInt.asUintN(64, arg0);
  return addHeapObject(ret);
};

module.exports.__wbindgen_string_new = function (arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function (arg0) {
  const ret = getObject(arg0);
  return addHeapObject(ret);
};

module.exports.__wbindgen_is_object = function (arg0) {
  const val = getObject(arg0);
  const ret = typeof val === "object" && val !== null;
  return ret;
};

module.exports.__wbindgen_jsval_loose_eq = function (arg0, arg1) {
  const ret = getObject(arg0) == getObject(arg1);
  return ret;
};

module.exports.__wbindgen_boolean_get = function (arg0) {
  const v = getObject(arg0);
  const ret = typeof v === "boolean" ? (v ? 1 : 0) : 2;
  return ret;
};

module.exports.__wbindgen_number_get = function (arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === "number" ? obj : undefined;
  getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_string_get = function (arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === "string" ? obj : undefined;
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbg_set_20cbc34131e76824 = function (arg0, arg1, arg2) {
  getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

module.exports.__wbg_instruction_new = function (arg0) {
  const ret = Instruction.__wrap(arg0);
  return addHeapObject(ret);
};

module.exports.__wbg_pubkey_new = function (arg0) {
  const ret = Pubkey.__wrap(arg0);
  return addHeapObject(ret);
};

module.exports.__wbindgen_is_undefined = function (arg0) {
  const ret = getObject(arg0) === undefined;
  return ret;
};

module.exports.__wbg_debug_9a6b3243fbbebb61 = function (arg0) {
  console.debug(getObject(arg0));
};

module.exports.__wbg_error_788ae33f81d3b84b = function (arg0) {
  console.error(getObject(arg0));
};

module.exports.__wbg_info_2e30e8204b29d91d = function (arg0) {
  console.info(getObject(arg0));
};

module.exports.__wbg_log_1d3ae0273d8f4f8a = function (arg0) {
  console.log(getObject(arg0));
};

module.exports.__wbg_warn_d60e832f9882c1b2 = function (arg0) {
  console.warn(getObject(arg0));
};

module.exports.__wbg_new_abda76e883ba8a5f = function () {
  const ret = new Error();
  return addHeapObject(ret);
};

module.exports.__wbg_stack_658279fe44541cf6 = function (arg0, arg1) {
  const ret = getObject(arg1).stack;
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbg_error_f851667af71bcfc6 = function (arg0, arg1) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg0;
    deferred0_1 = arg1;
    console.error(getStringFromWasm0(arg0, arg1));
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
};

module.exports.__wbindgen_is_string = function (arg0) {
  const ret = typeof getObject(arg0) === "string";
  return ret;
};

module.exports.__wbg_get_44be0491f933a435 = function (arg0, arg1) {
  const ret = getObject(arg0)[arg1 >>> 0];
  return addHeapObject(ret);
};

module.exports.__wbg_length_fff51ee6522a1a18 = function (arg0) {
  const ret = getObject(arg0).length;
  return ret;
};

module.exports.__wbg_new_898a68150f225f2e = function () {
  const ret = new Array();
  return addHeapObject(ret);
};

module.exports.__wbindgen_is_function = function (arg0) {
  const ret = typeof getObject(arg0) === "function";
  return ret;
};

module.exports.__wbg_new_56693dbed0c32988 = function () {
  const ret = new Map();
  return addHeapObject(ret);
};

module.exports.__wbg_next_526fc47e980da008 = function (arg0) {
  const ret = getObject(arg0).next;
  return addHeapObject(ret);
};

module.exports.__wbg_next_ddb3312ca1c4e32a = function () {
  return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_done_5c1f01fb660d73b5 = function (arg0) {
  const ret = getObject(arg0).done;
  return ret;
};

module.exports.__wbg_value_1695675138684bd5 = function (arg0) {
  const ret = getObject(arg0).value;
  return addHeapObject(ret);
};

module.exports.__wbg_iterator_97f0c81209c6c35a = function () {
  const ret = Symbol.iterator;
  return addHeapObject(ret);
};

module.exports.__wbg_get_97b561fb56f034b5 = function () {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_call_cb65541d95d71282 = function () {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_new_b51585de1b234aff = function () {
  const ret = new Object();
  return addHeapObject(ret);
};

module.exports.__wbg_newwithlength_3ec098a360da1909 = function (arg0) {
  const ret = new Array(arg0 >>> 0);
  return addHeapObject(ret);
};

module.exports.__wbg_set_502d29070ea18557 = function (arg0, arg1, arg2) {
  getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

module.exports.__wbg_isArray_4c24b343cb13cfb1 = function (arg0) {
  const ret = Array.isArray(getObject(arg0));
  return ret;
};

module.exports.__wbg_push_ca1c26067ef907ac = function (arg0, arg1) {
  const ret = getObject(arg0).push(getObject(arg1));
  return ret;
};

module.exports.__wbg_instanceof_ArrayBuffer_39ac22089b74fddb = function (arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof ArrayBuffer;
  } catch {
    result = false;
  }
  const ret = result;
  return ret;
};

module.exports.__wbg_values_e80af618f92c8649 = function (arg0) {
  const ret = getObject(arg0).values();
  return addHeapObject(ret);
};

module.exports.__wbg_set_bedc3d02d0f05eb0 = function (arg0, arg1, arg2) {
  const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
  return addHeapObject(ret);
};

module.exports.__wbg_isSafeInteger_bb8e18dd21c97288 = function (arg0) {
  const ret = Number.isSafeInteger(getObject(arg0));
  return ret;
};

module.exports.__wbg_buffer_085ec1f694018c4f = function (arg0) {
  const ret = getObject(arg0).buffer;
  return addHeapObject(ret);
};

module.exports.__wbg_new_8125e318e6245eed = function (arg0) {
  const ret = new Uint8Array(getObject(arg0));
  return addHeapObject(ret);
};

module.exports.__wbg_set_5cf90238115182c3 = function (arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_length_72e2208bbc0efc61 = function (arg0) {
  const ret = getObject(arg0).length;
  return ret;
};

module.exports.__wbg_instanceof_Uint8Array_d8d9cb2b8e8ac1d4 = function (arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof Uint8Array;
  } catch {
    result = false;
  }
  const ret = result;
  return ret;
};

module.exports.__wbindgen_debug_string = function (arg0, arg1) {
  const ret = debugString(getObject(arg1));
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbindgen_throw = function (arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_memory = function () {
  const ret = wasm.memory;
  return addHeapObject(ret);
};

const path = require("path").join(__dirname, "bincode_js_bg.wasm");
const bytes = require("fs").readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
