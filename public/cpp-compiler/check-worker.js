/* global API */
importScripts('./shared.js');

let sysroot;
const modules = new Map();

async function readAsset(name) {
  try {
    const response = await fetch(new URL(name, self.location.href));
    if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
    // Keep gzip bytes intact across static servers that auto-decode .gz URLs.
    if (!name.endsWith('.gz.bin')) return await response.arrayBuffer();
    const stream = response.body.pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).arrayBuffer();
  } catch (error) {
    throw new Error(`無法讀取 ${name}（${error.message}）`);
  }
}

async function loadModule(name) {
  if (!modules.has(name)) modules.set(name, await WebAssembly.compile(await readAsset(name)));
  return modules.get(name);
}

self.onmessage = async ({ data }) => {
  const source = typeof data === 'string' ? data : data.source;
  const tracing = typeof data !== 'string' && data.type === 'trace';
  const syntaxOnly = typeof data !== 'string' && data.type === 'syntax';
  let log = '';
  let phase = 'loading';
  try {
    const api = new API({
      clang: 'clang22-noeh.gz.bin',
      lld: 'lld22-noeh.gz.bin',
      memfs: 'memfs.wasm',
      sysroot: 'sysroot22.tar.gz.bin',
      clangResourceInclude: '/lib/clang/22/include',
      clangExtraArgs: [
        '-internal-isystem', '/include/wasm32-wasip1/noeh/c++/v1',
        '-internal-isystem', '/include/wasm32-wasip1',
      ],
      lldLibdir: 'lib/wasm32-wasip1',
      lldFlags: [],
      lldLibs: ['-lc', '-lc++', '-lc++abi', '-lclang_rt.builtins'],
      async readBuffer(name) {
        sysroot ??= await readAsset(name);
        return sysroot;
      },
      compileStreaming: loadModule,
      hostWrite(text) {
        text = text.replace(/\x1b\[[0-9;]*m/g, '');
        const limit = phase === 'trace' ? 2_000_000 : 16_000;
        if (log.length < limit) log += text.slice(0, limit - log.length);
      },
    });
    api.hostLog = () => {};
    api.hostLogAsync = (_message, promise) => promise;
    api.clangCommonArgs = api.clangCommonArgs.filter((flag) => flag !== '-fcolor-diagnostics');
    api.clangCommonArgs.push('-std=c++17', '-Wall', '-Wextra', '-fdiagnostics-parseable-fixits');
    await api.ready;
    await api.getModule(api.clangFilename);
    phase = 'compile';
    self.postMessage({ type: 'phase', phase });
    log = '';
    await api.compile({ input: 'main.cpp', contents: source, obj: 'main.o' });

    if (syntaxOnly) {
      self.postMessage({ type: 'result', ok: true, phase: 'compile', log });
      return;
    }

    phase = 'link';
    self.postMessage({ type: 'phase', phase });
    await api.link('main.o', 'main.wasm');
    if (tracing) {
      phase = 'trace';
      self.postMessage({ type: 'phase', phase });
      log = '';
      await api.run(await api.getModule(api.clangFilename), 'clang', '-cc1',
        ...api.clangCommonArgs, '-ast-dump=json', '-ast-dump-main-file-only', '-x', 'c++', 'main.cpp');
      const root = /"kind"\s*:\s*"TranslationUnitDecl"/.exec(log);
      const first = root ? log.lastIndexOf('{', root.index) : -1;
      const last = log.indexOf('\n}', first);
      if (first < 0 || last <= first || log.length >= 2_000_000) {
        throw new Error('程式結構太大或無法讀取。請先試一份較短的程式。');
      }
      self.postMessage({ type: 'trace', ast: JSON.parse(log.slice(first, last + 2)) });
      return;
    }
    self.postMessage({ type: 'result', ok: true, log });
  } catch (error) {
    if ((phase === 'compile' || phase === 'link') && Number.isInteger(error?.code)) {
      self.postMessage({ type: 'result', ok: false, phase, log });
    } else {
      self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
    }
  }
};
