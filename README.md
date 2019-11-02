# discord-scm-action
> GitHub Action to upload build artifacts and messages to a Discord channel.

## Inputs

### `discordWebhookId`
**Required** ID of the Discord webhook to post to.

### `discordWebhookToken`
**Required** Token of the Discord webhook to post to.

### `artifacts`
**Required** The path to the artifacts to upload.

## Example

```yaml
- uses: ToppleTheNun/discord-scm-action@version
  with:
    discordWebhookId: ${{ secrets.DISCORD_WEBHOOK_ID }}
    discordWebhookToken: ${{ secrets.DISCORD_WEBHOOK_TOKEN }}
    artifacts: README.md
```
