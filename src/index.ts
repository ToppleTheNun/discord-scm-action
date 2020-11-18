import * as path from "path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import * as Discord from "discord.js";
import * as glob from "glob";

function getInput(name: string, options?: core.InputOptions): string {
  const val = process.env[name.replace(/ /g, "_").toUpperCase()] || "";
  if (options && options.required && !val) {
    throw new Error(`Input required and not supplied: ${name}`);
  }
  return val.trim();
}

async function run() {
  try {
    let gitCliSha = "";
    const githubContextSha = github.context.sha;
    await exec.exec("git", ["rev-parse", "HEAD"], {
      listeners: {
        stdout: (data: Buffer) => {
          gitCliSha += data.toString();
        }
      }
    });
    const gitSha = githubContextSha || gitCliSha;

    core.debug(`Found Git SHA: "${gitSha}"`);

    let gitCommitMessage = "";
    await exec.exec("git", ["log", "-1", "--pretty=%B"], {
      listeners: {
        stdout: (data: Buffer) => {
          gitCommitMessage += data.toString();
        }
      }
    });

    core.debug(`Found Git Commit Message: "${gitCommitMessage.trim()}"`);

    const discordWebhookId = getInput("discord_Webhook_Id", {
      required: true
    });
    const discordWebhookToken = getInput("discord_Webhook_Token", {
      required: true
    });

    const artifacts = getInput("artifacts") || "";
    const pathToArtifacts = path.join(process.cwd(), artifacts);
    const artifactsPaths = glob.sync(pathToArtifacts);
    const artifactsFiles = artifactsPaths.map(artifact => ({
      attachment: artifact,
      name: path.basename(artifact)
    }));

    core.debug(`artifactsFiles=${JSON.stringify(artifactsFiles)}`);
    const hook = new Discord.WebhookClient(
      discordWebhookId,
      discordWebhookToken
    );
    core.debug("sending message to discord hook");
    await hook.send(gitCommitMessage.trim(), {
      files: artifactsFiles
    });
    core.debug("sent to webhook");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run().then(() => {
  core.debug("");
});
