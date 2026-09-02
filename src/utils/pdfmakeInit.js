/**
 * pdfmakeInit.js
 *
 * Robust, unified loader and font VFS initializer for pdfmake.
 * Handles Vite bundling, CJS/ESM differences, and font dictionary structures.
 */

let _pdfMakePromise = null;

export async function getPdfMake() {
  if (!_pdfMakePromise) {
    _pdfMakePromise = (async () => {
      const [pdfMakeModule, vfsFontsModule] = await Promise.all([
        import('pdfmake/build/pdfmake.js'),
        import('pdfmake/build/vfs_fonts.js'),
      ]);

      const pdfMake = pdfMakeModule.default || pdfMakeModule;
      const vfsModule = vfsFontsModule.default || vfsFontsModule;

      // Extract virtual file system dictionary
      const vfs =
        vfsModule?.pdfMake?.vfs ||
        vfsModule?.vfs ||
        (typeof vfsModule === 'object' && !vfsModule.pdfMake ? vfsModule : null) ||
        (typeof window !== 'undefined' && window.pdfMake?.vfs) ||
        (typeof globalThis !== 'undefined' && globalThis.pdfMake?.vfs) ||
        {};

      pdfMake.vfs = vfs;

      if (typeof pdfMake.addVirtualFileSystem === 'function') {
        pdfMake.addVirtualFileSystem(vfs);
      }

      return pdfMake;
    })();
  }

  return _pdfMakePromise;
}
