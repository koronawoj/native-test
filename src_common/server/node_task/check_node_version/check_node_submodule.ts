import clc from 'cli-color';
import { execCommand } from './check_node_exec';
import * as fs from 'fs';

const checkCommit = (item: string | undefined): string => {
    if (item === undefined) {
        throw Error('Expected hash');
    }

    if (item.length !== 40) {
        throw Error(`Incorrect comit => ${item}`);
    }

    return item;
};

const getCommits = async (command: string): Promise<Array<string>> => {
    const result = await execCommand(command);
    return result.trim().split('\n').map(checkCommit);
};

const getCommonHash = async (commit: string, git_item: string): Promise<string> => {
    const tree = await execCommand(`git ls-tree ${commit}`);

    const treeLines = tree.trim().split('\n');

    for (const item of treeLines) {
        const [details, item_name] = item.trim().split('\t');

        if (item_name === undefined || details === undefined) {
            throw Error('Commit parsing problem');
        }

        if (item_name === git_item) {
            const [_rights, _type, hash] = details.trim().split(' ');
            return checkCommit(hash);
        }
    }

    throw Error(`Item ${git_item} not found in ${commit}`);
};

const pathExists = async (path: string): Promise<boolean> => {
    return new Promise((resolve) => {
        fs.exists(path, (exist) => {
            resolve(exist);
        });
    });
};

const checkSubmolduleOne = async (submodule_dir: string, submodule_main_branch: string): Promise<void> => {

    const exist = await pathExists(`${submodule_dir}/.git`);

    if (exist === false) {
        console.info(clc.red(`You must init the submodule: "${submodule_dir}", you can use the command: "git submodule update --init --recursive"`));
        process.exit(1);
    }

    const submoduleGit = await fs.promises.stat(`${submodule_dir}/.git`);

    if (!submoduleGit.isFile()) {
        console.info(clc.red(`The file was expected: "${submodule_dir}"`));
        process.exit(1);
    }


    const main_branch_commits = await getCommits('git log --pretty=format:%H');
    await execCommand(`cd ${submodule_dir} && git fetch origin`);
    const submodule_branch_commits = await getCommits(`cd ${submodule_dir} && git log ${submodule_main_branch} --pretty=format:%H`);

    const commit_new = main_branch_commits[0];
    const commit_prev = main_branch_commits[1];

    if (commit_new === undefined || commit_prev === undefined) {
        throw Error('There should be at least two commits in the main repository');
    }

    const submodule_commit_new = await getCommonHash(commit_new, submodule_dir);
    const submodule_commit_prev = await getCommonHash(commit_prev, submodule_dir);

    if (!submodule_branch_commits.includes(submodule_commit_new)) {
        console.info(clc.red(`This commit ${submodule_commit_new} is not part of the main branch in "${submodule_main_branch}"`));
        process.exit(1);
    }

    if (!submodule_branch_commits.includes(submodule_commit_prev)) {
        console.info(clc.red(`This commit ${submodule_commit_prev} is not part of the main branch in "${submodule_main_branch}"`));
        process.exit(1);
    }

    const commit_new_index = submodule_branch_commits.findIndex(item => item === submodule_commit_new);
    const commit_prev_index = submodule_branch_commits.findIndex(item => item === submodule_commit_prev);
    
    if (commit_new_index > commit_prev_index) {
        console.info(clc.red(`You are trying to point to an older commit in "${submodule_dir}"`));
        process.exit(1);
    }


    const current_set_commit_in_submodule = await getCommits(`cd ${submodule_dir} && git log -1 --pretty=format:%H`);

    const submoduleCommit = current_set_commit_in_submodule[0];
    if (submoduleCommit === undefined) {
        throw Error('String expected');
    }

    if (submodule_commit_new !== submoduleCommit) {
        console.info(clc.red(`Gitsubmodule "${submodule_dir}" is set to a different commit. MainRepository -> ${submodule_dir} -> "${submodule_commit_new}", Submodule(${submodule_dir}) -> "${submoduleCommit}". You can use "git submodule update --init --recursive"`));
        process.exit(1);
    }

    console.info(clc.green(`Submodule ${submodule_dir} - OK`));
};

export const checkSubmoldule = async (): Promise<void> => {
    await execCommand('git fetch');
    const list = await execCommand('git submodule status');
    const lines = list.trim().split('\n');

    for (const item of lines) {
        const [_hash, submodule] = item.split(' ');

        if (submodule === undefined) {
            throw Error('String expected');
        }

        await checkSubmolduleOne(submodule, 'origin/master');
    }
};

/*
    git ls-tree 6ec037b12abf2996d0fb4a0012398831901b9368
        show commit tree
*/
