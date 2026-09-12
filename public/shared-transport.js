/* One in-flight mutation per player. An uncertain response retains the exact
 * command bytes across reloads; recovery never silently creates a second trade. */
export class RealmConnection {
  constructor({fetcher = globalThis.fetch.bind(globalThis), storage = globalThis.sessionStorage,
    token = '', onState = () => {}, onStatus = () => {}} = {}) {
    this.fetcher = fetcher;
    this.storage = storage;
    this.token = token;
    this.onState = onState;
    this.onStatus = onStatus;
    this.state = null;
    this.busy = false;
    this.pending = null;
    try { this.pending = JSON.parse(storage.getItem('anima-commons-pending') || 'null'); } catch { /* Recoverable tab storage. */ }
  }
  async request(path, body) {
    const response = await this.fetcher(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {'Content-Type': 'application/json', ...(this.token ? {Authorization: `Bearer ${this.token}`} : {})},
      ...(body === undefined ? {} : {body: JSON.stringify(body)}),
      cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    let data;
    try { data = await response.json(); } catch { throw Error('The realm returned an unreadable response. Retry to recover your last action.'); }
    if (!response.ok) {
      const error = Error(data.error?.message || 'The realm could not complete that action.');
      error.code = data.error?.code;
      error.status = response.status;
      throw error;
    }
    return data;
  }
  accept(state) {
    if (!state) return;
    // An older poll must never overwrite a more recent committed command.
    if (this.state && state.realmId === this.state.realmId && state.revision < this.state.revision) return;
    this.state = state;
    this.onState(state);
    this.onStatus(this.pending ? (this.busy ? 'confirming' : 'uncertain') : 'connected');
  }
  async refresh() {
    const token = this.token;
    try {
      const state = await this.request('/api/state');
      // A recovery-key change can finish while the previous player's poll is
      // still in flight. Neither that response nor its auth error owns this UI.
      if (token !== this.token) return this.state;
      this.accept(state);
      return state;
    } catch (error) {
      if (token !== this.token) return this.state;
      throw error;
    }
  }
  remember(command) {
    this.pending = command;
    try {
      if (command) this.storage.setItem('anima-commons-pending', JSON.stringify(command));
      else this.storage.removeItem('anima-commons-pending');
    } catch {
      // Mutation persistence is a precondition, not a best-effort convenience.
      if (command) { this.pending = null; throw Error('This tab cannot preserve a pending action. Enable tab storage before trading.'); }
    }
  }
  async command(op, payload = {}) {
    if (this.busy) throw Error('Your previous action is still being confirmed.');
    if (this.pending) throw Error('Recover your pending action before starting another.');
    if (!this.state) await this.refresh();
    this.remember({key: crypto.randomUUID(), expectedRevision: this.state.revision, op, payload});
    return this.recover();
  }
  async recover() {
    if (!this.pending) return null;
    if (this.busy) throw Error('An action is already being confirmed.');
    this.busy = true;
    this.onStatus('confirming');
    try {
      for (let attempts = 0; attempts < 4; attempts++) {
        try {
          const result = await this.request('/api/command', this.pending);
          this.remember(null);
          this.accept(result.state);
          return result;
        } catch (error) {
          if (error.code === 'REVISION_CONFLICT' && attempts < 3) {
            const state = await this.refresh();
            // This explicit rejection proves the old revision did not commit.
            this.remember({...this.pending, expectedRevision: state.revision});
            continue;
          }
          if (error.status >= 400 && error.status < 500) this.remember(null);
          this.onStatus(this.pending ? 'uncertain' : 'connected');
          throw error;
        }
      }
    } finally { this.busy = false; }
  }
}
