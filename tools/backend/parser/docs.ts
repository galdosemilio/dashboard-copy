import { readFileSync } from 'fs';

export function docsParser(files: string[]) {
  let jsDocs: Array<any> = [];
  let jsDefs: Array<any> = [];

  console.log(`\nExtracting JSDocs from ${files.length} files.`);
  for (const srcFile of files) {
    const content = readFileSync(srcFile, 'utf-8');
    const matches = (content.match(/\/\*\*(.|\s)*?\*\//g) || []).map(doc => ({ doc, srcFile }));

    // extract the definitions
    const defs = matches.filter(
      match =>
        !match.doc.includes('@apiDeprecated') &&
        !match.doc.includes('@genIgnore') &&
        match.doc.includes('@apiDefine ')
    );
    jsDefs = jsDefs.concat(defs);

    // extract the api
    const docs = matches.filter(
      match =>
        !match.doc.includes('@apiDeprecated') &&
        !match.doc.includes('@genIgnore') &&
        match.doc.includes('@api ')
    );
    jsDocs = jsDocs.concat(docs);
  }

  return { jsDefs, jsDocs };
}
