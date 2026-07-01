const git = require('simple-git');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const config = require('./config.json');

async function run() {

    const repoPath = "./temp/repo";

    console.log("Cloning repository...");

    await git().clone(config.repo, repoPath);

    console.log("Clone completed");

    const files = glob.sync(`${repoPath}/**/*.tf`);

    let modified = false;

    for (const file of files) {

        let content = fs.readFileSync(file, "utf8");

        if(content.includes("azure_function")) {

            content = content.replaceAll(
                "azure_function",
                "azure_windows_functionapp"
            );

            fs.writeFileSync(file, content);

            console.log(`Updated: ${file}`);

            modified = true;
        }
    }

    if(modified){

        const repoGit = git(repoPath);

        await repoGit.add(".");

        await repoGit.commit(
            "Automated change: azure_function → azure_windows_functionapp"
        );

        await repoGit.push();

        console.log("Changes pushed");
    }
    else{
        console.log("No changes found");
    }
}

run();