# Put Anima Kingdoms on GitHub

The complete source is prepared, but the GitHub connector used in this session does not expose repository creation. No GitHub repository was created. Its accessible repository read/write tools are not a substitute for that missing capability.

Create an empty private repository named **Anima-Kingdoms** in the intended GitHub account. Do not initialize it with an unrelated project or overwrite an existing repository. Once its URL is supplied and accessible to the connector, this source can be populated there.

For a developer importing the ZIP locally:

1. Extract `Anima-Kingdoms/`.
2. Read `README.md` and run the retained tests.
3. Initialize Git in that extracted source directory, add its files and commit them.
4. Add the URL of the newly created empty repository as the remote and push its main branch using your own GitHub authentication.

The optional `Anima-Kingdoms-history.bundle` alongside the source contains the existing Site source history. To recover that history instead of initializing a new root, clone the bundle into a separate directory and then add your empty GitHub repository as a remote. The bundle contains source history, not credentials or `node_modules`.

The `.openai/hosting.json` in the source identifies the existing owned Site. Reuse it when updating that Site; do not create another Site accidentally. A separate hosting target needs its own explicit configuration.
