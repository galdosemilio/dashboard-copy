import { readdirSync, writeFileSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import * as nodeSass from 'node-sass';
import { dirname, extname, join, resolve } from 'path';
import { Bundler, BundleResult } from 'scss-bundle';
import { libSrc } from './utils';

export async function bundleScss(libName: string) {
  switch (libName) {
    case 'datepicker':
      await new Launcher(
        resolve(libSrc(libName)),
        'datepicker.scss',
        `./dist/libs/${libName}/_theming.scss`
      ).Bundle();

      const prebuilt = resolve(join(libSrc(libName), `prebuilt-themes`));
      readdirSync(prebuilt).filter(async name => {
        await new Launcher(
          resolve('./'),
          join(prebuilt, name),
          `./dist/libs/${libName}/prebuilt-themes/${name.replace('.scss', '.css')}`
        ).Bundle();
      });
      break;
    default:
  }
}

class Launcher {
  constructor(private project: string, private entry: string, private dest: string) {}

  public async Bundle(): Promise<void> {
    // absolute project directory path.
    const bundler = new Bundler(undefined, this.project);
    // relative file path to project directory path.
    const bundleResult = await bundler.Bundle(this.entry);
    if (!bundleResult.found) {
      console.error(`datepicker.scss file not found ${bundleResult.filePath}`);
      process.exit(1);
    }

    this.bundleResultForEach(bundleResult, result => {
      if (!result.found && result.tilde) {
        console.error(`Import file was not found: ${result.filePath}`);
        process.exit(1);
      }
    });

    if (bundleResult.bundledContent === null) {
      console.error(`Error: Concatenation result has no content.`);
      process.exit(1);
    }
    try {
      this.renderScss(bundleResult.bundledContent || '').then((compiled: any) => {
        // ensure the directory exists
        mkdirpSync(dirname(this.dest));

        if (extname(this.dest) === '.scss') {
          writeFileSync(this.dest, bundleResult.bundledContent);
        } else if (extname(this.dest) === '.css') {
          writeFileSync(this.dest, compiled.css);
        }

        // const fullPath = resolve(this.dest);
        // console.log(`[Done] Bundled into: ${fullPath}`);
      });
    } catch (scssError) {
      console.error(`Error: There is an error in your styles: ${scssError}`);
      process.exit(1);
    }
  }

  bundleResultForEach(bundleResult: BundleResult, cb: (bundleResult: BundleResult) => void): void {
    cb(bundleResult);
    if (bundleResult.imports !== null) {
      for (const bundleResultChild of bundleResult.imports || []) {
        this.bundleResultForEach(bundleResultChild, cb);
      }
    }
  }

  tildeImporter: nodeSass.Importer = (url: string) => {
    if (url[0] === '~') {
      const filePath = resolve('./node_modules', url.substr(1));
      return { file: filePath };
    }
    return { file: url };
  };

  async renderScss(content: string): Promise<{}> {
    return new Promise((presolve, reject) => {
      nodeSass.render(
        {
          data: content,
          outputStyle: 'compressed',
          importer: this.tildeImporter
        },
        (error, result) => {
          if (error !== null) {
            reject(`${error.message} on line (${error.line}, ${error.column})`);
          }
          presolve(result);
        }
      );
    });
  }
}
