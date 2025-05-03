#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;

if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN environment variable is required');
}

if (!OWNER || typeof OWNER !== 'string') {
    throw new Error('GITHUB_OWNER environment variable is required');
  }

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

class GithubRepoCreator {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'github-repo-creator',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_repository',
          description: 'Creates a new repository on GitHub',
          inputSchema: {
            type: 'object',
            properties: {
              repository_name: {
                type: 'string',
                description: 'The name of the repository to create',
              },
            },
            required: ['repository_name'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'create_repository') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      const repositoryName = request.params.arguments?.repository_name;

      if (!repositoryName) {
        throw new McpError(ErrorCode.InvalidParams, 'Repository name is required');
      }

      try {
        const response = await octokit.repos.createForAuthenticatedUser({
          name: repositoryName as string,
        });

        return {
          content: [
            {
              type: 'text',
              text: `リポジトリ"${repositoryName}"が正常に作成されました。 URL: ${response.data.html_url}`,
            },
          ],
        };
      } catch (error: any) {
        console.error(error);
        throw new McpError(ErrorCode.InternalError, 'リポジトリの作成に失敗しました: ' + error.message);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Github Repo Creator MCP server running on stdio');
  }
}

const server = new GithubRepoCreator();
server.run().catch(console.error);
