<script>
  let app = "";
  let baseUrl = "";
  let versionPath = "";
  let buildPath = "";

  /**
	 * @type {{ name: string, description: string }[]}
	 */
  let actions = [];
  /**
	 * @type {{ name: string, description: string, strategy: "default" | "polling" | "webhook" }[]}
	 */
  let sources = [];
  /**
	 * @type {{ success: any; message: any; } | undefined}
	 */
  let data;

  async function handleSubmit() {
    data = undefined;
    const response = await fetch("/api/generator", {
      method: "POST",
      body: JSON.stringify({
        app,
        baseUrl,
        versionPath,
        actions,
        sources,
        buildPath
      }),
      headers: {
        "content-type": "application/json",
        "Accept": "application/json"
      }
    });
    data = await response.json();
  }

  function addAction() {
    actions = actions.concat({ name: "", description: "" });
  }

  /**
	 * @param {number} index
	 */
  function removeAction(index) {
    actions = actions.filter((_, idx) => idx !== index);
  }

  function addSource() {
    sources = sources.concat({ name: "", description: "", strategy: "default" });
  }

  /**
	 * @param {number} index
	 */
  function removeSource(index) {
    sources = sources.filter((_, idx) => idx !== index);
  }

  /**
	 * @param {number} index
	 * @param {string} description
	 */
  function handleSourceDescription(index, description) {
    if (description.includes("|")) {
      const [name, desc] = description.split("|");
      sources = sources.map((source, idx) => {
        return idx !== index
          ? source
          : {
            ...source,
            name: name.trim(),
            description: desc.trim()
          };
      });
    }
  }

  /**
	 * @param {number} index
	 * @param {string} description
	 */
  function handleActionDescription(index, description) {
    if (description.includes("|")) {
      const [name, desc] = description.split("|");
      actions = actions.map((action, idx) => {
        return idx !== index
          ? action
          : {
            ...action,
            name: name.trim(),
            description: desc.trim()
          };
      });
    }
  }
</script>

<h1>Pipedream Generator</h1>

<form>
  <div style="display: flex; justify-content: left;">
    <input id="app-name" type="text" bind:value={app} placeholder="App Name" style="flex-basis: 30%; margin-right: 6px; font-size: inherit;"/>
  </div>
  <br>

  <div style="display: flex; justify-content: left;">
    <input id="base-url" type="text" bind:value={baseUrl} placeholder="Base URL" style="flex-basis: 30%; margin-right: 6px; font-size: inherit;"/>
  </div>
  <br>

  <div style="display: flex; justify-content: left;">
    <input id="version-path" type="text" bind:value={versionPath} placeholder="Version Path" style="flex-basis: 15%; margin-right: 6px; font-size: inherit;"/>
  </div>
  <br>

  <div style="display: flex; justify-content: left;">
    <input id="build-path" type="text" bind:value={buildPath} placeholder="Build Path" style="flex-basis: 30%; margin-right: 6px; font-size: inherit;"/>
  </div>
  <br>

  <div>
    <label for="action-components" style="font-size: x-large;">Actions:</label>
    <button type="button" on:click={addAction} style="height: 4vh; width: 3vw; font-size: inherit;">+</button>
  </div>
  {#each actions as action, idx}
    <br>
    <div style="display: flex; justify-content: left;">
      <input type="text" bind:value={action.name} placeholder="Name" style="flex-basis: 15%; margin-right: 6px; font-size: inherit;"/>
      <textarea bind:value={action.description} placeholder="Description" rows="3" style="flex-basis: 45%; margin-right: 6px; font-size: inherit;" on:change={() => handleActionDescription(idx, action.description)}></textarea>
      <button type="button" on:click={() => removeAction(idx)} style="height: 4vh; width: 3vw; font-size: inherit;">x</button>
    </div>
  {/each}

  <br>
  <div>
    <label for="source-components" style="font-size: x-large;">Sources:</label>
    <button type="button" on:click={addSource} style="height: 4vh; width: 3vw; font-size: inherit;">+</button>
  </div>
  {#each sources as source, idx}
    <br>
    <div style="display: flex; justify-content: left;">
      <input type="text" bind:value={source.name} placeholder="Name" style="flex-basis: 15%; margin-right: 6px; font-size: inherit;"/>
      <textarea bind:value={source.description} placeholder="Description" rows="3" style="flex-basis: 45%; margin-right: 6px;" on:change={() => handleSourceDescription(idx, source.description)}></textarea>
      <div style="flex-basis: 10%; margin-right: 6px;">
        <label for="strategy">Strategy:</label>
        <select id="strategy" bind:value={source.strategy}>
          <option value="default">Default</option>
          <option value="polling">Polling</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>
      <button type="button" on:click={() => removeSource(idx)} style="height: 4vh; width: 3vw; font-size: inherit;">x</button>
    </div>
  {/each}

  <br>
  <br>
  <div>
    <button type="button" on:click={handleSubmit} style="height: 4vh; width: 6vw; font-size: large;">Submit</button>
  </div>
</form>

{#if data?.success}
  <div>
    <h2>App generated successfully!</h2>
  </div>
{:else if data?.message}
  <div>
    <h2>Error generating app</h2>
    <pre>{data?.message}</pre>
  </div>
{/if}
