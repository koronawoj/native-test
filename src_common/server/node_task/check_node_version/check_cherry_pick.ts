import clc from 'cli-color';
import { execCommand } from './check_node_exec';

const checkCommit = (item: string | undefined): string => {
    if (item === undefined) {
        throw Error('Expected hash');
    }

    if (item.length !== 40) {
        throw Error(`Incorrect comit => ${item}`);
    }

    return item;
};

interface CommitRecordType {
    hash: string,
    author: string,
    comment: string,
}

const convertToCommitStruct = (line: string): CommitRecordType => {
    const chunks = line.split('=====');
    if (chunks.length !== 3) {
        throw Error('Expected 3 chunks');
    }

    const hash = chunks[0];
    const author = chunks[1];
    const comment = chunks[2];

    if (hash === undefined || author === undefined || comment === undefined) {
        throw Error('invalid commit line');
    }

    return {
        hash: checkCommit(hash),
        author,
        comment,
    };
};

const getCommits = async (command: string): Promise<Array<CommitRecordType>> => {
    const result = await execCommand(command);
    return result.trim().split('\n').map(item => item.trim()).map(convertToCommitStruct);
};

interface ReleaseBranch {
    branch: string,
    bigVersion: number,
    smallVersion: number,
    minorVersion: number,
}

const allowChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const parseNumber = (version: string): number | null => {    
    for (let i=0; i<version.length; i++) {
        const cher = version[i];

        if (cher === undefined) {
            throw Error('Incorrect code branch');
        }

        if (allowChars.includes(cher) === false) {
            return null;
        }
    }

    return parseInt(version, 10);
};

const parseMinor = (version: string | undefined): number => {
    if (version === undefined) {
        return 0;
    }
    return parseNumber(version) ?? 0;
};

const convertToReleaseBranch = (branch: string, version: string): ReleaseBranch => {
    const chunks = version.split('.');

    const big = chunks[0];
    const small = chunks[1];
    const minor = chunks[2];

    if (big === undefined || small === undefined) {
        throw Error(`Invalid release branch name(1) = ${version}`);
    }

    const bigVersion = parseNumber(big);
    const smallVersion = parseNumber(small);
    const minorVersion = parseMinor(minor);

    if (bigVersion === null || smallVersion === null) {
        throw Error(`Invalid release branch name(2) = ${version}`);
    }

    return {
        branch,
        bigVersion,
        smallVersion,
        minorVersion,
    };
};

const getBranchVersion = (branch: string): ReleaseBranch | null => {
    const prefix = 'origin/release-';
    const start = branch.substr(0, prefix.length);

    if (start.toLowerCase() === prefix) {
        const version = branch.substr(prefix.length);
        return convertToReleaseBranch(branch, version);
    }

    return null;
};

const findLastReleaseBranch = async (releaseToCheck: number): Promise<Array<string>> => {
    await execCommand('git remote update --prune');
    const remote = await execCommand('git branch -r');

    const branches = remote
        .trim()
        .split('\n')
        .map(item => item.trim());

    const versions: Array<ReleaseBranch> = [];

    for (const item of branches) {
        const version = getBranchVersion(item);
        if (version !== null) {
            versions.push(version);
        }
    }

    versions.sort((a: ReleaseBranch, b: ReleaseBranch): number => {
        if (a.bigVersion > b.bigVersion) {
            return 1;
        }

        if (a.bigVersion < b.bigVersion) {
            return -1;
        }

        if (a.smallVersion > b.smallVersion) {
            return 1;
        }

        if (a.smallVersion < b.smallVersion) {
            return -1;
        }

        if (a.minorVersion > b.minorVersion) {
            return 1;
        }

        if (a.minorVersion < b.minorVersion) {
            return -1;
        }

        return 0;
    });

    const out: Array<string> = [];

    for (let i=0; i<releaseToCheck; i++) {
        const last = versions.pop();

        if (last !== undefined) {
            out.push(last.branch);
        }
    }

    return out;
};

const commitsUnique = (commits: Array<CommitRecordType>, convert: (item: CommitRecordType) => string): Set<string> => {
    const out: Set<string> = new Set();

    for (const item of commits) {
        out.add(convert(item));
    }

    return out;
};

const findLastCommonCommit = (mainBranchCommits: Array<CommitRecordType>, releaseBranchCommits: Array<CommitRecordType>): string | null => {

    const mainBranchCommitsUnique = commitsUnique(mainBranchCommits, item => item.hash);

    for (const commit of releaseBranchCommits) {
        if (mainBranchCommitsUnique.has(commit.hash)) {
            return commit.hash;
        }
    }

    return null;
};

const findNew = (commits: Array<CommitRecordType>, lastCommonCommit: string): Array<CommitRecordType> => {
    const out: Array<CommitRecordType> = [];

    for (const item of commits) {
        if (item.hash === lastCommonCommit) {
            return out;
        } else {
            out.push(item);
        }
    }

    throw Error('incorrect branch');
};

export const checkCherryPick = async (releaseToCheck: number): Promise<void> => {
    console.info('check cherry ...');


    const toShow: Array<CommitRecordType> = [];

    const release_branch_list = await findLastReleaseBranch(releaseToCheck);

    for (const release_branch of release_branch_list) {

        console.info(clc.green(`Release branch = ${release_branch}`));

        const mainBranchCommits = await getCommits('git log origin/develop --pretty=format:"%H=====%an=====%s"');
        const releaseBranchCommits = await getCommits(`git log ${release_branch} --pretty=format:"%H=====%an=====%s"`);

        console.info(`mainBranchCommits first commit = ${mainBranchCommits[0]?.hash ?? '-'} len=${mainBranchCommits.length}`);
        console.info(`releaseBranchCommits first commit = ${releaseBranchCommits[0]?.hash ?? '-'} len=${releaseBranchCommits.length}`);

        const lastCommonCommit = findLastCommonCommit(mainBranchCommits, releaseBranchCommits);

        if (lastCommonCommit === null) {
            console.info(clc.red('common comity was not found'));
            return;
        }

        const mainBranchCommitsNewest = findNew(mainBranchCommits, lastCommonCommit);
        const releaseBranchCommitsNewest = findNew(releaseBranchCommits, lastCommonCommit);

        const mainBranchNames: Set<string> = commitsUnique(mainBranchCommitsNewest, (item) => item.comment);

        for (const commit of releaseBranchCommitsNewest) {
            if (mainBranchNames.has(commit.comment) === false) {
                toShow.push(commit);
            }
        }
    }

    if (toShow.length > 0) {
        console.info('');
        console.info('');

        for (const commit of toShow) {
            console.info(clc.red('Missing cherry-pick'));
            console.info(clc.red(`hash: ${commit.hash}`));
            console.info(clc.red(`author: ${commit.author}`));
            console.info(clc.red(`comment: ${commit.comment}`));
            console.info('');
            console.info('');
        }
    }
};

