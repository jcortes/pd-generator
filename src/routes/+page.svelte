<script lang="ts">
  let lib = "axios";
  let app = "";
  let baseUrl = "";
  let versionPath = "";
  let buildPath = "";
  let mainApiDocs = "";
  let mainApiDocsUrl = "";

  let actions: App.ActionProps[] = [];
  let sources: App.SourceProps[] = [];
  
  let responseData: App.ResponseData | undefined;

  async function handleSubmit() {
    responseData = {
      success: undefined,
      message: undefined,
      loading: true
    };
    const response = await fetch("/", {
      method: "POST",
      body: JSON.stringify({
        lib,
        app,
        baseUrl,
        versionPath,
        actions,
        sources,
        buildPath,
        mainApiDocs,
        mainApiDocsUrl
      }),
      headers: {
        "content-type": "application/json",
        "Accept": "application/json"
      }
    });
    responseData = await response.json();
  }

  function addAction() {
    actions = actions.concat({ name: "", description: "", apiDocsUrl: "" });
  }

  function removeAction(index: number) {
    actions = actions.filter((_, idx) => idx !== index);
  }

  function addSource() {
    sources = sources.concat({ name: "", description: "", apiDocsUrl: "", strategy: "default" });
  }

  function removeSource(index: number) {
    sources = sources.filter((_, idx) => idx !== index);
  }

  function handleSourceDescription(index: number, description: string) {
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

  function handleActionDescription(index: number, description: string) {
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
  <div>
    <label for="lib">Client Lib:</label>
    <select id="lib" bind:value={lib}>
      <option value="axios">Axios</option>
      <option value="graphql">GraphQL</option>
    </select>
  </div>
  <br>

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
      <input id="url-api-docs" type="text" bind:value={action.apiDocsUrl} placeholder="URL API Docs" style="flex-basis: 60%; margin-right: 6px; font-size: inherit;"/>
    </div>
    <br>
    <div style="display: flex; justify-content: left;">
      <textarea bind:value={action.apiDocs} placeholder="API Docs" rows="10" cols="150" style="flex-basis: 60%; margin-right: 6px; font-size: inherit;"></textarea>
    </div>
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
      <input id="url-api-docs" type="text" bind:value={source.apiDocsUrl} placeholder="URL API Docs" style="flex-basis: 60%; margin-right: 6px; font-size: inherit;"/>
    </div>
    <br>
    <div style="display: flex; justify-content: left;">
      <textarea bind:value={source.apiDocs} placeholder="API Docs" rows="10" cols="150" style="flex-basis: 60%; margin-right: 6px; font-size: inherit;"></textarea>
    </div>
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
  <div style="display: flex; justify-content: left;">
    <input id="url-api-docs" type="text" bind:value={mainApiDocsUrl} placeholder="URL API Docs" style="flex-basis: 45%; margin-right: 6px; font-size: inherit;"/>
  </div>
  <br>
  <div style="display: flex; justify-content: left;">
    <textarea bind:value={mainApiDocs} placeholder="API Docs" rows="10" cols="150" style="flex-basis: 45%; margin-right: 6px; font-size: inherit;"></textarea>
  </div>
  <br>
  <br>

  {#if !responseData?.loading}
  <div>
    <button type="button" on:click={handleSubmit} style="height: 4vh; width: 6vw; font-size: large;">Submit</button>
  </div>
  {/if}
</form>

{#if responseData?.success}
  <div>
    <h2>App generated successfully!</h2>
  </div>
{:else if responseData?.loading}
  <div>
    <h2>Generating app...</h2>
  </div>
{:else if responseData?.message}
  <div>
    <h2>Error generating app</h2>
    <pre>{responseData?.message}</pre>
  </div>
{/if}
