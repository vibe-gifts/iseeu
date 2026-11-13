# iseeu

[Português](README.md) · **English** · [Español](README.es.md)

**A second brain that knows you by what you do, and a personal advisor that knows how to guide you.**

Read it aloud: "I see you". In Portuguese, "eu" means "me", so it also reads "I see me". That's the point: it shows you who you are, based on facts.

On a personality test, you tick the person you'd like to be. iseeu works the other way around. It reads what you actually **said and did**: your AI chats, your WhatsApp, classes, meetings and voice notes. From that, it builds a map in Obsidian of how you think, talk, decide and relate to people.

Then it fills in six behavior tests, with evidence taken from your own words: Enneagram, DISC, the 5 pillars of leadership, mindset, situational leadership and "getting to know you". Finally, it creates a personal advisor that knows how you work.

## What it does

- **Sets itself up with you, step by step.** It asks where your conversations are and what must stay out. Then it explains how each source gets in:
  - what is on your computer, it picks up by itself (Claude Code, Codex, WhatsApp desktop app on Mac);
  - the rest you export and drop into a single folder, with step-by-step instructions for each service (ChatGPT, Claude on the web, WhatsApp on your phone).
- **Organizes on its own.** Each conversation becomes a note card. Each card becomes ideas, decisions, people and projects linked to each other, always with the exact quote and a link to the source.
- **Writes your journal.** Every day: where your head was, what you decided, your mood and what you agreed to.
- **Shows who you are, based on facts.** The six tests become charts at the top of the Obsidian panel, each one with the change worth making.
- **Builds your advisor.** An agent that reads your brain and your goal for the month, and tells you what to do now. It knows what works with you and what doesn't.
- **Redoes it every month.** On the 1st, it closes the month, retakes the tests and shows last month's result underneath the current one. That way you see whether you improved.

## Installation

**Claude Code:** in the message box, type:

```
/plugin marketplace add vibe-gifts/iseeu
/plugin install iseeu@iseeu
```

In the Claude desktop app (Code tab), click **+** next to the message box, then **Plugins** and **Add marketplace**. Enter `vibe-gifts/iseeu` and click **Add plugin**.

**Codex:** download this repository (**Code** button → **Download ZIP**) and unzip it. Then tell Codex where the `skills/iseeu` folder is.

After installing, open a conversation and write:

> I just downloaded it, set up my second brain

It takes care of the rest.

## What you need

- [Obsidian](https://obsidian.md), which is free.
- An AI that can save files on your computer: Claude Code or Codex. ChatGPT on the web helps capture conversations, but it can't organize the vault on its own.
- Python 3. On a Mac, the first time, the system offers to install the developer tools: accept.

## Good to know

- **The instructions are written in Portuguese**, but it talks to you in your own language. You set it during setup.
- **Your data stays on your computer.** The vault is a folder of text files, and nothing is sent to any server of ours. The only exception is the AI you use: it reads the text to organize it, like in any conversation.
- **You choose what goes in.** Before pulling your WhatsApp, it shows the list of conversations and you pick which ones go in. Keys and passwords it finds are removed before anything enters the vault.
- **The first load uses a lot.** Months of conversations are a lot of text. It runs a 2-day test first, shows you the cost and only continues with your OK.
- **Some parts only work on a Mac:** reading WhatsApp from the desktop app and transcribing voice notes. On Windows, WhatsApp comes in through the export on your phone.
- **The tests are a hypothesis, not a diagnosis.** Every score comes with its evidence. If you disagree, the disagreement becomes information too.

## License

MIT
