import { existsSync } from 'fs';
import { join } from 'path';
import * as simpleGit from 'simple-git/promise';
import { github, reposDir } from './config';

export async function fetch() {
  console.log('Fetching Repos');
  const git = simpleGit(`./${reposDir}`);

  for (const repo in github.repositories) {
    if (github.repositories.hasOwnProperty(repo)) {
      const branch = github.repositories[repo];

      let pull;
      if (!existsSync(join(process.cwd(), reposDir, repo))) {
        // fetch a new repo
        console.log(`Cloning ${repo} #${branch}`);
        await git.clone(`git@github.com:${github.organization}/${repo}`, repo);
        pull = simpleGit(`./${reposDir}/${repo}`);
      } else {
        // reset and pull
        console.log(`Updating ${repo} #${branch}`);
        pull = simpleGit(`./${reposDir}/${repo}`);
        await pull.reset('hard');
        await pull.pull();
      }
      // checkout the configured branch
      await pull.checkout(branch);
    }
  }
}
