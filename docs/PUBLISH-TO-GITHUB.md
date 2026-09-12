# GitHub source and deployment

The source is now maintained at [venividis/Anima-Kingdoms](https://github.com/venividis/Anima-Kingdoms), the private repository supplied by the owner. No new repository needs to be created.

Clone it using your normal GitHub authentication:

```sh
git clone https://github.com/venividis/Anima-Kingdoms.git
cd Anima-Kingdoms
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Read [SOURCE-IMPORT.md](SOURCE-IMPORT.md) for the original-to-imported commit mapping and instructions for recovering exact original history from the retained bundle.

The `.openai/hosting.json` identifies the existing owned Site. Reuse it when updating that Site; a separate hosting target needs its own configuration. Source import does not deploy the Site or install an automatic deployment workflow.
