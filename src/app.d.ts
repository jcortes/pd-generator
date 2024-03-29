// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		interface ComponentProps {
			name: string;
			description: string;
			apiDocsUrl?: string;
			apiDocs?: string;
		}

		// create interface for each component type based on ComponentProps
		interface ActionProps extends ComponentProps {}

		interface SourceProps extends ComponentProps {
			strategy: "default" | "polling" | "webhook";
		}
		
		interface RequestData {
			lib: "axios" | "graphql";
			app: string;
			baseUrl: string;
			versionPath: string;
			actions: any[];
			sources: any[];
			buildPath: string;
			mainApiDocs: string;
			mainApiDocsUrl: string;
			aiEnabled: boolean;
		};

		interface ResponseData {
			success: any;
			message: any;
			loading?: boolean;
		};

		interface CreateComponentFileCurryArgs {
			app: string;
			type: string;
			componentName: string;
			key: string;
			name: string;
			description: string;
			strategy: string;
			apiDocsUrl: string;
			apiDocs: string;
		};
		
		interface ComponentMapperArgs {
			app: string;
			type: string;
		};
		
		interface ComponentMapperCurryArgs {
			name: string;
			description: string;
			strategy: string;
			apiDocsUrl: string;
			apiDocs: string;
		};
		
		interface GetFileAndTemplateArgs {
			appDir: string;
			type: string;
			componentName: string;
		};
	}
}

export {};
